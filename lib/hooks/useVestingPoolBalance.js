import { formatUnits } from '@ethersproject/units'
import { useTokenBalance } from '@pooltogether/hooks'

import { amountMultByUsd, toScaledUsdBigNumber } from '@pooltogether/utilities'
import { CONTRACT_ADDRESSES } from 'lib/constants'
import { useGovernanceChainId } from 'lib/hooks/useGovernanceChainId'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'

export const useVestingPoolBalance = () => {
  const governanceChainId = useGovernanceChainId()
  const governanceTokenAddress = CONTRACT_ADDRESSES[governanceChainId].GovernanceToken

  let data = {}

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

  const chainIds = [governanceChainId]
  const tokenLists = { [governanceChainId]: [governanceTokenAddress] }
  const {
    data: tokenPrices,
    error: tokenPricesError,
    isFetched: tokenPricesIsFetched
  } = useTokenPrices(chainIds, tokenLists)
  if (tokenPricesError) {
    console.error(tokenPricesError)
  }

  const isFetched = tokenBalanceIsFetched && tokenPricesIsFetched

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
