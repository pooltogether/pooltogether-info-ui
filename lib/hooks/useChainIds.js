import { NETWORK } from '@pooltogether/utilities'

/**
 * Returns the relevant chain ids for the current app state
 * @returns number[]
 */
export const useChainIds = () => {
  return [NETWORK.mainnet, NETWORK.matic]
}
