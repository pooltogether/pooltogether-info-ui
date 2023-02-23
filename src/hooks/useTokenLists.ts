import { CONTRACT_ADDRESSES } from '@constants/legacy'
import { CHAIN_ID } from '@pooltogether/wallet-connection'

export function useTokenLists(chainIds?: number[]) {
  const tokenLists: { [chainId: number]: string[] } = {}

  if (!chainIds) {
    return TOKEN_LISTS
  }

  chainIds.forEach((chainId) => {
    tokenLists[chainId] = TOKEN_LISTS[chainId]
  })

  return tokenLists
}

// NOTE: All addresses are lowercase
const TOKEN_LISTS: Readonly<{
  [x: number]: string[]
}> = Object.freeze({
  [CHAIN_ID.mainnet]: [
    CONTRACT_ADDRESSES[CHAIN_ID.mainnet].GovernanceToken, // POOL
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48', // USDC
    '0xdac17f958d2ee523a2206206994597c13d831ec7', // USDT
    '0xde30da39c46104798bb5aa3fe8b9e0e1f348163f', // Gitcoin
    '0x5faa989af96af85384b8a938c2ede4a7378d9875', // Galaxy
    '0xc7283b66eb1eb5fb86327f08e1b5816b0720212b', // Tribe
    '0xc00e94cb662c3520282e6f5717214004a7f26888', // COMP
    '0x6b175474e89094c44da98b954eedeac495271d0f', // DAI
    '0x1f9840a85d5af5bf1d1762f925bdaddc4201f984', // UNI
    '0x3472a5a71965499acd81997a54bba8d852c6e53d', // BADGER
    '0x0391d2021f89dc339f60fff84546ea23e337750f', // BOND
    '0x391a437196c81eea7bbbbd5ed4df6b49de4f5c96', // ScUSDC
    '0x0a2e7f69fe9588fa7fba5f5864236883cd4aac6d', // PDAIS
    '0x6b3595068778dd592e39a122f4f5a5cf09c90fe2', // SUSHI
    '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9', // AAVE
    '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0', // MATIC
    '0xdd4d117723c257cee402285d3acf218e9a8236e1', // PTaUSDC
    '0x028171bca77440897b824ca71d1c56cac55b68a3', // aDAI
    '0x93567d6b6553bde2b652fb7f197a229b93813d3f', // AVAX
    '0x4da27a545c0c5b758a6ba100e3a049001de870f5', // stkAave
    '0xae7ab96520de3a18e5e111b5eaab095312d7fe84', // stETH
    '0xd5f60154bef3564ebfbe9bb236595f0da548a742' // SPETHWIN
  ],
  [CHAIN_ID.polygon]: [
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // POS USDT
    '0x6a304dFdb9f808741244b6bfEe65ca7B3b3A6076', // PTaUSDC
    '0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4', // stMATIC
    '0x6847d3a4c80a82e1fb26f1fc6f09f3ad5beb5222' // C4Arena
  ],
  [CHAIN_ID.avalanche]: [
    '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7', // wAVAX
    '0xb27f379c050f6ed0973a01667458af6ecebc1d90' // PTaUSDC
  ],
  [CHAIN_ID.optimism]: [
    '0x62bb4fc73094c83b5e952c2180b23fa7054954c4', // PTaUSDC
    '0x4200000000000000000000000000000000000042' // OP
  ]
})

export const TOKEN_PRICE_ALIASES = {
  [CHAIN_ID.mainnet]: {
    // stkAAVE
    '0x4da27a545c0c5b758a6ba100e3a049001de870f5': {
      chainId: CHAIN_ID.mainnet,
      address: '0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9' // AAVE
    },
    // PTaUSDC
    '0xdd4d117723c257cee402285d3acf218e9a8236e1': {
      chainId: CHAIN_ID.mainnet,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' // USDC
    },
    // aDAI
    '0x028171bca77440897b824ca71d1c56cac55b68a3': {
      chainId: CHAIN_ID.mainnet,
      address: '0x6b175474e89094c44da98b954eedeac495271d0f' // DAI
    },
    // ScUSDC
    '0x391a437196c81eea7bbbbd5ed4df6b49de4f5c96': {
      chainId: CHAIN_ID.mainnet,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' // USDC
    },
    // SPETHWIN
    '0xd5f60154bef3564ebfbe9bb236595f0da548a742': {
      chainId: CHAIN_ID.mainnet,
      address: '0xae7ab96520de3a18e5e111b5eaab095312d7fe84' // stETH
    }
  },
  [CHAIN_ID.polygon]: {
    // POS USDT
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f': {
      chainId: CHAIN_ID.mainnet,
      address: '0xdac17f958d2ee523a2206206994597c13d831ec7' // USDT
    },
    // wMATIC
    '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270': {
      chainId: CHAIN_ID.mainnet,
      address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0' // MATIC
    },
    // PTaUSDC
    '0x6a304dfdb9f808741244b6bfee65ca7b3b3a6076': {
      chainId: CHAIN_ID.mainnet,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' // USDC
    },
    // stMATIC
    '0x3a58a54c066fdc0f2d55fc9c89f0415c92ebf3c4': {
      chainId: CHAIN_ID.mainnet,
      address: '0x7d1afa7b718fb893db30a3abc0cfc608aacfebb0' // MATIC
    }
  },
  [CHAIN_ID.avalanche]: {
    // wAVAX
    '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7': {
      chainId: CHAIN_ID.mainnet,
      address: '0x93567d6b6553bde2b652fb7f197a229b93813d3f' // AVAX
    },
    // PTaUSDC
    '0xb27f379c050f6ed0973a01667458af6ecebc1d90': {
      chainId: CHAIN_ID.mainnet,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' // USDC
    }
  },
  [CHAIN_ID.optimism]: {
    '0x62bb4fc73094c83b5e952c2180b23fa7054954c4': {
      chainId: CHAIN_ID.mainnet,
      address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48' // USDC
    }
  }
}
