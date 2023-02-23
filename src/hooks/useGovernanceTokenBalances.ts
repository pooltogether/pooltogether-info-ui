import { CONTRACT_ADDRESSES } from '@constants/legacy'
import { useAaveRewardsBalances } from '@hooks/useAaveRewardsBalances'
// import { useOlympusProBondBalance } from '@hooks/useOlympusProBondBalance'
import { useVestingPoolBalance } from '@hooks/useVestingPoolBalance'
import { addBigNumbers, toNonScaledUsdString } from '@pooltogether/utilities'
import { CHAIN_ID } from '@pooltogether/wallet-connection'
import { BigNumber } from 'ethers'
import { combineTokenBalanceAndPriceData } from '../utils/combineTokenBalanceAndPriceData'
import { useAllTokenBalances } from './useTokenBalances'
import { useTokenLists } from './useTokenLists'
import { useTokenPrices } from './useTokenPrices'

// The Governance owned addresses to query balances for
const GOVERNANCE_ADDRESSES: { [chainId: number]: string }[] = [
  // Timelock
  {
    [CHAIN_ID.mainnet]: CONTRACT_ADDRESSES[CHAIN_ID.mainnet].GovernanceTimelock
  },
  // Prize Distributors
  {
    [CHAIN_ID.mainnet]: '0xb9a179dca5a7bf5f8b9e088437b3a85ebb495efe',
    [CHAIN_ID.polygon]: '0x8141bcfbcee654c5de17c4e2b2af26b67f9b9056',
    [CHAIN_ID.avalanche]: '0x83332f908f403ce795d90f677ce3f382fe73f3d1',
    [CHAIN_ID.optimism]: '0x722e9bfc008358ac2d445a8d892cf7b62b550f3f'
  },
  // Exec Team
  {
    [CHAIN_ID.polygon]: '0x3fee50d2888f2f7106fcdc0120295eba3ae59245',
    [CHAIN_ID.optimism]: '0x8d352083f7094dc51cd7da8c5c0985ad6e149629'
  }
]

export const useUniqueGovernanceTokenBalances = () => {
  const tokenLists = useTokenLists()
  const queryResults = useAllTokenBalances(tokenLists, GOVERNANCE_ADDRESSES)
  const tokenPrices = useTokenPrices(tokenLists)
  const isFetched = queryResults.every(({ isFetched }) => isFetched)

  let data: {
    [chainId: number]: {
      amount: string
      amountUnformatted: BigNumber
      address: string
      decimals: string
      name: string
      symbol: string
      chainId: number
      usd?: number
      totalValueUsd?: string
      totalValueUsdScaled?: BigNumber
    }[]
  }[] = []
  if (isFetched) {
    data = queryResults.map(({ data: tokenBalances }) =>
      combineTokenBalanceAndPriceData(tokenBalances, tokenPrices)
    )
  }

  return {
    isFetched,
    data
  }
}

/**
 * Fetches the balances of all of the tokens listed in useTokenLists for the Governance Timelock contracts across all chains
 * @returns
 */
export const useGovernanceTokenBalances = () => {
  const tokenLists = useTokenLists()
  const queryResults = useAllTokenBalances(tokenLists, GOVERNANCE_ADDRESSES)
  const tokenPrices = useTokenPrices(tokenLists)
  const isFetched = queryResults.every(({ isFetched }) => isFetched)

  let data: {
    [chainId: number]: {
      amount: string
      amountUnformatted: BigNumber
      address: string
      decimals: string
      name: string
      symbol: string
      chainId: number
      usd?: number
      totalValueUsd?: string
      totalValueUsdScaled?: BigNumber
    }[]
  } = {}
  if (isFetched) {
    const tokenBalances = queryResults
      .map(({ data }) => data)
      .reduce(
        (acc, val) => {
          const updated = { ...acc }
          Object.keys(val)
            .map(Number)
            .forEach((chainId) => {
              if (!updated[chainId]) {
                updated[chainId] = []
              }
              updated[chainId].push(...val[chainId])
            })
          return updated
        },
        {} as {
          [chainId: number]: {
            amount: string
            amountUnformatted: BigNumber
            address: string
            decimals: string
            name: string
            symbol: string
          }[]
        }
      )

    data = combineTokenBalanceAndPriceData(tokenBalances, tokenPrices)
  }

  return {
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
  // const { data: bondBalance, isFetched: isBondBalanceFetched } = useOlympusProBondBalance()
  const { data: aaveRewardsBalances, isFetched: isAaveRewardsBalancesFetched } =
    useAaveRewardsBalances()

  const isFetched =
    isGovernanceTokenBalancesFetched &&
    isVestingPoolBalanceFetched &&
    vestingPoolBalance?.totalValueUsdScaled &&
    governanceTokenBalancesFlattened &&
    isAaveRewardsBalancesFetched
  // isBondBalanceFetched

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
    // bondBalance.totalValueUsdScaled,
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
