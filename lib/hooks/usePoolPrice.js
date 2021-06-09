import { CONTRACT_ADDRESSES } from 'lib/constants'
import { useGovernanceChainId } from 'lib/hooks/useGovernanceChainId'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'

export const usePoolPrice = () => {
  const governanceChainId = useGovernanceChainId()
  const { data: tokenPrices, isFetched } = useTokenPrices()

  if (!isFetched) return null

  return tokenPrices[governanceChainId][CONTRACT_ADDRESSES[governanceChainId].GovernanceToken]
}
