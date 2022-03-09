import { addBigNumbers, toNonScaledUsdString } from '@pooltogether/utilities'

import {
  useGovernanceTokenBalances,
  useGovernanceTokenBalancesTotal
} from 'lib/hooks/useGovernanceTokenBalances'
import { usePrizePoolReserves, usePrizePoolReservesTotal } from 'lib/hooks/usePrizePoolReserves'

export const useTreasuryTotal = () => {
  const { isFetched: isTokenBalancesFetched } = useGovernanceTokenBalances()
  const { data: balances } = useGovernanceTokenBalancesTotal()

  const { isFetched: isReservesFetched } = usePrizePoolReserves()
  const { data: reserves } = usePrizePoolReservesTotal()

  const isFetched = isReservesFetched && isTokenBalancesFetched
  let data = null
  if (isFetched && balances.totalValueUsd) {
    data = combineTokenBalancesAndReserves(balances, reserves)
  }

  return {
    data,
    isFetched
  }
}

const combineTokenBalancesAndReserves = (balances, reserves) => {
  const totalValueUsdScaled = addBigNumbers([
    reserves.totalValueUsdScaled,
    balances.totalValueUsdScaled
  ])

  return {
    totalValueUsd: toNonScaledUsdString(totalValueUsdScaled),
    totalValueUsdScaled
  }
}
