import React from 'react'

import { Meta } from 'lib/components/Meta'
import { Layout } from 'lib/components/Layout'
import { Nav } from 'lib/components/Layout/Nav'
import { PoolPriceCard } from 'lib/components/TreasuryPage/PoolPriceCard'
import { ReservesCard } from 'lib/components/TreasuryPage/ReservesCard'
import { TokenBalancesCard } from 'lib/components/TreasuryPage/TokenBalancesCard'
import { TreasuryTotalBanner } from 'lib/components/TreasuryPage/TreasuryTotalBanner'

export const TreasuryPage = (props) => {
  return (
    <>
      <Meta title='Treasury' />

      <Layout>
        <Nav />

        <TreasuryTotalBanner className='mb-4 sm:mb-10 p-6 sm:px-12 leading-none' />
        <PoolPriceCard className='mb-4 sm:mb-10 leading-none' />
        <ReservesCard className='mb-4 sm:mb-10 leading-none' />
        <TokenBalancesCard className='mb-4 sm:mb-10 leading-none' />
      </Layout>
    </>
  )
}
