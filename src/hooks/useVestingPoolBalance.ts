import { CONTRACT_ADDRESSES } from '@constants/legacy'
import { formatUnits } from '@ethersproject/units'
import { useGovernanceChainId } from '@hooks/useGovernanceChainId'
import { useTokenPrices } from '@hooks/useTokenPrices'
import { useTokenBalance, TokenWithAllBalances } from '@pooltogether/hooks'
import { amountMultByUsd, toScaledUsdBigNumber } from '@pooltogether/utilities'
import { BigNumber } from 'ethers'
import { useTokenLists } from './useTokenLists'

export const useVestingPoolBalance = () => {
  const governanceChainId = useGovernanceChainId()
  const governanceTokenAddress: string = CONTRACT_ADDRESSES[governanceChainId].GovernanceToken

  let data: TokenWithAllBalances & {
    usd?: number
    usdValueUnformatted?: BigNumber
    totalValueUsd?: string
    totalValueUsdScaled?: BigNumber
    address?: string
    chainId?: number
    isVesting?: boolean
  }

  let {
    data: tokenBalance,
    isFetched: tokenBalanceIsFetched,
    error: tokenBalanceError,
    ...remainder
  } = useTokenBalance(
    governanceChainId,
    CONTRACT_ADDRESSES[governanceChainId].TreasuryVester,
    governanceTokenAddress
  )
  if (tokenBalanceError) {
    console.error(tokenBalanceError)
  }

  const tokenLists = useTokenLists()
  const tokenPrices = useTokenPrices(tokenLists)

  const isFetched = tokenBalanceIsFetched

  if (isFetched && tokenPrices && tokenBalance) {
    const usd = tokenPrices[governanceChainId][governanceTokenAddress].usd
    const usdValueUnformatted = amountMultByUsd(tokenBalance.amountUnformatted, usd)
    const totalValueUsd = formatUnits(usdValueUnformatted, tokenBalance.decimals)
    const totalValueUsdScaled = toScaledUsdBigNumber(totalValueUsd)

    data = {
      ...tokenBalance,
      usd,
      usdValueUnformatted,
      totalValueUsd,
      totalValueUsdScaled,
      address: CONTRACT_ADDRESSES[governanceChainId].GovernanceToken,
      chainId: governanceChainId,
      isVesting: true
    }
  }

  return {
    ...remainder,
    isFetched,
    data,
    address: CONTRACT_ADDRESSES[governanceChainId].GovernanceToken,
    chainId: governanceChainId
  }
}
