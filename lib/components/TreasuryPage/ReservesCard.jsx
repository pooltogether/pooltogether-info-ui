import React, { useMemo } from 'react'
import { useTable } from 'react-table'
import { ScreenSize, useScreenSize } from '@pooltogether/hooks'
import {
  Amount,
  BasicTable,
  Card,
  ExternalLink,
  BlockExplorerLink,
  TokenIcon
} from '@pooltogether/react-components'
import {
  getMinPrecision,
  getNetworkNameAliasByChainId,
  getPrizePoolSymbol,
  numberWithCommas
} from '@pooltogether/utilities'

import { LoadingRows } from 'lib/components/LoadingRows'
import {
  usePrizePoolReservesFlattened,
  usePrizePoolReservesTotal
} from 'lib/hooks/usePrizePoolReserves'

export const ReservesCard = (props) => {
  const { className } = props

  const { data, isFetched } = usePrizePoolReservesTotal()

  return (
    <Card className={className}>
      <h6 className='font-inter text-accent-2 text-xs uppercase mt-2 mb-4'>Prize Pool Reserves</h6>
      <h4 className='mb-4 sm:mb-8'>
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
    <span className='flex my-2'>
      <TokenIcon chainId={chainId} address={address} className='mr-2 sm:mr-4 my-auto' />
      <BlockExplorerLink chainId={chainId} address={address}>
        <span className='font-bold'>{symbol}</span>
      </BlockExplorerLink>
    </span>
  )
}

const TokenAmount = (props) => {
  const { token } = props
  const { symbol, amount } = token
  return (
    <span className='flex my-2'>
      <Amount>{numberWithCommas(amount)}</Amount>
      <span className='ml-1 opacity-60'>{symbol}</span>
    </span>
  )
}

const UsdAmount = (props) => {
  const { token } = props
  const { totalValueUsd } = token
  return (
    <span className='flex my-2'>
      $<Amount>{numberWithCommas(totalValueUsd, { precision: 2 })}</Amount>
    </span>
  )
}

const Links = (props) => {
  const { prizePool, symbol, chainId, token } = props
  const { symbol: ticker } = token

  if (!prizePool) {
    return <span className='flex justify-end'></span>
  }

  const { address } = prizePool

  const path = symbol || getPrizePoolSymbol(ticker, address)
  return (
    <span className='flex justify-end'>
      <ExternalLink
        href={`https://app.pooltogether.com/pools/${getNetworkNameAliasByChainId(
          Number(chainId)
        )}/${path}`}
      >
        Pool
      </ExternalLink>
    </span>
  )
}
