import { CONTRACT_ADDRESSES } from '@constants/legacy'
import { useGovernanceChainId } from '@hooks/useGovernanceChainId'
import { useTokenLists } from '@hooks/useTokenLists'
import { useTokenPrices } from '@hooks/useTokenPrices'

export const usePoolPrice = () => {
  const governanceChainId = useGovernanceChainId()
  const chainIds = [governanceChainId]
  const tokenLists = useTokenLists(chainIds)
  const tokenPrices = useTokenPrices(tokenLists)
  return tokenPrices[governanceChainId][CONTRACT_ADDRESSES[governanceChainId].GovernanceToken]
}
