import { useTokenBalance } from '@pooltogether/hooks'
import { TWAB_DELEGATOR_ADDRESS } from '../constants/legacy'
import { formatUnits } from '@ethersproject/units'
import { useTotalAmountDelegated } from '@hooks/useTotalAmountDelegated'
import { amountMultByUsd, toScaledUsdBigNumber } from '@pooltogether/utilities'
import { BigNumber } from 'ethers'
import { numberWithCommas } from '@pooltogether/utilities'
import { CHAIN_ID } from '@pooltogether/wallet-connection'

const getTwabDelegatorContractAddress = (chainId: number) => TWAB_DELEGATOR_ADDRESS[chainId]

const useDelegatorsStake = (chainId: number, delegator: string) => {
  const twabDelegatorAddress = getTwabDelegatorContractAddress(chainId)
  return useTokenBalance(chainId, delegator, twabDelegatorAddress)
}

interface delegationReturn {
  amount?: string
  amountPretty?: string
  amountUnformatted?: BigNumber
}

export const useDelegationBalances = () => {
  let data = {}

  const { data: delegationStakeOptimism, isFetched: isDelegationStakeOptimismFetched } =
    useDelegatorsStake(CHAIN_ID.optimism, '0x8d352083f7094dc51cd7da8c5c0985ad6e149629')
  const { data: delegationStakePolygon, isFetched: isDelegationStakePolygonFetched } =
    useDelegatorsStake(CHAIN_ID.polygon, '0x3feE50d2888F2F7106fcdC0120295EBA3ae59245')

  const { data: delegationBalanceOptimism, isFetched: isDelegationBalanceOptimismFetched } =
    useTotalAmountDelegated(CHAIN_ID.optimism, '0x8d352083f7094dc51cd7da8c5c0985ad6e149629')

  const { data: delegationBalancePolygon, isFetched: isDelegationBalancePolygonFetched } =
    useTotalAmountDelegated(CHAIN_ID.polygon, '0x3feE50d2888F2F7106fcdC0120295EBA3ae59245')

  const isFetched =
    isDelegationBalanceOptimismFetched &&
    isDelegationBalancePolygonFetched &&
    isDelegationStakeOptimismFetched &&
    isDelegationStakePolygonFetched

  if (isFetched) {
    const amount =
      Number(delegationBalanceOptimism.amount) +
      Number(delegationBalancePolygon.amount) +
      Number(delegationStakePolygon.amount) +
      Number(delegationStakeOptimism.amount)

    // assumed 1 usdc = 1 dollar
    const usd = amount

    const balancePlusStakedamountUnformatted = delegationBalanceOptimism.amountUnformatted
      .add(delegationBalancePolygon.amountUnformatted)
      .add(delegationStakePolygon.amountUnformatted)
      .add(delegationStakeOptimism.amountUnformatted)
    const usdValueUnformatted = amountMultByUsd(balancePlusStakedamountUnformatted, 1)
    const totalValueUsd = formatUnits(balancePlusStakedamountUnformatted, 6)
    const totalValueUsdScaled = toScaledUsdBigNumber(totalValueUsd)

    const delegationBalancesTotal: delegationReturn = {
      amount: amount.toString(),
      amountPretty: numberWithCommas(amount),
      amountUnformatted: balancePlusStakedamountUnformatted
    }
    data = {
      ...delegationBalancesTotal,
      usd,
      usdValueUnformatted,
      totalValueUsd,
      totalValueUsdScaled,
      address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
      chainId: CHAIN_ID.optimism,
      isVesting: false,
      isDelegating: true,
      name: 'Delegation',
      symbol: 'USDC'
    }
  }

  return {
    isFetched,
    data,
    address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
    chainId: CHAIN_ID.optimism
  }
}
