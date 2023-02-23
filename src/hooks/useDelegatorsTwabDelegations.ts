import { batch, contract } from '@pooltogether/etherplex'
import { getReadProvider } from '@pooltogether/wallet-connection'
import { BigNumber } from 'ethers'
import { useQuery } from 'react-query'
import TwabDelegatorAbi from '../abis/TwabDelegatorAbi.js'
// import { Delegation, DelegationId } from '@twabDelegator/interfaces'
import { TWAB_DELEGATOR_ADDRESS } from '../constants/legacy'

const getTwabDelegatorContractAddress = (chainId: number) => TWAB_DELEGATOR_ADDRESS[chainId]

interface Delegation {
  balance: BigNumber
  delegatee: string
  delegation: string
  length: number
  lockUntil: BigNumber
  wasCreated: boolean
}

interface DelegationId {
  delegator: string
  slot: BigNumber
}

// interface DelegationUpdate extends DelegationId {
//   delegatee: string
//   lockDuration: number
// }

// interface DelegationFund extends DelegationId {
//   amount: BigNumber
// }

/**
 *
 * @param chainId
 * @param delegator
 * @returns
 */
export const useDelegatorsTwabDelegations = (chainId: number, delegator: string) => {
  return useQuery(
    ['useDelegatorsTwabDelegations', delegator, chainId],
    async () => getUsersTwabDelegationsWithIds(chainId, delegator),
    {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      enabled: !!delegator
    }
  )
}

/**
 * TODO: One day this will blow up if someone delegates to more than the max value of a js number...
 * @param chainId
 * @param delegator
 * @returns
 */
const getUsersTwabDelegationsWithIds = async (chainId: number, delegator: string) => {
  const provider = getReadProvider(chainId)
  const twabDelegatorAddress = getTwabDelegatorContractAddress(chainId)

  let batchCalls = []

  const delegationsWithIds: { delegation: Delegation; delegationId: DelegationId }[] = []

  const fetchTwabDelegationsPage = async (pageNumber: number = 0, pageSize: number = 50) => {
    for (
      let slotIndex = pageNumber * pageSize;
      slotIndex < pageNumber * pageSize + pageSize;
      slotIndex++
    ) {
      const twabDelegatorContract = contract(
        slotIndex.toString(),
        TwabDelegatorAbi,
        twabDelegatorAddress
      )
      batchCalls.push(twabDelegatorContract.getDelegation(delegator, slotIndex))
    }

    let response = await batch(provider, ...batchCalls)
    batchCalls = []
    const slotIndices = Object.keys(response)

    slotIndices.forEach((slotIndex) => {
      const delegationResponse: Delegation = response[slotIndex].getDelegation
      const delegation = {
        balance: delegationResponse.balance,
        delegatee: delegationResponse.delegatee,
        delegation: delegationResponse.delegation,
        length: delegationResponse.length,
        lockUntil: delegationResponse.lockUntil,
        wasCreated: delegationResponse.wasCreated
      }
      if (delegation.wasCreated) {
        delegationsWithIds.push({
          delegation,
          delegationId: {
            slot: BigNumber.from(slotIndex),
            delegator
          }
        })
      }
    })

    // If the highest slot was filled, fetch another page. Otherwise, assume there are no more filled slots.

    const lastSlotIndex = pageNumber * pageSize + pageSize - 1
    const lastDelegationInPage: Delegation = response[lastSlotIndex].getDelegation
    if (lastDelegationInPage.wasCreated) {
      await fetchTwabDelegationsPage(pageNumber + 1)
    }
  }

  await fetchTwabDelegationsPage()
  return delegationsWithIds
}
