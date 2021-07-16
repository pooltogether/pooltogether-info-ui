import { gql, GraphQLClient } from 'graphql-request'

import { CONTRACT_ADDRESSES, UNISWAP_GRAPH_URIS } from 'lib/constants'

const KNOWN_STABLECOIN_ADDRESSES = {
  1: ['0x0a2e7f69fe9588fa7fba5f5864236883cd4aac6d', '0x391a437196c81eea7bbbbd5ed4df6b49de4f5c96'],
  137: ['0xc2132d05d31c914a87c6611c10748aeb04b58e8f', '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063']
}

const QUERY_TEMPLATE = `__alias__: tokens(where: { id_in: __addresses__ }) {
  id
  derivedETH
  decimals
  name
  symbol
}`

/**
 * Fetches token price data paired with USDt on Uniswap or the provided networks equivalent
 * @param {*} chainId
 * @param {object} addresses array of addresses
 * @returns
 */
export const getTokenPrices = async (chainId, addresses) => {
  const graphQLClient = Boolean(UNISWAP_GRAPH_URIS[chainId])
    ? new GraphQLClient(UNISWAP_GRAPH_URIS[chainId])
    : null
  if (!graphQLClient) return null

  const knownStablecoinAddresses = KNOWN_STABLECOIN_ADDRESSES?.[chainId] || []

  // We'll use this stablecoin to measure the price of ETH off of
  const stablecoinAddress = CONTRACT_ADDRESSES[chainId]?.['Stablecoin']

  // Build a query selection set from all the token addresses and block numbers
  const stablecoinsToMockByQueryAlias = {}
  let query = ``
  const tokenAddresses = addresses.map((address) => address.toLowerCase())

  const stablecoinAddresses = tokenAddresses.filter((address) =>
    knownStablecoinAddresses.includes(address)
  )
  const filteredAddresses = tokenAddresses.filter(
    (address) => !knownStablecoinAddresses.includes(address)
  )

  stablecoinsToMockByQueryAlias.tokens = stablecoinAddresses

  if (filteredAddresses.length > 0) {
    const selection = QUERY_TEMPLATE.replace('__alias__', 'tokens').replace(
      '__addresses__',
      _getTokenAddressesFilter([stablecoinAddress, ...filteredAddresses])
    )

    query = `${query}\n${selection}`
  }

  let response
  try {
    response = query
      ? await graphQLClient.request(gql`
      query tokenPriceData {
        ${query}
      }
    `)
      : {}
  } catch (e) {
    response = {}
  }

  // Format the data into a useful object
  // calculate and cache the price of eth in the data object
  const tokenPriceData = {}
  const tokens = response?.tokens || []
  const stablecoin = tokens.find((token) => token.id === stablecoinAddress)

  const ether = {
    derivedETH: '1',
    id: 'eth',
    usd: _calculateUsd(stablecoin)
  }

  tokens.forEach((token) => {
    tokenPriceData[token.id] = {
      derivedETH: token.derivedETH,
      address: token.id,
      usd: ether.usd * parseFloat(token.derivedETH),
      decimals: token.decimals,
      name: token.name,
      symbol: token.symbol
    }
  })

  Object.keys(stablecoinsToMockByQueryAlias).forEach((alias) => {
    const stablecoinsToMock = stablecoinsToMockByQueryAlias[alias]

    stablecoinsToMock.forEach((tokenAddress) => {
      tokenPriceData[tokenAddress] = {
        derivedETH: null,
        address: tokenAddress,
        usd: 1,
        decimals: null,
        name: null,
        symbol: null
      }
    })
  })

  return tokenPriceData
}

// Utils

const _getTokenAddressesFilter = (addresses) =>
  addresses.length > 0 ? `["${addresses.join('","')}"]` : '[]'

const _calculateUsd = (token) => {
  let derivedETH = token?.derivedETH

  if (!derivedETH || derivedETH === '0') {
    derivedETH = 0.2 // 1 ETH is $5 USD, used for Rinkeby, etc
  }

  return 1 / derivedETH
}
