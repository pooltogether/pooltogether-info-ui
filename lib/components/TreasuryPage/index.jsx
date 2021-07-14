import React from 'react'

import Layout from 'lib/components/Layout'
import { PoolPriceCard } from 'lib/components/TreasuryPage/PoolPriceCard'
import { ReservesCard } from 'lib/components/TreasuryPage/ReservesCard'
import { TokenBalancesCard } from 'lib/components/TreasuryPage/TokenBalancesCard'
import { TokenFaucetsCard } from 'lib/components/TreasuryPage/TokenFaucetsCard'
import { TreasuryTotalBanner } from 'lib/components/TreasuryPage/TreasuryTotalBanner'

const Page = (props) => {
  return (
    <Layout>
      <TreasuryTotalBanner className='mb-4 sm:mb-10 p-6 sm:px-12 leading-none' />
      <PoolPriceCard className='mb-4 sm:mb-10 leading-none' />
      <ReservesCard className='mb-4 sm:mb-10 leading-none' />
      <TokenBalancesCard className='mb-4 sm:mb-10 leading-none' />
      <TokenFaucetsCard className='leading-none' />
    </Layout>
  )
}

export default Page
