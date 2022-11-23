import { CHAIN_ID } from '@pooltogether/wallet-connection'

export const RPC_URLS = {
  // Ethereum
  [CHAIN_ID.mainnet]: process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_RPC_URL,
  [CHAIN_ID.rinkeby]: process.env.NEXT_PUBLIC_ETHEREUM_RINKEBY_RPC_URL,
  [CHAIN_ID.ropsten]: process.env.NEXT_PUBLIC_ETHEREUM_ROPSTEN_RPC_URL,
  [CHAIN_ID.kovan]: process.env.NEXT_PUBLIC_ETHEREUM_KOVAN_RPC_URL,
  [CHAIN_ID.goerli]: process.env.NEXT_PUBLIC_ETHEREUM_GOERLI_RPC_URL,
  // Avalanche
  [CHAIN_ID.avalanche]: process.env.NEXT_PUBLIC_AVALANCHE_MAINNET_RPC_URL,
  [CHAIN_ID.fuji]: process.env.NEXT_PUBLIC_AVALANCHE_FUJI_RPC_URL,
  // Polygon
  [CHAIN_ID.polygon]: process.env.NEXT_PUBLIC_POLYGON_MAINNET_RPC_URL,
  [CHAIN_ID.mumbai]: process.env.NEXT_PUBLIC_POLYGON_MUMBAI_RPC_URL,
  // Optimism
  [CHAIN_ID.optimism]: process.env.NEXT_PUBLIC_OPTIMISM_MAINNET_RPC_URL,
  [CHAIN_ID['optimism-goerli']]: process.env.NEXT_PUBLIC_OPTIMISM_GOERLI_RPC_URL,
  // Arbitrum
  [CHAIN_ID.arbitrum]: process.env.NEXT_PUBLIC_ARBITRUM_MAINNET_RPC_URL,
  [CHAIN_ID['arbitrum-goerli']]: process.env.NEXT_PUBLIC_ARBITRUM_GOERLI_RPC_URL,
  // Celo
  [CHAIN_ID.celo]: process.env.NEXT_PUBLIC_CELO_MAINNET_RPC_URL,
  [CHAIN_ID['celo-testnet']]: process.env.NEXT_PUBLIC_CELO_TESTNET_RPC_URL
}
