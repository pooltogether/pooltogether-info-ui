import { Card, Amount, ExternalLink } from '@pooltogether/react-components'
import { usePoolPrice } from 'lib/hooks/usePoolPrice'
import { numberWithCommas } from '@pooltogether/utilities'
import React, { useEffect } from 'react'

export const PoolPriceCard = (props) => {
  const { className } = props

  const poolPrice = usePoolPrice()

  // useEffect(() => {
  //   console.log(poolPrice)
  // }, [poolPrice])

  return (
    <Card className={className}>
      <h6 className='font-light mb-2'>POOL Price</h6>
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
