import { formatUnits } from '@ethersproject/units'
import { amountMultByUsd, toScaledUsdBigNumber } from '@pooltogether/utilities'

import { TOKEN_PRICE_ALIASES } from 'lib/hooks/useTokenLists'

export const combineTokenBalanceAndPriceData = (tokenBalances, tokenPrices) => {
  let data = {}

  if (tokenBalances) {
    Object.keys(tokenBalances).forEach((chainId) => {
      const tokens = tokenBalances[chainId] || []
      tokens.forEach((token) => {
        // console.log({ token: token.name, chainId })
        if (!data[chainId]) {
          data[chainId] = []
        }

        const tokenAddress = token.address.toLowerCase()
        const tokenPriceData = getTokenPriceData(chainId, tokenAddress, tokenPrices)
        // console.log({ tokenPriceData })

        const usd = tokenPriceData.usd

        if (!usd) {
          console.log({ token })
          console.log({ usd })
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

const getTokenPriceData = (chainId, tokenAddress, tokenPrices) => {
  const alias = TOKEN_PRICE_ALIASES?.[chainId]?.[tokenAddress]
  if (alias) {
    console.log({ alias })
  }

  if (alias) {
    const aliasTokenPrice = tokenPrices.data[alias.chainId]?.[alias.address]
    console.log({ aliasTokenPrice })
    return aliasTokenPrice || {}
  } else {
    return tokenPrices.data[chainId]?.[tokenAddress] || {}
  }
}
