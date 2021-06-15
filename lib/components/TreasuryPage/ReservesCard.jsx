import { ScreenSize, useScreenSize } from '@pooltogether/hooks'
import { Amount, BasicTable, Card, TokenIcon, ExternalLink } from '@pooltogether/react-components'
import {
  getMinPrecision,
  getNetworkNameAliasByChainId,
  getPrizePoolSymbol,
  numberWithCommas
} from '@pooltogether/utilities'
import { LoadingRows } from 'lib/components/LoadingRows'
import {
  usePrizePoolReserves,
  usePrizePoolReservesFlattened,
  usePrizePoolReservesTotal
} from 'lib/hooks/usePrizePoolReserves'
import React, { useEffect, useMemo } from 'react'
import { useFlexLayout, useTable } from 'react-table'

export const ReservesCard = (props) => {
  const { className } = props

  const { data, isFetched } = usePrizePoolReservesTotal()

  return (
    <Card className={className}>
      <h6 className='font-light mb-2'>Prize Pool Reserves</h6>
      <h4 className='mb-4'>
        $
        {isFetched ? (
          <Amount>{numberWithCommas(data.totalValueUsd, { precision: 2 })}</Amount>
        ) : (
          '--'
        )}
      </h4>
      <ReservesList />
    </Card>
  )
}

const ReservesList = (props) => {
  const { data: reserves, isFetched } = usePrizePoolReservesFlattened()

  const screenSize = useScreenSize()

  const columns = useMemo(() => {
    const rows = {
      symbol: {
        accessor: 'symbol',
        className: '',
        Cell: (row) => <Symbol {...row.row.original} row={row} />
      },
      amount: {
        accessor: 'amount',
        className: '',
        Cell: (row) => <TokenAmount {...row.row.original} row={row} />
      },
      usd: {
        accessor: 'totalValueUsd',
        className: '',
        Cell: (row) => <UsdAmount {...row.row.original} row={row} />
      },
      links: {
        accessor: 'links',
        className: '',
        Cell: (row) => <Links {...row.row.original} row={row} />
      }
    }

    if (screenSize < ScreenSize.sm) {
      return [rows.symbol, rows.usd, rows.links]
    }

    return [rows.symbol, rows.amount, rows.usd, rows.links]
  }, [screenSize])

  const data = useMemo(() => {
    let data = []

    if (isFetched) {
      data = reserves
    }

    data = data.filter((reserve) => !reserve.token.amountUnformatted.isZero())

    return data
  }, [reserves, isFetched])

  const tableInstance = useTable({
    columns,
    data
  })

  if (!isFetched) {
    return (
      <div>
        <LoadingRows className='mt-6' />
      </div>
    )
  }
  return <BasicTable tableInstance={tableInstance} noHeader />
}

const Symbol = (props) => {
  const { chainId, token } = props
  const { symbol, address } = token
  return (
    <span className='flex mb-3'>
      <TokenIcon chainId={chainId} address={address} className='mr-2 sm:mr-4 my-auto' />
      <span className='font-bold'>{symbol}</span>
    </span>
  )
}

const TokenAmount = (props) => {
  const { token } = props
  const { symbol, amount } = token
  return (
    <span className='flex mb-3'>
      <Amount>{numberWithCommas(amount, { precision: getMinPrecision(amount) })}</Amount>
      <span className='ml-1 opacity-40'>{symbol}</span>
    </span>
  )
}

const UsdAmount = (props) => {
  const { token } = props
  const { totalValueUsd } = token
  return (
    <span className='flex mb-3'>
      $<Amount>{numberWithCommas(totalValueUsd, { precision: 2 })}</Amount>
    </span>
  )
}

const Links = (props) => {
  const { prizePool, symbol, chainId, token } = props
  const { address } = prizePool
  const { symbol: ticker } = token

  const path = symbol || getPrizePoolSymbol(ticker, address)
  return (
    <span className='flex mb-3 justify-end'>
      <ExternalLink
        href={`https://app.pooltogether.com/pools/${getNetworkNameAliasByChainId(
          Number(chainId)
        )}/${path}`}
        className='mr-2'
      >
        Pool
      </ExternalLink>
    </span>
  )
}
