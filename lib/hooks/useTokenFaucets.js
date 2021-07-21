import { useQuery } from 'react-query'
import { formatUnits } from '@ethersproject/units'
import { contract, batch } from '@pooltogether/etherplex'
import { useReadProviders } from '@pooltogether/hooks'
import { sToMs } from '@pooltogether/utilities'

import TokenFaucetAbi from 'abis/TokenFaucetAbi'
import ERC20Abi from 'abis/ERC20Abi'
import { QUERY_KEYS, SECONDS_PER_DAY } from 'lib/constants'
import { useChainIds } from 'lib/hooks/useChainIds'
import { useTokenFaucetAddresses } from 'lib/hooks/useTokenFaucetAddresses'

export const useTokenFaucets = (chainId) => {
  const chainIds = chainId ? [chainId] : useChainIds()
  const tokenFaucetAddresses = useTokenFaucetAddresses(chainIds)

  const {
    data: tokenFaucets,
    isFetched: tokenFaucetsIsFetched,
    refetch: tokenFaucetsRefetch
  } = useTokenFaucetsQuery(chainIds, tokenFaucetAddresses)

  return {
    data: tokenFaucets,
    isFetched: tokenFaucetsIsFetched,
    refetch: tokenFaucetsRefetch
  }
}

export const useTokenFaucetsQuery = (chainIds, tokenFaucetAddresses) => {
  const { readProviders, isReadProvidersReady } = useReadProviders(chainIds)

  const enabled = isReadProvidersReady

  return useQuery(
    [QUERY_KEYS.getTokenFaucets, chainIds, tokenFaucetAddresses],
    () => getTokenFaucetsForAllChainIds(chainIds, readProviders, tokenFaucetAddresses),
    {
      enabled,
      refetchInterval: sToMs(120),
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  )
}

const getTokenFaucetsForAllChainIds = async (chainIds, readProviders, tokenFaucetAddresses) => {
  const responses = await Promise.all([
    ...chainIds.map(async (chainId) => {
      return {
        chainId: chainId,
        data: await getTokenFaucets(chainId, readProviders[chainId], tokenFaucetAddresses[chainId])
      }
    })
  ])

  const result = {}

  responses.forEach((response) => {
    result[response.chainId] = response.data
  })

  return result
}

const getTokenFaucets = async (chainId, readProvider, tokenFaucetAddresses) => {
  try {
    let batchCalls = []

    // First set of calls
    tokenFaucetAddresses.forEach((tokenFaucetAddress) => {
      const tokenFaucetContract = contract(tokenFaucetAddress, TokenFaucetAbi, tokenFaucetAddress)
      batchCalls.push(tokenFaucetContract.measure().asset().dripRatePerSecond().totalUnclaimed())
    })

    const tokenFaucetsResponse = await batch(readProvider, ...batchCalls)
    batchCalls = []

    // Second set of calls
    tokenFaucetAddresses.forEach((tokenFaucetAddress) => {
      const dripTokenAddress = tokenFaucetsResponse[tokenFaucetAddress].asset[0]
      const dripTokenContract = contract(
        dripTokenKey(tokenFaucetAddress, dripTokenAddress),
        ERC20Abi,
        dripTokenAddress
      )
      batchCalls.push(dripTokenContract.name().symbol().decimals().balanceOf(tokenFaucetAddress))

      const measureTokenAddress = tokenFaucetsResponse[tokenFaucetAddress].measure[0]
      const measureTokenContract = contract(
        measureTokenKey(tokenFaucetAddress, measureTokenAddress),
        ERC20Abi,
        measureTokenAddress
      )
      batchCalls.push(measureTokenContract.name().symbol().decimals())
    })

    const tokensResponse = await batch(readProvider, ...batchCalls)
    batchCalls = []

    // Put it all together:
    const result = []
    tokenFaucetAddresses.forEach((tokenFaucetAddress) => {
      const tokenFaucetResponse = tokenFaucetsResponse[tokenFaucetAddress]
      processTokenFaucet(result, chainId, tokenFaucetAddress, tokenFaucetResponse, tokensResponse)
    })

    return result
  } catch (e) {
    console.warn(e.message)
    return null
  }
}

const processTokenFaucet = (
  result,
  chainId,
  tokenFaucetAddress,
  tokenFaucetResponse,
  tokensResponse
) => {
  const dripTokenAddress = tokenFaucetResponse.asset[0]
  const measureTokenAddress = tokenFaucetResponse.measure[0]

  const dripTokenResponse = tokensResponse[dripTokenKey(tokenFaucetAddress, dripTokenAddress)]
  const measureTokenResponse =
    tokensResponse[measureTokenKey(tokenFaucetAddress, measureTokenAddress)]

  const dripToken = {
    address: dripTokenAddress,
    name: dripTokenResponse.name[0],
    symbol: dripTokenResponse.symbol[0],
    decimals: dripTokenResponse.decimals[0]
  }

  const measureToken = {
    address: measureTokenAddress,
    name: measureTokenResponse.name[0],
    symbol: measureTokenResponse.symbol[0],
    decimals: measureTokenResponse.decimals[0]
  }

  const dripRatePerSecondUnformatted = tokenFaucetResponse.dripRatePerSecond[0]
  const dripRatePerSecond = formatUnits(dripRatePerSecondUnformatted, dripToken.decimals)

  const dripRatePerDayUnformatted = dripRatePerSecondUnformatted.mul(SECONDS_PER_DAY)
  const dripRatePerDay = formatUnits(dripRatePerDayUnformatted, dripToken.decimals)

  const totalUnclaimedUnformatted = tokenFaucetResponse.totalUnclaimed[0]
  const totalUnclaimed = formatUnits(totalUnclaimedUnformatted, dripToken.decimals)

  const faucetsDripTokenBalanceUnformatted = dripTokenResponse.balanceOf[0]
  const faucetsDripTokenBalance = formatUnits(
    faucetsDripTokenBalanceUnformatted,
    dripToken.decimals
  )

  const remainingDripTokenBalanceUnformatted =
    faucetsDripTokenBalanceUnformatted.sub(totalUnclaimedUnformatted)
  const remainingDripTokenBalance = formatUnits(
    remainingDripTokenBalanceUnformatted,
    dripToken.decimals
  )

  let remainingDaysUnformatted = remainingDripTokenBalanceUnformatted
    .mul(100)
    .div(dripRatePerDayUnformatted)
  const remainingDays = Number(remainingDaysUnformatted.toString()) / 100
  remainingDaysUnformatted = remainingDaysUnformatted.div(100)

  result.push({
    address: tokenFaucetAddress,
    faucetsDripTokenBalance,
    faucetsDripTokenBalanceUnformatted,
    remainingDripTokenBalance,
    remainingDripTokenBalanceUnformatted,
    dripRatePerSecond,
    dripRatePerSecondUnformatted,
    dripRatePerDay,
    dripRatePerDayUnformatted,
    remainingDays,
    remainingDaysUnformatted,
    totalUnclaimed,
    totalUnclaimedUnformatted,
    asset: dripTokenAddress,
    measure: measureTokenAddress,
    chainId,

    dripToken,
    measureToken
  })
}

const dripTokenKey = (tokenFaucetAddress, dripTokenAddress) => {
  return `${tokenFaucetAddress}-${dripTokenAddress}`
}

const measureTokenKey = (tokenFaucetAddress, measureTokenAddress) => {
  return `${tokenFaucetAddress}-${measureTokenAddress}`
}
