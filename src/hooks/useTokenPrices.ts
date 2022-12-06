import { useMemo } from 'react'
import { useCoingeckoTokens } from '../atoms/serverAtoms'

/**
 * Pull the token prices from the prefetched Coingecko data
 * @param tokens
 * @returns
 */
export const useTokenPrices = (tokens: { [chainId: number]: string[] }) => {
  const coingeckoTokens = useCoingeckoTokens()

  return useMemo(() => {
    const chainIds = Object.keys(tokens).map(Number)

    const tokenPrices: {
      [chainId: number]: { [tokenAddress: string]: { [currency: string]: number } }
    } = {}
    chainIds.forEach((chainId) => {
      const tokenAddresses = tokens[chainId]
      tokenPrices[chainId] = {}
      tokenAddresses.forEach((tokenAddress) => {
        tokenPrices[chainId][tokenAddress] = coingeckoTokens?.find((token) =>
          Object.values(token.platforms).includes(tokenAddress)
        )?.price
      })
    })

    return tokenPrices
  }, [tokens])
}
