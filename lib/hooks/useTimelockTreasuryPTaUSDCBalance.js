import { formatUnits } from '@ethersproject/units'
import { useTokenBalance } from '@pooltogether/hooks'
import { NETWORK } from '@pooltogether/utilities'

import { amountMultByUsd, toScaledUsdBigNumber } from '@pooltogether/utilities'
import { CONTRACT_ADDRESSES } from 'lib/constants'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'

// assume PTaUSDC USD value = USDC's USD value
const USDC_ADDRESS = '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'
const PTaUSDC_ADDRESS = '0xdd4d117723c257cee402285d3acf218e9a8236e1'

export const useTimelockTreasuryPTaUSDCBalance = () => {
  const chainId = NETWORK.mainnet

  let data = {}

  let {
    data: tokenBalance,
    isFetched: tokenBalanceIsFetched,
    error: tokenBalanceError,
    ...remainder
  } = useTokenBalance(chainId, CONTRACT_ADDRESSES[chainId].GovernanceTimelock, PTaUSDC_ADDRESS)
  if (tokenBalanceError) {
    console.error(tokenBalanceError)
  }

  const chainIds = [chainId]
  const tokenLists = { [chainId]: [USDC_ADDRESS] }
  const {
    data: tokenPrices,
    error: tokenPricesError,
    isFetched: tokenPricesIsFetched
  } = useTokenPrices(chainIds, tokenLists)
  if (tokenPricesError) {
    console.error(tokenPricesError)
  }

  const isFetched = tokenBalanceIsFetched && tokenPricesIsFetched

  if (isFetched && tokenPrices && tokenBalance) {
    const usd = tokenPrices[chainId][USDC_ADDRESS].usd
    const usdValueUnformatted = amountMultByUsd(tokenBalance.amountUnformatted, usd)

    const totalValueUsd = formatUnits(usdValueUnformatted, tokenBalance.decimals)
    const totalValueUsdScaled = toScaledUsdBigNumber(totalValueUsd)

    data = {
      ...tokenBalance,
      usd,
      usdValueUnformatted,
      totalValueUsd,
      totalValueUsdScaled,
      address: CONTRACT_ADDRESSES[chainId].GovernanceToken,
      chainId: chainId
    }
  }

  return {
    ...remainder,
    isFetched,
    data,
    address: CONTRACT_ADDRESSES[chainId].GovernanceToken,
    chainId: chainId
  }
}
