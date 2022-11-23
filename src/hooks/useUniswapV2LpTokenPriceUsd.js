import { UNISWAP_GRAPH_URIS } from '@pooltogether/current-pool-data'
import { CHAIN_ID } from '@pooltogether/wallet-connection'
import { GraphQLClient } from 'graphql-request'
import gql from 'graphql-tag'
import { useQuery } from 'react-query'

export const useUniswapV2LpTokenPriceUsd = (tokenAddress) => {
  return useQuery(['useUniswapV2LpTokenPriceUsd', tokenAddress], async () =>
    getTokenPriceUsd(tokenAddress)
  )
}

const getTokenPriceUsd = async (tokenAddress) => {
  const graphQLClient = new GraphQLClient(UNISWAP_GRAPH_URIS[CHAIN_ID.mainnet])
  const data = await graphQLClient.request(gql`
      query lpPrice {
        pair(id: "${tokenAddress}") {
          totalSupply
          reserveUSD
        }
      }
    `)
  const { pair } = data
  const { totalSupply, reserveUSD } = pair
  return reserveUSD / totalSupply
}
