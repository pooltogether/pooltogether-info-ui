import AaveRewardsAbi from '@abis/AaveRewardsAbi'
import ERC20Abi from '@abis/ERC20Abi'
import { QUERY_KEYS } from '@constants/legacy'
import { formatUnits } from '@ethersproject/units'
import { useAaveRewardsContractsLists } from '@hooks/useAaveRewardsContractsLists'
import { useTokenLists } from '@hooks/useTokenLists'
import { useTokenPrices } from '@hooks/useTokenPrices'
import { contract, batch } from '@pooltogether/etherplex'
import { CHAIN_ID } from '@pooltogether/wallet-connection'
import { getReadProviders } from '@pooltogether/wallet-connection'
import { combineTokenBalanceAndPriceData } from '@utils/combineTokenBalanceAndPriceData'
import { useQuery } from 'react-query'
import { RPC_URLS } from '../constants/rpc'

const POOL_YIELD_SOURCE_CONTRACTS = {
  [CHAIN_ID.mainnet]: '0x32e8D4c9d1B711BC958d0Ce8D14b41F77Bb03a64',
  [CHAIN_ID.polygon]: '0xd4f6d570133401079d213ecf4a14fa0b4bfb5b9c',
  [CHAIN_ID.avalanche]: '0x7437db21a0deb844fa64223e2d6db569de9648ff'
}

export const useAaveRewardsBalances = () => {
  const chainIds = [CHAIN_ID.mainnet, CHAIN_ID.polygon, CHAIN_ID.avalanche]

  const providers = getReadProviders(chainIds, RPC_URLS)

  const rewardsContractsLists = useAaveRewardsContractsLists(chainIds) // Rewards contracts
  const addressesLists = POOL_YIELD_SOURCE_CONTRACTS // Yield source contracts

  const tokenLists = useTokenLists()
  const tokenPrices = useTokenPrices(tokenLists)

  return useQuery(
    [QUERY_KEYS.getAaveRewardsBalances, chainIds, addressesLists],
    () =>
      getRewardsBalancesForChainIdsAndAddresses(
        chainIds,
        providers,
        rewardsContractsLists,
        addressesLists,
        tokenPrices
      ),
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  )
}

const getRewardsBalancesForChainIdsAndAddresses = async (
  chainIds,
  readProviders,
  rewardsContractsLists,
  addressesLists,
  tokenPrices
) => {
  const responses = await Promise.all([
    ...chainIds.map(async (chainId) => {
      return {
        chainId: chainId,
        data: await getRewardsBalancesForAddress(
          readProviders[chainId],
          rewardsContractsLists[chainId],
          addressesLists[chainId],
          chainId
        )
      }
    })
  ])

  const result1 = {}
  responses.forEach((response) => {
    result1[response.chainId] = response.data
  })

  const combined = combineTokenBalanceAndPriceData(result1, tokenPrices)

  const result = {
    ...result1,
    ...combined
  }

  return result
}

const getRewardsBalancesForAddress = async (
  readProvider,
  rewardsContractsList,
  address,
  chainId
) => {
  if (!address) {
    console.warn(
      'no address supplied to getRewardsBalancesForAddress() with args: ',
      rewardsContractsList,
      address
    )
    return []
  }

  try {
    const result = []

    // First set of calls
    let batchCalls = []

    rewardsContractsList.forEach((rewardContractAddress) => {
      const tokenContract = contract(rewardContractAddress, AaveRewardsAbi, rewardContractAddress)

      batchCalls.push(tokenContract.getUserUnclaimedRewards(address).PRECISION().REWARD_TOKEN())
    })

    const response1 = await batch(readProvider, ...batchCalls)

    // Second set of calls
    batchCalls = []

    rewardsContractsList.forEach((rewardContractAddress) => {
      const address = response1[rewardContractAddress].REWARD_TOKEN[0]
      const tokenContract = contract(address, ERC20Abi, address)

      batchCalls.push(tokenContract.name().symbol())
    })

    const response2 = await batch(readProvider, ...batchCalls)
    batchCalls = []

    rewardsContractsList.forEach((rewardContractAddress) => {
      const amountUnformatted = response1[rewardContractAddress].getUserUnclaimedRewards[0]
      const decimals = response1[rewardContractAddress].PRECISION[0]
      const amount = formatUnits(amountUnformatted, decimals)

      const rewardTokenAddress = response1[rewardContractAddress].REWARD_TOKEN[0]

      result.push({
        amount,
        amountUnformatted,
        chainId,
        address: rewardTokenAddress,
        decimals,
        name: response2[rewardTokenAddress].name[0],
        symbol: response2[rewardTokenAddress].symbol[0]
      })
    })

    return result
  } catch (e) {
    console.warn(e.message)
    return null
  }
}
