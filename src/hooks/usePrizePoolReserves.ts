// @ts-nocheck
import ERC20Abi from '@abis/ERC20Abi'
import { QUERY_KEYS } from '@constants/legacy'
import { RPC_URLS } from '@constants/rpc'
import { formatUnits } from '@ethersproject/units'
import { usePrizePoolContracts } from '@hooks/usePrizePoolContracts'
import { useTokenLists } from '@hooks/useTokenLists'
import { useTokenPrices } from '@hooks/useTokenPrices'
import { contract, batch } from '@pooltogether/etherplex'
import PrizePoolAbi from '@pooltogether/pooltogether-contracts/abis/PrizePool'
import {
  addBigNumbers,
  amountMultByUsd,
  sToMs,
  toNonScaledUsdString,
  toScaledUsdBigNumber
} from '@pooltogether/utilities'
import { getReadProviders, CHAIN_ID } from '@pooltogether/wallet-connection'
import { useQuery } from 'react-query'

const useGetPrizePoolReserves = (chainIds, providers, prizePoolContracts) => {
  const enabled = Boolean(chainIds)

  return useQuery(
    [QUERY_KEYS.getPrizePoolReserves, chainIds],
    () => getPrizePoolReservesForAllChainIds(chainIds, providers, prizePoolContracts),
    {
      enabled,
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  )
}

export const usePrizePoolReserves = () => {
  const chainIds = [CHAIN_ID.mainnet, CHAIN_ID.polygon]
  const prizePoolContracts = usePrizePoolContracts(chainIds)

  const providers = getReadProviders(chainIds, RPC_URLS)

  const reserves = useGetPrizePoolReserves(chainIds, providers, prizePoolContracts)

  const tokenLists = useTokenLists()
  const tokenPrices = useTokenPrices(tokenLists)

  const isFetched = reserves.isFetched
  const refetch = async () => {
    reserves.refetch()
  }

  let data: {
    [chainId: number]: {}[]
  }
  if (isFetched) {
    Object.keys(reserves.data).forEach((chainId) => {
      const _reserves = reserves.data[chainId] || []
      _reserves.forEach((reserve) => {
        if (!data[chainId]) {
          data[chainId] = []
        }

        const token = reserve.token
        const tokenAddress = token.address.toLowerCase()
        const tokenPriceData = tokenPrices[chainId]?.[tokenAddress] || {}

        const usd = tokenPriceData.usd

        if (!usd) {
          data[chainId].push({
            ...reserve,
            chainId: Number(chainId)
          })
        } else {
          const usdValueUnformatted = amountMultByUsd(token.amountUnformatted, usd)
          const totalValueUsd = formatUnits(usdValueUnformatted, token.decimals)
          const totalValueUsdScaled = toScaledUsdBigNumber(totalValueUsd)

          data[chainId].push({
            ...reserve,
            chainId: Number(chainId),
            token: {
              ...reserve.token,
              usd,
              totalValueUsd,
              totalValueUsdScaled
            }
          })
        }
      })
    })
  }

  return {
    refetch,
    isFetched,
    data
  }
}

export const usePrizePoolReservesFlattened = () => {
  const { data, ...remainder } = usePrizePoolReserves()
  const reserves = data ? Object.values(data).flat().filter(Boolean) : null
  return { ...remainder, data: reserves }
}

export const usePrizePoolReservesTotal = () => {
  const { data, isFetched } = usePrizePoolReservesFlattened()

  if (!isFetched) {
    return {
      isFetched,
      data: {
        totalValueUsd: null,
        totalValueUsdScaled: null
      }
    }
  }

  const totalValueUsdScaled = addBigNumbers(
    data.map((reserve) => reserve.token.totalValueUsdScaled).filter(Boolean)
  )
  const totalValueUsd = toNonScaledUsdString(totalValueUsdScaled)

  return {
    isFetched,
    data: {
      totalValueUsd,
      totalValueUsdScaled
    }
  }
}

const getPrizePoolReservesForAllChainIds = async (chainIds, readProviders, prizePoolContracts) => {
  const responses = await Promise.all([
    ...chainIds.map(async (chainId) => {
      return {
        chainId: chainId,
        data: await getPrizePoolReserves(
          chainId,
          readProviders[chainId],
          prizePoolContracts[chainId]
        )
      }
    })
  ])
  const result = {}
  responses.forEach((response) => {
    result[response.chainId] = response.data
  })
  return result
}

const getPrizePoolReserves = async (chainId, readProvider, prizePoolContracts) => {
  try {
    // First set of calls
    let batchCalls = []

    prizePoolContracts.forEach((prizePoolContract) => {
      const prizePool = contract(
        prizePoolContract.prizePool.address,
        PrizePoolAbi,
        prizePoolContract.prizePool.address
      )

      batchCalls.push(prizePool.reserveTotalSupply().token())
    })

    const response1 = await batch(readProvider, ...batchCalls)
    batchCalls = []

    prizePoolContracts.forEach((prizePoolContract) => {
      const underlyingTokenAddress = response1[prizePoolContract.prizePool.address].token[0]
      const underlyingToken = contract(underlyingTokenAddress, ERC20Abi, underlyingTokenAddress)

      batchCalls.push(underlyingToken.symbol().name().decimals())
    })

    const response2 = await batch(readProvider, ...batchCalls)

    const result = []
    prizePoolContracts.forEach((prizePoolContract) => {
      const prizePoolAddress = prizePoolContract.prizePool.address
      const underlyingTokenAddress = response1[prizePoolAddress].token[0]
      const amountUnformatted = response1[prizePoolAddress].reserveTotalSupply[0]
      const decimals = response2[underlyingTokenAddress].decimals[0]
      const amount = formatUnits(amountUnformatted, decimals)

      result.push({
        ...prizePoolContract,
        token: {
          amount,
          amountUnformatted,
          address: underlyingTokenAddress,
          decimals,
          name: response2[underlyingTokenAddress].name[0],
          symbol: response2[underlyingTokenAddress].symbol[0]
        }
      })
    })
    return result
  } catch (e) {
    console.warn(e.message)
    return null
  }
}
