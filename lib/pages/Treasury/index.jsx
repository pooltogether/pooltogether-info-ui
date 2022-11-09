import React from 'react'

import { Meta } from 'lib/components/Meta'
import { Layout } from 'lib/components/Layout'
import { PoolPriceCard } from 'lib/pages/Treasury/PoolPriceCard'
import { ReservesCard } from 'lib/pages/Treasury/ReservesCard'
import { TokenBalancesCard } from 'lib/pages/Treasury/TokenBalancesCard'
import { TreasuryTotalBanner } from 'lib/pages/Treasury/TreasuryTotalBanner'

export const Treasury = (props) => {
  return (
    <>
      <Meta title='Overview' />

      <Layout>
        <TreasuryTotalBanner className='mb-4 sm:mb-10 p-6 sm:px-12 leading-none' />
        <PoolPriceCard className='mb-4 sm:mb-10 leading-none' />
        <ReservesCard className='mb-4 sm:mb-10 leading-none' />
        <TokenBalancesCard className='mb-4 sm:mb-10 leading-none' />
      </Layout>
    </>
  )
}
