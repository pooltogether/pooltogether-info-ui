import { Meta } from '@components/Meta'
import { PoolPriceCard } from '@components/TreasuryPage/PoolPriceCard'
import { TokenBalancesCard } from '@components/TreasuryPage/TokenBalancesCard'
import { TreasuryTotalBanner } from '@components/TreasuryPage/TreasuryTotalBanner'

export const TreasuryPage = (props: {}) => {
  return (
    <>
      <Meta title='Treasury' />

      <TreasuryTotalBanner className='mb-4 sm:mb-10 p-6 sm:px-12 leading-none' />
      <PoolPriceCard className='mb-4 sm:mb-10 leading-none' />
      <TokenBalancesCard className='mb-4 sm:mb-10 leading-none' />
    </>
  )
}
