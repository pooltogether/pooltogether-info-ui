import React from 'react'
import { Card, ExternalLink } from '@pooltogether/react-components'

import { usePoolPrice } from '@hooks/usePoolPrice'
import { formatCurrencyNumberForDisplay } from '@pooltogether/utilities'

export const PoolPriceCard = (props) => {
  const { className } = props

  const poolPrice = usePoolPrice()

  return (
    <Card className={className}>
      <h6 className='font-averta text-accent-2 text-xs uppercase mb-4'>POOL Price</h6>
      <div className='flex flex-row justify-between'>
        <h4>{poolPrice && <span>{formatCurrencyNumberForDisplay(poolPrice.usd)}</span>}</h4>
        <ExternalLink className='my-auto' href='https://www.coingecko.com/en/coins/pooltogether'>
          Historical price
        </ExternalLink>
      </div>
    </Card>
  )
}
