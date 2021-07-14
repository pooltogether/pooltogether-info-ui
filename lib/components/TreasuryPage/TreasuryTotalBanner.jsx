import React from 'react'
import { Banner, Amount } from '@pooltogether/react-components'
import { numberWithCommas } from '@pooltogether/utilities'

import { useTreasuryTotal } from 'lib/hooks/useTreasuryTotal'

export const TreasuryTotalBanner = (props) => {
  const { className } = props

  const { data, isFetched } = useTreasuryTotal()

  return (
    <Banner className={className}>
      <h6 className='font-inter text-white text-xs uppercase mb-4'>Treasury Balance</h6>
      <h1 className='text-white'>
        $
        {isFetched && data?.totalValueUsd ? (
          <Amount>{numberWithCommas(data.totalValueUsd, { precision: 2 })}</Amount>
        ) : (
          '--'
        )}
      </h1>
    </Banner>
  )
}
