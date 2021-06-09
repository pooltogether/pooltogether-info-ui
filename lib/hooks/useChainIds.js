import { APP_ENVIRONMENT, useAppEnv } from '@pooltogether/hooks'
import { NETWORK } from '@pooltogether/utilities'

/**
 * Returns the relevant chain ids for the current app state
 * @returns number[]
 */
export const useChainIds = () => {
  const { appEnv } = useAppEnv()
  return appEnv === APP_ENVIRONMENT.mainnets ? [NETWORK.mainnet, NETWORK.matic] : [NETWORK.rinkeby]
}
