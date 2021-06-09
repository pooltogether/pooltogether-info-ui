import { useTokenBalance } from '@pooltogether/hooks'
import { amountMultByUsd, toScaledUsdBigNumber } from '@pooltogether/utilities'
import { formatUnits } from 'ethers/lib/utils'
import { CONTRACT_ADDRESSES } from 'lib/constants'
import { useGovernanceChainId } from 'lib/hooks/useGovernanceChainId'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'

export const useVestingPoolBalance = () => {
  const governanceChainId = useGovernanceChainId()
  const governanceTokenAddress = CONTRACT_ADDRESSES[governanceChainId].GovernanceToken
  let {
    data,
    isFetched: isTokenBalanceFetched,
    ...remainder
  } = useTokenBalance(
    governanceChainId,
    CONTRACT_ADDRESSES[governanceChainId].TreasuryVester,
    governanceTokenAddress
  )

  const { data: tokenPrices, isFetched } = useTokenPrices()

  if (isTokenBalanceFetched && isFetched) {
    const usd = tokenPrices[governanceChainId][governanceTokenAddress].usd
    const usdValueUnformatted = amountMultByUsd(data.amountUnformatted, usd)
    const totalValueUsd = formatUnits(usdValueUnformatted, data.decimals)
    const totalValueUsdScaled = toScaledUsdBigNumber(totalValueUsd)

    data = {
      ...data,
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
    isFetched: isTokenBalanceFetched,
    data,
    address: CONTRACT_ADDRESSES[governanceChainId].GovernanceToken,
    chainId: governanceChainId
  }
}
