import { atom, useAtom } from 'jotai'
import { CoingeckoToken } from '../utils/getCoingeckoTokens'

export const coingeckoTokensAtom = atom<CoingeckoToken[]>([])

export const useCoingeckoTokens = () => {
  const [tokens] = useAtom(coingeckoTokensAtom)
  return tokens
}
