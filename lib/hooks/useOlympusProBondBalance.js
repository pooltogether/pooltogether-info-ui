import { formatUnits } from '@ethersproject/units'
import { useTokenBalance } from '@pooltogether/hooks'

import { amountMultByUsd, NETWORK, toScaledUsdBigNumber } from '@pooltogether/utilities'
import { useUniswapV2LpTokenPriceUsd } from 'lib/hooks/useUniswapV2LpTokenPriceUsd'

const BOND_TREASURY = '0x7437e08982a39FCA561c1Ca1da1D23fF26fE2b93'
const UNISWAP_V2_LP_TOKEN = '0x85cb0bab616fe88a89a35080516a8928f38b518b'

export const useOlympusProBondBalance = () => {
  let data = {}

  let {
    data: tokenBalance,
    isFetched: tokenBalanceIsFetched,
    error: tokenBalanceError,
    ...remainder
  } = useTokenBalance(NETWORK.mainnet, BOND_TREASURY, UNISWAP_V2_LP_TOKEN)
  if (tokenBalanceError) {
    console.error(tokenBalanceError)
  }

  const { data: tokenPrice, isFetched: isTokenPriceFetched } =
    useUniswapV2LpTokenPriceUsd(UNISWAP_V2_LP_TOKEN)

  const isFetched = tokenBalanceIsFetched && isTokenPriceFetched

  if (isFetched) {
    const usd = tokenPrice
    const usdValueUnformatted = amountMultByUsd(tokenBalance.amountUnformatted, usd)
    const totalValueUsd = formatUnits(usdValueUnformatted, tokenBalance.decimals)
    const totalValueUsdScaled = toScaledUsdBigNumber(totalValueUsd)

    data = {
      ...tokenBalance,
      usd,
      usdValueUnformatted,
      totalValueUsd,
      totalValueUsdScaled,
      address: UNISWAP_V2_LP_TOKEN,
      chainId: NETWORK.mainnet,
      isVesting: false
    }
  }

  return {
    ...remainder,
    isFetched,
    data,
    address: UNISWAP_V2_LP_TOKEN,
    chainId: NETWORK.mainnet
  }
}
