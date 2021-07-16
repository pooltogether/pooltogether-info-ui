import { useQuery } from 'react-query'
import { formatUnits } from '@ethersproject/units'
import { contract, batch } from '@pooltogether/etherplex'
import { useReadProviders } from '@pooltogether/hooks'
import {
  addBigNumbers,
  amountMultByUsd,
  sToMs,
  toNonScaledUsdString,
  toScaledUsdBigNumber
} from '@pooltogether/utilities'

import TokenFaucetAbi from 'abis/TokenFaucetAbi'
import ERC20Abi from 'abis/ERC20Abi'
import { CONTRACT_ADDRESSES, QUERY_KEYS } from 'lib/constants'
import { useChainIds } from 'lib/hooks/useChainIds'
import { useTokenLists } from 'lib/hooks/useTokenLists'
import { useTokenBalances } from 'lib/hooks/useTokenBalances'
import { useTokenPrices } from 'lib/hooks/useTokenPrices'
import { useTokenFaucetAddresses } from 'lib/hooks/useTokenFaucetAddresses'

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

  // const tokenLists = compileTokenLists(tokenFaucets)
  // const tokenLists = {
  //   1: [],
  //   137: []
  // }
  // const tokenPrices = useTokenPrices(chainIds, tokenLists)

  // const isFetched = tokenBalances.isFetched && tokenPrices.isFetched

  // const refetch = async () => {
  //   tokenBalances.refetch()
  //   tokenPrices.refetch()
  // }

  // let data = {}
  // if (isFetched) {
  //   Object.keys(tokenBalances.data).forEach((chainId) => {
  //     const tokens = tokenBalances.data[chainId] || []
  //     tokens.forEach((token) => {
  //       if (!data[chainId]) {
  //         data[chainId] = []
  //       }

  //       const tokenAddress = token.address
  //       const tokenPriceData = tokenPrices.data[chainId]?.[tokenAddress] || {}

  //       const usd = tokenPriceData.usd

  //       if (!usd) {
  //         data[chainId].push({
  //           ...token,
  //           chainId: Number(chainId)
  //         })
  //       } else {
  //         const usdValueUnformatted = amountMultByUsd(token.amountUnformatted, usd)
  //         const totalValueUsd = formatUnits(usdValueUnformatted, token.decimals)
  //         const totalValueUsdScaled = toScaledUsdBigNumber(totalValueUsd)

  //         data[chainId].push({
  //           ...token,
  //           chainId: Number(chainId),
  //           usd,
  //           totalValueUsd,
  //           totalValueUsdScaled
  //         })
  //       }
  //     })
  //   })
  // }

  return {
    refetch,
    isFetched,
    data
  }
}

// export const useTokenFaucetsFlattened = () => {
//   const { data, ...remainder } = useTokenFaucets()

//   let balances = null

//   if (data) {
//     balances = []
//     const chainIds = Object.keys(data)
//     chainIds.forEach((chainId) => {
//       const chainBalances = data[chainId]
//       balances.push(...chainBalances)
//     })
//   }

//   return { ...remainder, data: balances }
// }

/**
 * Add the total values of all of the token balances, filter out tokens we don't have USD values for
 * @returns
 */
// export const useTokenFaucetsTotal = () => {
//   const { data, isFetched: isTokenFaucetsFetced } = useTokenFaucetsFlattened()
//   const { data: vestingPoolBalance, isFetched: isVestingPoolBalanceFetched } =
//     useVestingPoolBalance()

//   const isFetched = isTokenFaucetsFetced && isVestingPoolBalanceFetched

//   if (!isFetched) {
//     return {
//       isFetched,
//       data: {
//         totalValueUsd: null,
//         totalValueUsdScaled: null
//       }
//     }
//   }

//   const totalValueUsdScaled = addBigNumbers([
//     ...data.map((balance) => balance.totalValueUsdScaled).filter(Boolean),
//     vestingPoolBalance.totalValueUsdScaled
//   ])
//   const totalValueUsd = toNonScaledUsdString(totalValueUsdScaled)

//   return {
//     isFetched,
//     data: {
//       totalValueUsd,
//       totalValueUsdScaled
//     }
//   }
// }

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
    let result = []

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
      const dripTokenContract = contract(dripTokenAddress, ERC20Abi, dripTokenAddress)
      batchCalls.push(dripTokenContract.name().symbol().decimals())

      const measureTokenAddress = tokenFaucetsResponse[tokenFaucetAddress].measure[0]
      const measureTokenContract = contract(measureTokenAddress, ERC20Abi, measureTokenAddress)
      batchCalls.push(measureTokenContract.name().symbol().decimals())
    })

    const tokensResponse = await batch(readProvider, ...batchCalls)
    batchCalls = []

    // Put it all together:
    tokenFaucetAddresses.forEach((tokenFaucetAddress) => {
      const dripTokenAddress = tokenFaucetsResponse[tokenFaucetAddress].asset[0]
      const measureTokenAddress = tokenFaucetsResponse[tokenFaucetAddress].measure[0]

      const dripTokenDecimals = tokensResponse[dripTokenAddress].decimals[0]

      const dripRatePerSecond = tokenFaucetsResponse[tokenFaucetAddress].dripRatePerSecond[0]
      const totalUnclaimedUnformatted = tokenFaucetsResponse[tokenFaucetAddress].totalUnclaimed[0]
      const totalUnclaimed = formatUnits(totalUnclaimedUnformatted, dripTokenDecimals)

      const dripToken = {
        address: dripTokenAddress,
        name: tokensResponse[dripTokenAddress].name[0],
        symbol: tokensResponse[dripTokenAddress].symbol[0],
        decimals: dripTokenDecimals
      }

      const measureToken = {
        address: measureTokenAddress,
        name: tokensResponse[measureTokenAddress].name[0],
        symbol: tokensResponse[measureTokenAddress].symbol[0],
        decimals: tokensResponse[measureTokenAddress].decimals[0]
      }

      result.push({
        address: tokenFaucetAddress,
        dripRatePerSecond,
        totalUnclaimed,
        totalUnclaimedUnformatted,
        asset: dripTokenAddress,
        measure: measureTokenAddress,
        chainId,

        dripToken,
        measureToken
      })
    })

    return result
  } catch (e) {
    console.warn(e.message)
    return null
  }
}
