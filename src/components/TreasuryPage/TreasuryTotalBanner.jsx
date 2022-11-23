import React from 'react'
import { Banner, Amount } from '@pooltogether/react-components'
import { formatCurrencyNumberForDisplay } from '@pooltogether/utilities'

import { useTreasuryTotal } from '@hooks/useTreasuryTotal'

export const TreasuryTotalBanner = (props) => {
  const { className } = props

  const { data, isFetched } = useTreasuryTotal()
  console.log({ data })

  return (
    <Banner className={className}>
      <h6 className='font-averta text-white text-xs uppercase mb-4'>Treasury Balance</h6>
      <h1 className='text-white'>
        {isFetched && data?.totalValueUsd && (
          <span>{formatCurrencyNumberForDisplay(data.totalValueUsd)}</span>
        )}
      </h1>
    </Banner>
  )
}
