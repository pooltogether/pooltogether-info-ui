import { TreasuryTotalBanner } from 'lib/components/TreasuryPage/TreasuryTotalBanner'
import { PoolPriceCard } from 'lib/components/TreasuryPage/PoolPriceCard'
import React from 'react'
import { ReservesCard } from 'lib/components/TreasuryPage/ReservesCard'
import { TokenBalancesCard } from 'lib/components/TreasuryPage/TokenBalancesCard'
import Layout from 'lib/components/Layout'

const Page = (props) => {
  return (
    <Layout>
      <TreasuryTotalBanner className='mb-4 sm:mb-10' />
      <PoolPriceCard className='mb-4 sm:mb-10' />
      <ReservesCard className='mb-4 sm:mb-10' />
      <TokenBalancesCard />
    </Layout>
  )
}

export default Page
