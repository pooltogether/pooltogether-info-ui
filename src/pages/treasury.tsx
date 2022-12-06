import Layout from '@components/Layout'
import { TreasuryPage } from '@components/TreasuryPage'
import { useHydrateAtoms } from 'jotai/utils'
import { coingeckoTokensAtom } from '../atoms/serverAtoms'
import { CoingeckoToken, getCoingeckoTokens } from '../utils/getCoingeckoTokens'

// This function gets called at build time on server-side.
// It may be called again, on a serverless function, if
// revalidation is enabled and a new request comes in
export async function getStaticProps() {
  const coingeckoTokens = await getCoingeckoTokens()
  return {
    props: { coingeckoTokens },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in at most once every X seconds
    revalidate: 86400
  }
}

export default function Page(props: { coingeckoTokens: CoingeckoToken[] }) {
  const { coingeckoTokens } = props

  useHydrateAtoms([[coingeckoTokensAtom, coingeckoTokens]])

  return (
    <Layout>
      <TreasuryPage />
    </Layout>
  )
}
