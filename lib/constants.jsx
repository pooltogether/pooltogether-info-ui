import PoolWithMultipleWinnersBuilderMainnet from '@pooltogether/pooltogether-contracts/deployments/mainnet/PoolWithMultipleWinnersBuilder.json'
import PoolWithMultipleWinnersBuilderRinkeby from '@pooltogether/pooltogether-contracts/deployments/rinkeby/PoolWithMultipleWinnersBuilder.json'

export const SUPPORTED_CHAIN_IDS = [1, 4, 31337, 1234]

export const SECONDS_PER_BLOCK = 13

export const SECONDS_PER_WEEK = 604800
export const SECONDS_PER_DAY = 86400
export const SECONDS_PER_HOUR = 3600

export const DEFAULT_TOKEN_PRECISION = 18

export const MAINNET_POLLING_INTERVAL = process.env.NEXT_JS_DOMAIN_NAME ? 22 * 1000 : 16 * 1000

export const MAX_SAFE_INTEGER = 9007199254740991

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
    Stablecoin: '0xdac17f958d2ee523a2206206994597c13d831ec7'
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
  getPrizePoolReserves: 'getPrizePoolReserves',
  getTimelockTokenBalance: 'getTimelockTokenBalance',
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
export const DISCORD_INVITE_URL = 'https://discord.gg/hxPhPDW'
export const POOLPOOL_URL = 'https://app.pooltogether.com/pools/mainnet/PT-stPOOL'

export const POOLPOOL_TICKET_CREATED_BLOCK = 11987787

export const UNISWAP_GRAPH_URIS = {
  1: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v2',
  4: 'https://api.thegraph.com/subgraphs/name/blockrockettech/uniswap-v2-subgraph-rinkeby',
  137: 'https://api.thegraph.com/subgraphs/name/sameepsi/quickswap'
}
