import { addBigNumbers, toNonScaledUsdString } from '@pooltogether/utilities'
import {
  useGovernanceTokenBalances,
  useGovernanceTokenBalancesTotal
} from 'lib/hooks/useGovernanceTokenBalances'
import { usePrizePoolReserves, usePrizePoolReservesTotal } from 'lib/hooks/usePrizePoolReserves'
import { useVestingPoolBalance } from 'lib/hooks/useVestingPoolBalance'

export const useTreasuryTotal = () => {
  const { isFetched: isTokenBalancesFetched, isFetching: isTokenBalancesFetching } =
    useGovernanceTokenBalances()
  const { data: balances } = useGovernanceTokenBalancesTotal()
  const { isFetched: isReservesFetched, isFetching: isReservesFetching } = usePrizePoolReserves()
  const { data: reserves } = usePrizePoolReservesTotal()
  const {
    data: vestingPoolBalance,
    isFetched: isVestingPoolBalanceFetched,
    isFetching: isVestingPoolBalanceFetching
  } = useVestingPoolBalance()

  const isFetched = isReservesFetched && isTokenBalancesFetched && isVestingPoolBalanceFetched
  const isFetching = isReservesFetching && isTokenBalancesFetching && isVestingPoolBalanceFetching

  let data = null
  if (isTokenBalancesFetched && isReservesFetched) {
    const totalValueUsdScaled = addBigNumbers([
      reserves.totalValueUsdScaled,
      balances.totalValueUsdScaled,
      vestingPoolBalance.totalValueUsdScaled
    ])
    data = {
      totalValueUsd: toNonScaledUsdString(totalValueUsdScaled),
      totalValueUsdScaled
    }
  }

  return {
    data,
    isFetched,
    isFetching
  }
}
