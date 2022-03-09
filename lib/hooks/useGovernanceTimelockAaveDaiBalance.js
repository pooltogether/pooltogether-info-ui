import { formatUnits } from '@ethersproject/units'
import { useTokenBalance } from '@pooltogether/hooks'
import { NETWORK } from '@pooltogether/utilities'

import { amountMultByUsd, toScaledUsdBigNumber } from '@pooltogether/utilities'
import { CONTRACT_ADDRESSES } from 'lib/constants'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'

// assume aDAI USD value = DAI's USD value as aDAI comes up as 0 on uniswap subgraph
const DAI_ADDRESS = '0x6b175474e89094c44da98b954eedeac495271d0f'
const aDAI_ADDRESS = '0x028171bca77440897b824ca71d1c56cac55b68a3'

export const useGovernanceTimelockAaveDaiBalance = () => {
  const chainId = NETWORK.mainnet

  let data = {}

  let {
    data: tokenBalance,
    isFetched: tokenBalanceIsFetched,
    error: tokenBalanceError,
    ...remainder
  } = useTokenBalance(chainId, CONTRACT_ADDRESSES[chainId].GovernanceTimelock, aDAI_ADDRESS)
  if (tokenBalanceError) {
    console.error(tokenBalanceError)
  }

  const chainIds = [chainId]
  const tokenLists = { [chainId]: [DAI_ADDRESS] }
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
    const usd = tokenPrices[chainId][DAI_ADDRESS].usd
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
