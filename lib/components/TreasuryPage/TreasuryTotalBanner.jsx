import { Banner, Amount } from '@pooltogether/react-components'
import { numberWithCommas } from '@pooltogether/utilities'
import { useTreasuryTotal } from 'lib/hooks/useTreasuryTotal'
import React from 'react'

export const TreasuryTotalBanner = (props) => {
  const { className } = props

  const { data, isFetched } = useTreasuryTotal()

  return (
    <Banner className={className}>
      <h6 className='font-light mb-2 text-white'>Treasury Balance</h6>
      <h1 className='text-white'>
        $
        {isFetched ? (
          <Amount>{numberWithCommas(data.totalValueUsd, { precision: 2 })}</Amount>
        ) : (
          '--'
        )}
      </h1>
    </Banner>
  )
}
