import { prizePoolContracts } from '@pooltogether/current-pool-data'

export function usePrizePoolContracts(chainIds) {
  const contracts = {}
  chainIds.forEach((chainId) => {
    contracts[chainId] = [
      ...prizePoolContracts[chainId].governance,
      ...prizePoolContracts[chainId].community.map((contract) => ({
        ...contract,
        isCommunityPool: true
      }))
    ]
  })
  return contracts
}
