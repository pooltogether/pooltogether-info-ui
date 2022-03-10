import { NETWORK } from '@pooltogether/utilities'

export function useAaveRewardsContractsLists(chainIds) {
  const tokenLists = {}

  chainIds.forEach((chainId) => {
    tokenLists[chainId] = TOKEN_LISTS[chainId]
  })

  return tokenLists
}

const TOKEN_LISTS = Object.freeze({
  [NETWORK.mainnet]: ['0xd784927ff2f95ba542bfc824c8a8a98f3495f6b5'],
  [NETWORK.polygon]: ['0x357d51124f59836ded84c8a1730d72b749d8bc23'],
  [NETWORK.avalanche]: ['0x01d83fe6a10d2f2b7af17034343746188272cac9']
})
