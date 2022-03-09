import { useQuery } from 'react-query'
import { useReadProviders } from '@pooltogether/hooks'
import { contract, batch } from '@pooltogether/etherplex'
import { formatUnits } from '@ethersproject/units'
import { sToMs } from '@pooltogether/utilities'

import ERC20Abi from 'abis/ERC20Abi'
import { QUERY_KEYS } from 'lib/constants'

export const useTokenBalances = (chainIds, tokenLists, addressesLists) => {
  const providers = useReadProviders(chainIds)

  return useQuery(
    [QUERY_KEYS.getTokenBalances, chainIds, addressesLists],
    () => getTokenBalancesForChainIdsAndAddresses(chainIds, providers, tokenLists, addressesLists),
    {
      refetchInterval: sToMs(120),
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
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

  const result = {}
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

    const result = []
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
