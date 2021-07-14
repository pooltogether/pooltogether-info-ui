import { formatUnits } from '@ethersproject/units'
import {
  addBigNumbers,
  amountMultByUsd,
  toNonScaledUsdString,
  toScaledUsdBigNumber
} from '@pooltogether/utilities'

import { CONTRACT_ADDRESSES } from 'lib/constants'
import { useChainIds } from 'lib/hooks/useChainIds'
import { useTokenLists } from 'lib/hooks/useTokenLists'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'
import { useVestingPoolBalance } from 'lib/hooks/useVestingPoolBalance'
import { useTokenBalances } from 'lib/hooks/useTokenBalances'

export const useGovernanceTokenBalances = () => {
  const chainIds = useChainIds()
  const tokenLists = useTokenLists(chainIds)

  const timelockAddressesLists = timelockAddressesListsForChains(chainIds)

  const tokenBalances = useTokenBalances(chainIds, tokenLists, timelockAddressesLists)
  if (tokenBalances.error) {
    console.warn(tokenBalances.error)
  }

  const tokenPrices = useTokenPrices(chainIds, tokenLists)
  if (tokenPrices.error) {
    console.warn(tokenPrices.error)
  }

  const isFetched = tokenBalances.isFetched && tokenPrices.isFetched
  const refetch = async () => {
    tokenBalances.refetch()
    tokenPrices.refetch()
  }

  let data = {}
  if (isFetched) {
    data = combineTokenBalanceAndPriceData(tokenBalances, tokenPrices)
  }

  return {
    refetch,
    isFetched,
    data
  }
}

const combineTokenBalanceAndPriceData = (tokenBalances, tokenPrices) => {
  let data = {}

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

  return data
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
  const { data: governanceTokenBalancesFlattened, isFetched: isGovernanceTokenBalancesFetched } =
    useGovernanceTokenBalancesFlattened()
  const { data: vestingPoolBalance, isFetched: isVestingPoolBalanceFetched } =
    useVestingPoolBalance()

  const isFetched =
    isGovernanceTokenBalancesFetched &&
    isVestingPoolBalanceFetched &&
    vestingPoolBalance?.totalValueUsdScaled &&
    governanceTokenBalancesFlattened

  if (!isFetched) {
    return {
      isFetched,
      data: {
        totalValueUsd: null,
        totalValueUsdScaled: null
      }
    }
  }

  console.log(vestingPoolBalance)
  console.log(vestingPoolBalance.totalValueUsdScaled)

  const totalValueUsdScaled = addBigNumbers([
    ...governanceTokenBalancesFlattened
      .map((balance) => balance.totalValueUsdScaled)
      .filter(Boolean),
    vestingPoolBalance.totalValueUsdScaled
  ])
  const totalValueUsd = toNonScaledUsdString(totalValueUsdScaled)

  return {
    isFetched,
    data: {
      totalValueUsd,
      totalValueUsdScaled
    }
  }
}

const timelockAddressesListsForChains = (chainIds) => {
  let timelockAddresses = {}

  chainIds.forEach((chainId) => {
    const governanceTimelockAddress = CONTRACT_ADDRESSES[chainId].GovernanceTimelock
    if (governanceTimelockAddress) {
      timelockAddresses[chainId] = governanceTimelockAddress
    } else {
      timelockAddresses[chainId] = null
    }
  })

  return timelockAddresses
}
