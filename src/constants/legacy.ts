import { CHAIN_ID } from '@pooltogether/wallet-connection'

export const SUPPORTED_CHAIN_IDS = [1, 4, 31337, 1234]

export const SECONDS_PER_BLOCK = 13

export const SECONDS_PER_WEEK = 604800
export const SECONDS_PER_DAY = 86400
export const SECONDS_PER_HOUR = 3600

export const DEFAULT_TOKEN_PRECISION = 18

export const MAINNET_POLLING_INTERVAL = process.env.NEXT_JS_DOMAIN_NAME ? 22 * 1000 : 16 * 1000

export const MAX_SAFE_INTEGER = 9007199254740991

export const ETHEREUM_NETWORKS = [1, 3, 4, 5, 42]

// cookie names
export const TRANSACTIONS_KEY = 'txs'
export const SHOW_MANAGE_LINKS = 'showManageLinks'
export const MAGIC_EMAIL = 'magicEmail'
export const SELECTED_WALLET_COOKIE_KEY = 'selectedWallet'

// strings
export const CONFETTI_DURATION_MS = 12000

export const DEFAULT_INPUT_CLASSES =
  'w-full text-inverse inline-flex items-center justify-between trans'

const domain = process.env.NEXT_JS_DOMAIN_NAME && `.${process.env.NEXT_JS_DOMAIN_NAME}`
export const COOKIE_OPTIONS = {
  sameSite: 'strict',
  secure: process.env.NEXT_JS_DOMAIN_NAME === 'pooltogether.com',
  domain
}

export const CONTRACT_ADDRESSES = {
  1: {
    GovernanceTimelock: '0x42cd8312d2bce04277dd5161832460e95b24262e',
    GovernanceToken: '0x0cec1a9154ff802e7934fc916ed7ca50bde6844e',
    TreasuryVester: '0x21950e281bde1714ffd1062ed17c56d4d8de2359',
    Stablecoin: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    BondTreasury: '0x7437e08982a39fca561c1ca1da1d23ff26fe2b93'
  },
  4: {
    GovernanceTimelock: '0x8df0afb54836dc8d0ae795503f837cff197d3df1',
    GovernanceToken: '0xc4e90a8dc6caab329f08ed3c8abc6b197cf0f40a',
    TreasuryVester: '0x529a916b8b7ec8e01805d45aed1109c764ea88b9',
    Stablecoin: '0xdac17f958d2ee523a2206206994597c13d831ec7'
  },
  137: {
    Stablecoin: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063'
  }
}

export const QUERY_KEYS = {
  getTokenFaucets: 'getTokenFaucets',
  getPrizePoolReserves: 'getPrizePoolReserves',
  getTokenBalances: 'getTokenBalances',
  getAaveRewardsBalances: 'getAaveRewardsBalances',
  getTokenPrices: 'getTokenPrices'
}

export const ETHERSCAN_API_KEY = process.env.NEXT_JS_ETHERSCAN_API_KEY

export const PROPOSAL_STATUS = {
  pending: 'pending',
  active: 'active',
  cancelled: 'cancelled',
  defeated: 'defeated',
  succeeded: 'succeeded',
  queued: 'queued',
  expired: 'expired',
  executed: 'executed'
}

// Note: Order matches contracts
export const PROPOSAL_STATES = [
  PROPOSAL_STATUS.pending,
  PROPOSAL_STATUS.active,
  PROPOSAL_STATUS.cancelled,
  PROPOSAL_STATUS.defeated,
  PROPOSAL_STATUS.succeeded,
  PROPOSAL_STATUS.queued,
  PROPOSAL_STATUS.expired,
  PROPOSAL_STATUS.executed
]

export const VOTERS_PER_PAGE = 10
export const DELEGATES_PER_PAGE = 15

export const POOLPOOL_SNAPSHOT_URL = 'https://snapshot.org/#/poolpool.pooltogether.eth'
export const POOLTOGETHER_SNAPSHOT_URL = 'https://snapshot.org/#/pooltogether.eth'
export const POOLTOGETHER_GOV_FORUM_URL = 'https://gov.pooltogether.com'
export const DISCORD_INVITE_URL = 'https://pooltogether.com/discord'
export const POOLPOOL_URL = 'https://app.pooltogether.com/pools/mainnet/PT-stPOOL'

export const POOLPOOL_TICKET_CREATED_BLOCK = 11987787

export const UNISWAP_GRAPH_URIS = {
  1: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  4: 'https://api.thegraph.com/subgraphs/name/blockrockettech/uniswap-v2-subgraph-rinkeby',
  137: 'https://api.thegraph.com/subgraphs/name/sameepsi/quickswap'
}

export const TWAB_DELEGATOR_ADDRESS: { [chainId: number]: string } = Object.freeze({
  [CHAIN_ID.optimism]: '0x469C6F4c1AdA45EB2E251685aC2bf05aEd591E70',
  [CHAIN_ID.polygon]: '0x89Ee77Ce3F4C1b0346FF96E3004ff7C9f972dEF8',
  [CHAIN_ID.mainnet]: '0x5cFbEE38362B9A60be276763753f64245EA990F7',
  [CHAIN_ID.avalanche]: '0xd23723fef8A16B77eaDc1fC822aE4170bA9d4009',
  [CHAIN_ID['optimism-kovan']]: '0xDDbd5eab2011a2240F69FD1255246922931C66A6',
  [CHAIN_ID['optimism-goerli']]: '0x6176776490147b41813C1a0e342080d2CAA4e618',
  [CHAIN_ID.mumbai]: '0xaAc4688AB7AD2c0CbC51E9674D53Bf394910aF6a',
  [CHAIN_ID.rinkeby]: '0x448200d83e48f561B42e90274566d3FA3914B8A4',
  [CHAIN_ID.fuji]: '0xdB4B551C21860028c4CA951CC7067699eB7c5Bfe'
})
