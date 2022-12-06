import ERC20Abi from '@abis/ERC20Abi'
import { QUERY_KEYS } from '@constants/legacy'
import { formatUnits } from '@ethersproject/units'
import { contract, batch } from '@pooltogether/etherplex'
import { getReadProviders } from '@pooltogether/wallet-connection'
import { BigNumber } from 'ethers'
import { useQueries, useQuery } from 'react-query'
import { RPC_URLS } from '../constants/rpc'

export const useTokenBalances = (
  tokenLists: { [chainId: number]: string[] },
  addressesLists: { [chainId: number]: string }
) => {
  const chainIds = Object.keys(tokenLists).map(Number)
  const providers = getReadProviders(chainIds, RPC_URLS)

  return useQuery([QUERY_KEYS.getTokenBalances, chainIds, addressesLists], () =>
    getTokenBalancesForChainIdsAndAddresses(chainIds, providers, tokenLists, addressesLists)
  )
}

export const useAllTokenBalances = (
  tokenLists: { [chainId: number]: string[] },
  addressLists: { [chainId: number]: string }[]
) => {
  const tokenChainIds = Object.keys(tokenLists).map(Number)

  return useQueries(
    addressLists.map((addressList) => {
      const addressChainIds = Object.keys(addressList).map(Number)
      const providers = getReadProviders(addressChainIds, RPC_URLS)

      return {
        queryKey: [QUERY_KEYS.getTokenBalances, addressChainIds, tokenChainIds, addressList],
        queryFn: () =>
          getTokenBalancesForChainIdsAndAddresses(
            addressChainIds,
            providers,
            tokenLists,
            addressList
          )
      }
    })
  )
}

const getTokenBalancesForChainIdsAndAddresses = async (
  chainIds,
  readProviders,
  tokenLists,
  addressesLists
) => {
  const responses = await Promise.all([
    ...chainIds.map(async (chainId) => {
      return {
        chainId: chainId,
        data: await getTokenBalancesForAddress(
          readProviders[chainId],
          tokenLists[chainId],
          addressesLists[chainId]
        )
      }
    })
  ])

  const result: {
    [chainId: number]: {
      amount: string
      amountUnformatted: BigNumber
      address: string
      decimals: string
      name: string
      symbol: string
    }[]
  } = {}
  responses.forEach((response) => {
    result[response.chainId] = response.data
  })

  return result
}

const getTokenBalancesForAddress = async (readProvider, tokenList, address) => {
  if (!address) {
    console.warn(
      'no address supplied to getTokenBalancesForAddress() with args: ',
      tokenList,
      address
    )
    return []
  }

  try {
    // First set of calls
    let batchCalls = []

    tokenList.forEach((tokenAddress) => {
      const tokenContract = contract(tokenAddress, ERC20Abi, tokenAddress)

      batchCalls.push(tokenContract.balanceOf(address).decimals().name().symbol())
    })

    const response1 = await batch(readProvider, ...batchCalls)
    batchCalls = []

    const result: {
      amount: string
      amountUnformatted: BigNumber
      address: string
      decimals: string
      name: string
      symbol: string
    }[] = []
    tokenList.forEach((tokenAddress) => {
      const amountUnformatted = response1[tokenAddress].balanceOf[0]
      const decimals = response1[tokenAddress].decimals[0]
      const amount = formatUnits(amountUnformatted, decimals)

      result.push({
        amount,
        amountUnformatted,
        address: tokenAddress,
        decimals,
        name: response1[tokenAddress].name[0],
        symbol: response1[tokenAddress].symbol[0]
      })
    })

    return result
  } catch (e) {
    console.warn(e.message)
    return null
  }
}
