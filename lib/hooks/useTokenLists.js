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
    '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
    '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f', // Gitcoin
    '0xc00e94cb662c3520282e6f5717214004a7f26888', // COMP
    '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', // UNI
    '0x3472a5a71965499acd81997a54bba8d852c6e53d', // BADGER
    '0x0391d2021f89dc339f60fff84546ea23e337750f', // BOND
    '0x391a437196c81eea7bbbbd5ed4df6b49de4f5c96', // ScUSDC
    '0x0a2e7f69fe9588fa7fba5f5864236883cd4aac6d', // PDAIS
    '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2', // SUSHI
    '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', // AAVE
    '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0' // MATIC
  ],
  [NETWORK.rinkeby]: [
    CONTRACT_ADDRESSES[NETWORK.rinkeby].GovernanceToken // POOL
  ],
  [NETWORK.polygon]: [
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f' // POS USDT
  ],
  [NETWORK.avalanche]: [
    '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7' // wAVAX
  ]
})

export const TOKEN_PRICE_ALIASES = {
  [NETWORK.mainnet]: {
    // stkAAVE
    '0x4da27a545c0c5b758a6ba100e3a049001de870f5': {
      chainId: NETWORK.mainnet,
      address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9' // AAVE
    }
  },
  [NETWORK.polygon]: {
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f': {
      chainId: NETWORK.mainnet,
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7' // USDT
    },
    // wMATIC
    '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270': {
      chainId: NETWORK.mainnet,
      address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0' // MATIC
    }
  },
  [NETWORK.avalanche]: {
    // wAVAX
    '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7': {
      chainId: NETWORK.mainnet,
      address: '0x93567d6b6553bde2b652fb7f197a229b93813d3f' // AVAX
    }
  }
}
