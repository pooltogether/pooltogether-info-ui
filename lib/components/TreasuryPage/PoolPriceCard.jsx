import React from 'react'
import { Card, Amount, ExternalLink } from '@pooltogether/react-components'
import { numberWithCommas } from '@pooltogether/utilities'

import { usePoolPrice } from 'lib/hooks/usePoolPrice'

export const PoolPriceCard = (props) => {
  const { className } = props

  const poolPrice = usePoolPrice()

  return (
    <Card className={className}>
      <h6 className='font-inter text-accent-2 text-xs uppercase mb-4'>POOL Price</h6>
      <div className='flex flex-row justify-between'>
        <h4>
          ${poolPrice ? <Amount>{numberWithCommas(poolPrice.usd, { precision: 2 })}</Amount> : '--'}
        </h4>
        <ExternalLink className='my-auto' href='https://www.coingecko.com/en/coins/pooltogether'>
          Historical price
        </ExternalLink>
      </div>
    </Card>
  )
}
