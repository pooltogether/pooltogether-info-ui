import { NETWORK } from '@pooltogether/utilities'
import { CONTRACT_ADDRESSES } from 'lib/constants'

export function useTokenLists(chainIds) {
  const tokenLists = {}
  chainIds.forEach((chainId) => {
    tokenLists[chainId] = TOKEN_LISTS[chainId]
  })
  return tokenLists
}

const TOKEN_LISTS = Object.freeze({
  [NETWORK.mainnet]: [
    CONTRACT_ADDRESSES[NETWORK.mainnet].GovernanceToken, // POOL
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f', // Gitcoin
    '0xc00e94cb662c3520282e6f5717214004a7f26888', // COMP
    '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', // UNI
    '0x3472a5a71965499acd81997a54bba8d852c6e53d', // BADGER
    // '0x03ab458634910aad20ef5f1c8ee96f1d6ac54919', // RAI
    // '0x57ab1ec28d129707052df4df418d58a2d46d5f51', // sUSD
    // '0x4fabb145d64652a948d72533023f6e7a623c7c53', // BUSD
    // '0x056fd409e1d7a124bd7017459dfea2f387b6d5cd' // GUSD
    '0x391a437196c81eea7bbbbd5ed4df6b49de4f5c96', // ScUSDC
    '0x0a2e7f69fe9588fa7fba5f5864236883cd4aac6d' // PDAIS
  ],
  [NETWORK.rinkeby]: [
    CONTRACT_ADDRESSES[NETWORK.rinkeby].GovernanceToken // POOL
  ],
  [NETWORK.matic]: [
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f' // POS USDT
  ]
})
