import { CHAIN_ID } from '@pooltogether/wallet-connection'
import { COIN_LIST } from '../constants/coingeckoCoinIds'

const CURRENCIES = [
  'btc',
  'eth',
  'usd',
  'aud',
  'brl',
  'cad',
  'cny',
  'czk',
  'eur',
  'gbp',
  'hkd',
  'huf',
  'idr',
  'inr',
  'jpy',
  'krw',
  'mxn',
  'php',
  'sgd',
  'thb',
  'try'
]

export const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3'
export const COINGECKO_ASSET_PLATFORMS = Object.freeze({
  [CHAIN_ID.mainnet]: 'ethereum',
  [CHAIN_ID.bsc]: 'binance-smart-chain',
  [CHAIN_ID.polygon]: 'polygon-pos',
  [CHAIN_ID.celo]: 'celo',
  [CHAIN_ID.avalanche]: 'avalanche',
  [CHAIN_ID.optimism]: 'optimistic-ethereum'
})

// The tokens to fetch prices for
export const TOKENS = {
  [CHAIN_ID.mainnet]: [
    '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e', // POOL
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
    '0xae7ab96520de3a18e5e111b5eaab095312d7fe84' // stETH
  ],
  [CHAIN_ID.polygon]: [
    '0xc2132d05d31c914a87c6611c10748aeb04b58e8f', // POS USDT
    '0x6847d3a4c80a82e1fb26f1fc6f09f3ad5beb5222' // C4Arena
  ],
  [CHAIN_ID.avalanche]: [
    '0xb31f66aa3c1e785363f0875a1b74e27b85fd66c7' // wAVAX
  ],
  [CHAIN_ID.optimism]: [
    '0x4200000000000000000000000000000000000042' // OP
  ]
}

export interface CoingeckoToken {
  price: {
    [currency: string]: number
  }
  id: string
  symbol: string
  name: string
  platforms: {
    [platform: string]: string
  }
}
;[]

export const getCoingeckoTokens = async () => {
  try {
    const res = await fetch('https://api.coingecko.com/api/v3/coins/list?include_platform=true')
    let coingeckoTokenList = await res.json()

    // Rate limited
    if (coingeckoTokenList?.status?.error_code === 429) {
      coingeckoTokenList = COIN_LIST
    }

    const tokens = Object.keys(TOKENS)
      .map(Number)
      .flatMap((chainId) =>
        findTokens(COINGECKO_ASSET_PLATFORMS[chainId], TOKENS[chainId], coingeckoTokenList)
      )
      .filter(Boolean)
    const tokenIds = tokens.map((token) => token.id).join(',')
    const currencies = CURRENCIES.join(',')

    // Fetch Price Data
    const priceRes = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${tokenIds}&vs_currencies=${currencies}`
    )
    const priceData: { [tokenId: string]: { [currency: string]: number } } = await priceRes.json()

    return tokens.map((token) => ({ ...token, price: priceData[token.id] })).filter(Boolean)
  } catch (e) {
    console.log(e)
    return null
  }
}

const findTokens = (
  assetPlatform: string,
  tokens: string[],
  coingeckoTokenList: {
    id: string
    symbol: string
    name: string
    platforms: { [platform: string]: string }
  }[]
) => {
  return tokens.map((token) => {
    const tokenInfo = coingeckoTokenList.find(
      (tokenInfo) => tokenInfo.platforms[assetPlatform] === token.toLowerCase()
    )

    return tokenInfo
  })
}
