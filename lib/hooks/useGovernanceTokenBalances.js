import { addBigNumbers, toNonScaledUsdString } from '@pooltogether/utilities'
import { BigNumber } from 'ethers'

import { CONTRACT_ADDRESSES } from 'lib/constants'
import { useChainIds } from 'lib/hooks/useChainIds'
import { useTokenLists } from 'lib/hooks/useTokenLists'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'
import { useVestingPoolBalance } from 'lib/hooks/useVestingPoolBalance'
import { useTokenBalances } from 'lib/hooks/useTokenBalances'
import { useAaveRewardsBalances } from 'lib/hooks/useAaveRewardsBalances'
import { useOlympusProBondBalance } from 'lib/hooks/useOlympusProBondBalance'
import { useTimelockAaveDaiBalance } from 'lib/hooks/useTimelockAaveDaiBalance'
import { useTimelockTreasuryPTaUSDCBalance } from 'lib/hooks/useTimelockTreasuryPTaUSDCBalance'
import { combineTokenBalanceAndPriceData } from 'lib/utils/combineTokenBalanceAndPriceData'

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
    data = combineTokenBalanceAndPriceData(tokenBalances.data, tokenPrices)
  }

  return {
    refetch,
    isFetched,
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
  const { data: governanceTokenBalancesFlattened, isFetched: isGovernanceTokenBalancesFetched } =
    useGovernanceTokenBalancesFlattened()
  const { data: vestingPoolBalance, isFetched: isVestingPoolBalanceFetched } =
    useVestingPoolBalance()
  const { data: bondBalance, isFetched: isBondBalanceFetched } = useOlympusProBondBalance()
  const {
    data: ptausdcTimelockTreasuryBalance,
    isFetched: isPTaUSDCTimelockTreasuryBalanceFetched
  } = useTimelockTreasuryPTaUSDCBalance()
  const { data: aaveDaiTimelockBalance, isFetched: isAaveDaiTimelockBalanceFetched } =
    useTimelockAaveDaiBalance()
  const { data: aaveRewardsBalances, isFetched: isAaveRewardsBalancesFetched } =
    useAaveRewardsBalances()

  const isFetched =
    isGovernanceTokenBalancesFetched &&
    isVestingPoolBalanceFetched &&
    vestingPoolBalance?.totalValueUsdScaled &&
    governanceTokenBalancesFlattened &&
    isPTaUSDCTimelockTreasuryBalanceFetched &&
    isAaveDaiTimelockBalanceFetched &&
    isAaveRewardsBalancesFetched &&
    isBondBalanceFetched

  if (!isFetched) {
    return {
      isFetched,
      data: {
        totalValueUsd: null,
        totalValueUsdScaled: null
      }
    }
  }

  const totalValueUsdScaled = addBigNumbers([
    ...governanceTokenBalancesFlattened
      .map((balance) => balance.totalValueUsdScaled)
      .filter(Boolean),
    vestingPoolBalance.totalValueUsdScaled,
    bondBalance.totalValueUsdScaled,
    ptausdcTimelockTreasuryBalance.totalValueUsdScaled,
    aaveDaiTimelockBalance.totalValueUsdScaled,
    aaveRewardsTotalValueUsdScaled(aaveRewardsBalances)
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

const aaveRewardsTotalValueUsdScaled = (aaveRewardsBalances) => {
  let totalValue = BigNumber.from(0)

  if (!aaveRewardsBalances) {
    return totalValue
  }

  Object.keys(aaveRewardsBalances).forEach((chainId) => {
    aaveRewardsBalances[chainId].forEach((balance) => {
      if (balance.totalValueUsdScaled) {
        totalValue = totalValue.add(balance.totalValueUsdScaled)
      }
    })
  })

  return totalValue
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
