import { prizePoolContracts } from '@pooltogether/current-pool-data'

console.log({ prizePoolContracts })

export function useTokenFaucetAddresses(chainIds: number[]) {
  const tokenFaucetAddresses = {}

  chainIds.forEach((chainId) => {
    const poolContracts = prizePoolContracts[chainId].governance

    let addresses = []
    poolContracts.forEach((poolContract) => {
      poolContract?.tokenFaucets?.forEach((tokenFaucet) => {
        addresses.push(tokenFaucet)
      })
    })

    tokenFaucetAddresses[chainId] = addresses
  })

  return tokenFaucetAddresses
}
