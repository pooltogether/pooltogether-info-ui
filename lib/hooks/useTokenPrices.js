import { isEmpty } from 'lodash'
import { useQuery } from 'react-query'
import { sToMs } from '@pooltogether/utilities'

import { QUERY_KEYS } from 'lib/constants'
import { getTokenPrices } from 'lib/fetchers/getTokenPriceData'

export const useTokenPrices = (chainIds, tokenLists) => {
  const enabled = chainIds?.length > 0 && !isEmpty(tokenLists)

  return useQuery(
    [QUERY_KEYS.getTokenPrices, chainIds, tokenLists],
    () => getAllTokenPrices(chainIds, tokenLists),
    {
      enabled,
      refetchInterval: sToMs(120),
      refetchOnMount: false,
      refetchOnWindowFocus: false
    }
  )
}

const getAllTokenPrices = async (chainIds, tokenLists) => {
  console.log(tokenLists)

  const responses = await Promise.all([
    ...chainIds.map(async (chainId) => {
      return {
        chainId: chainId,
        data: await getTokenPrices(chainId, tokenLists[chainId])
      }
    })
  ])

  console.log({ responses })
  const result = {}
  responses.forEach((response) => {
    result[response.chainId] = response.data
  })
  // console.log({ result })

  return result
}
