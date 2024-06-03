import { formatEther } from '@ethersproject/units'
import { useQuery } from 'react-query'
import { CONTRACT_ADDRESSES, QUERY_KEYS } from '@constants/legacy'
import { useGovernanceChainId } from '@hooks/useGovernanceChainId'
import { useTokenPrices } from '@hooks/useTokenPrices'
import { getReadProviders } from '@pooltogether/wallet-connection'
import { amountMultByUsd, toScaledUsdBigNumber } from '@pooltogether/utilities'
import { RPC_URLS } from '../constants/rpc'
import { useTokenLists } from './useTokenLists'

export const useEthBalance = (chainId, address) => {
  const chainIds = [chainId]
  const providers = getReadProviders(chainIds, RPC_URLS)
  const provider = providers[chainId]

  const enabled = !!provider

  return useQuery(
    [QUERY_KEYS.ethBalance, chainId, address],
    () => getEthBalance(provider, address),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      enabled
    }
  )
}

export const useEthBalanceWithUsd = (chainId, address) => {
  const {
    data: ethBalance,
    isFetched: ethBalanceIsFetched,
    error: tokenBalanceError,
    ...remainder
  } = useEthBalance(chainId, address)

  let data = {}

  const governanceChainId = useGovernanceChainId()
  const wethTokenAddress: string = CONTRACT_ADDRESSES[governanceChainId].WETH

  const tokenLists = useTokenLists()
  const tokenPrices = useTokenPrices(tokenLists)

  if (ethBalanceIsFetched && tokenPrices) {
    const usd = tokenPrices[chainId][wethTokenAddress]?.usd ?? 0
    const usdValueUnformatted = amountMultByUsd(ethBalance, usd)
    const totalValueUsd = formatEther(usdValueUnformatted)
    const totalValueUsdScaled = toScaledUsdBigNumber(totalValueUsd)

    data = {
      balance: ethBalance,
      usd,
      usdValueUnformatted,
      totalValueUsd,
      totalValueUsdScaled,
      address: CONTRACT_ADDRESSES[governanceChainId].GovernanceToken,
      chainId: governanceChainId
    }
  }

  return {
    ...remainder,
    isFetched: ethBalanceIsFetched,
    data,
    address: CONTRACT_ADDRESSES[governanceChainId].WETH,
    chainId: governanceChainId
  }
}

const getEthBalance = async (provider, address) => {
  return await provider?.getBalance(address)
}
