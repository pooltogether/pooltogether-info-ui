import { formatUnits } from '@ethersproject/units'
import { TOKEN_PRICE_ALIASES } from '@hooks/useTokenLists'
import { amountMultByUsd, toScaledUsdBigNumber } from '@pooltogether/utilities'
import { BigNumber } from 'ethers'

export const combineTokenBalanceAndPriceData = (
  tokenBalances: {
    [chainId: number]: {
      amount: string
      amountUnformatted: BigNumber
      address: string
      decimals: string
      name: string
      symbol: string
    }[]
  },
  tokenPrices: {
    [chainId: number]: {
      [tokenAddress: string]: {
        [currency: string]: number
      }
    }
  }
) => {
  const data: {
    [chainId: number]: {
      amount: string
      amountUnformatted: BigNumber
      address: string
      decimals: string
      name: string
      symbol: string
      chainId: number
      usd?: number
      totalValueUsd?: string
      totalValueUsdScaled?: BigNumber
    }[]
  } = {}

  if (tokenBalances) {
    Object.keys(tokenBalances)
      .map(Number)
      .forEach((chainId) => {
        console.log({ tokenBalances, chainId })
        const tokens = tokenBalances[chainId] || []
        tokens.forEach((token) => {
          if (!data[chainId]) {
            data[chainId] = []
          }

          const tokenAddress = token.address.toLowerCase()
          const tokenPriceData = getTokenPriceData(chainId, tokenAddress, tokenPrices)

          console.log({ tokenAddress, tokenPriceData })

          const usd = tokenPriceData?.usd

          if (!usd) {
            data[chainId].push({
              ...token,
              chainId: Number(chainId)
            })
          } else {
            const usdValueUnformatted = amountMultByUsd(token.amountUnformatted, usd)
            const totalValueUsd = formatUnits(usdValueUnformatted, token.decimals)
            const totalValueUsdScaled = toScaledUsdBigNumber(totalValueUsd)

            data[chainId].push({
              ...token,
              chainId: Number(chainId),
              usd,
              totalValueUsd,
              totalValueUsdScaled
            })
          }
        })
      })
  }

  return data
}

const getTokenPriceData = (
  chainId: number,
  tokenAddress: string,
  tokenPrices: {
    [chainId: number]: {
      [tokenAddress: string]: {
        [currency: string]: number
      }
    }
  }
) => {
  const alias = TOKEN_PRICE_ALIASES?.[chainId]?.[tokenAddress]
  if (alias) {
    const aliasTokenPrice = tokenPrices[alias.chainId]?.[alias.address]
    return aliasTokenPrice
  } else {
    return tokenPrices[chainId]?.[tokenAddress]
  }
}
