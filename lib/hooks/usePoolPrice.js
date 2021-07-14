import { CONTRACT_ADDRESSES } from 'lib/constants'
import { useGovernanceChainId } from 'lib/hooks/useGovernanceChainId'
import { useTokenLists } from 'lib/hooks/useTokenLists'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'

export const usePoolPrice = () => {
  const governanceChainId = useGovernanceChainId()
  const chainIds = [governanceChainId]

  const tokenLists = useTokenLists(chainIds)
  const { data: tokenPrices, isFetched } = useTokenPrices(chainIds, tokenLists)

  if (!isFetched) return null

  return tokenPrices[governanceChainId][CONTRACT_ADDRESSES[governanceChainId].GovernanceToken]
}
