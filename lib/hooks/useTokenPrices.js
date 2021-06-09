import { sToMs } from '@pooltogether/utilities'
import { QUERY_KEYS } from 'lib/constants'
import { getTokenPrices } from 'lib/fetchers/getTokenPriceData'
import { useChainIds } from 'lib/hooks/useChainIds'
import { useTokenLists } from 'lib/hooks/useTokenLists'
import { useQuery } from 'react-query'

export const useTokenPrices = () => {
  const chainIds = useChainIds()
  const tokenLists = useTokenLists(chainIds)

  const tokenPrices = useQuery(
    [QUERY_KEYS.getTokenPrices],
    () => getAllTokenPrices(chainIds, tokenLists),
    {
      refetchInterval: sToMs(120),
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  )

  return tokenPrices
}

const getAllTokenPrices = async (chainIds, tokenLists) => {
  const responses = await Promise.all([
    ...chainIds.map(async (chainId) => {
      return {
        chainId: chainId,
        data: await getTokenPrices(chainId, tokenLists[chainId])
      }
    })
  ])
  const result = {}
  responses.forEach((response) => {
    result[response.chainId] = response.data
  })
  return result
}
