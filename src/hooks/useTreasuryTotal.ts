import {
  useGovernanceTokenBalances,
  useGovernanceTokenBalancesTotal
} from '@hooks/useGovernanceTokenBalances'
import { addBigNumbers, toNonScaledUsdString } from '@pooltogether/utilities'

export const useTreasuryTotal = () => {
  const { isFetched: timelockAddressesLists } = useGovernanceTokenBalances()
  const { data: balances } = useGovernanceTokenBalancesTotal()

  // const { isFetched: isReservesFetched } = usePrizePoolReserves()
  // const { data: reserves } = usePrizePoolReservesTotal()

  // const isFetched = isReservesFetched && isTokenBalancesFetched
  // let data = null
  // if (isFetched && balances.totalValueUsd) {
  //   data = combineTokenBalancesAndReserves(balances, reserves)
  // }

  return {
    data: balances,
    isFetched: timelockAddressesLists
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
