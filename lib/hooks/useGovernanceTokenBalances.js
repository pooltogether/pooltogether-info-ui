import { useReadProviders } from '@pooltogether/hooks'

import ERC20Abi from 'abis/ERC20Abi'
import { contract, batch } from '@pooltogether/etherplex'
import { CONTRACT_ADDRESSES, QUERY_KEYS } from 'lib/constants'
import { useQuery } from 'react-query'
import { useChainIds } from 'lib/hooks/useChainIds'
import {
  addBigNumbers,
  amountMultByUsd,
  sToMs,
  toNonScaledUsdString,
  toScaledUsdBigNumber
} from '@pooltogether/utilities'
import { formatUnits } from '@ethersproject/units'
import { useTokenLists } from 'lib/hooks/useTokenLists'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'
import { useEffect } from 'react'

export const useGovernanceTokenBalances = () => {
  const chainIds = useChainIds()
  const tokenLists = useTokenLists(chainIds)
  const { readProviders, isReadProvidersReady } = useReadProviders(chainIds)

  const enabled = isReadProvidersReady

  const tokenBalances = useQuery(
    [QUERY_KEYS.getTimelockTokenBalance, chainIds],
    () => getGovernanceTokenBalancesForAllChainIds(chainIds, readProviders, tokenLists),
    {
      enabled,
      refetchInterval: sToMs(120),
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  )

  const tokenPrices = useTokenPrices()

  const isFetched = tokenBalances.isFetched && tokenPrices.isFetched
  const isFetching = tokenBalances.isFetching && tokenPrices.isFetching
  const refetch = async () => {
    tokenBalances.refetch()
    tokenPrices.refetch()
  }

  let data = {}
  if (isFetched) {
    Object.keys(tokenBalances.data).forEach((chainId) => {
      const tokens = tokenBalances.data[chainId] || []
      tokens.forEach((token) => {
        if (!data[chainId]) {
          data[chainId] = []
        }

        const tokenAddress = token.address
        const tokenPriceData = tokenPrices.data[chainId]?.[tokenAddress] || {}

        const usd = tokenPriceData.usd

        if (!usd) {
          data[chainId].push({
            ...token,
            chainId: Number(chainId)
          })
        } else {
          const usdValueUnformatted = amountMultByUsd(token.amountUnformatted, usd)
          const totalValueUsd = formatUnits(usdValueUnformatted, token.decimals)
          const totalValueUsdScaled = toScaledUsdBigNumber(totalValueUsd)

          data[chainId].push({
            ...token,
            chainId: Number(chainId),
            usd,
            totalValueUsd,
            totalValueUsdScaled
          })
        }
      })
    })
  }

  return {
    refetch,
    isFetched,
    isFetching,
    data
  }
}

export const useGovernanceTokenBalancesFlattened = () => {
  const { data, ...remainder } = useGovernanceTokenBalances()
  let balances = null
  if (data) {
    balances = []
    const chainIds = Object.keys(data)
    chainIds.forEach((chainId) => {
      const chainBalances = data[chainId]
      balances.push(...chainBalances)
    })
  }
  return { ...remainder, data: balances }
}

/**
 * Add the total values of all of the token balances, filter out tokens we don't have USD values for
 * @returns
 */
export const useGovernanceTokenBalancesTotal = () => {
  const { data, isFetched } = useGovernanceTokenBalancesFlattened()

  if (!isFetched) {
    return {
      isFetched,
      data: {
        totalValueUsd: null,
        totalValueUsdScaled: null
      }
    }
  }

  const totalValueUsdScaled = addBigNumbers(
    data.map((balance) => balance.totalValueUsdScaled).filter(Boolean)
  )
  const totalValueUsd = toNonScaledUsdString(totalValueUsdScaled)

  return {
    isFetched,
    data: {
      totalValueUsd,
      totalValueUsdScaled
    }
  }
}

const getGovernanceTokenBalancesForAllChainIds = async (chainIds, readProviders, tokenLists) => {
  const responses = await Promise.all([
    ...chainIds.map(async (chainId) => {
      return {
        chainId: chainId,
        data: await getGovernanceTokenBalances(chainId, readProviders[chainId], tokenLists[chainId])
      }
    })
  ])
  const result = {}
  responses.forEach((response) => {
    result[response.chainId] = response.data
  })
  return result
}

const getGovernanceTokenBalances = async (chainId, readProvider, tokenList) => {
  try {
    // First set of calls
    let batchCalls = []

    const timelockAddress = CONTRACT_ADDRESSES[chainId].GovernanceTimelock

    tokenList.forEach((tokenAddress) => {
      const tokenContract = contract(tokenAddress, ERC20Abi, tokenAddress)

      batchCalls.push(tokenContract.balanceOf(timelockAddress).decimals().name().symbol())
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
