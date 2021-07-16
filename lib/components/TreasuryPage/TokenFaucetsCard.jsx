import React, { useMemo } from 'react'
import { useTable } from 'react-table'
import {
  Amount,
  BasicTable,
  BlockExplorerLink,
  Card,
  TokenIcon
} from '@pooltogether/react-components'
import { NETWORK, numberWithCommas } from '@pooltogether/utilities'
import { ScreenSize, useGovernanceChainId, useScreenSize } from '@pooltogether/hooks'

import { LoadingRows } from 'lib/components/LoadingRows'
import { useTokenFaucets, useTokenFaucetsFlattened } from 'lib/hooks/useTokenFaucets'

export const TokenFaucetsCard = (props) => {
  const { className } = props
  const governanceChainId = useGovernanceChainId()
  const isMainnet = governanceChainId === NETWORK.mainnet

  return (
    <Card className={className}>
      <h6 className='font-inter text-accent-2 text-xs uppercase mt-2 mb-4'>Token Faucets</h6>
      <TokensList chainId={governanceChainId} />
      {isMainnet && <TokensList chainId={NETWORK.matic} />}
    </Card>
  )
}

const TokensList = (props) => {
  const { chainId } = props

  const { data: tokenFaucets, isFetched } = useTokenFaucets(chainId)
  // const { data: tokenFaucets, isFetched } = useTokenFaucetsFlattened()
  const tokenFaucetsFlattened = tokenFaucets?.[chainId]

  const screenSize = useScreenSize()

  const columns = useMemo(() => {
    const rows = {
      symbol: {
        accessor: 'symbol',
        className: '',
        Cell: (row) => <DripToken {...row.row.original} row={row} />
      },
      totalUnclaimed: {
        accessor: 'totalUnclaimed',
        className: '',
        Cell: (row) => <TotalUnclaimed {...row.row.original} row={row} />
      }
      // usd: {
      //   accessor: 'totalValueUsd',
      //   className: '',
      //   Cell: (row) => <UsdAmount {...row.row.original} row={row} />
      // }
    }

    if (screenSize < ScreenSize.sm) {
      return [rows.symbol]
    }

    return [rows.symbol, rows.totalUnclaimed]
  }, [screenSize])

  const data = useMemo(() => {
    let data = []

    if (isFetched) {
      data = [...data, ...tokenFaucetsFlattened]
    }

    // data = data.filter((balance) => !balance.amountUnformatted.isZero())

    return data
  }, [tokenFaucetsFlattened, isFetched])

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

const DripToken = (props) => {
  const { chainId, dripToken } = props
  const { address, symbol } = dripToken

  return (
    <span className='flex my-2'>
      <TokenIcon chainId={chainId} address={address} className='mr-2 sm:mr-4 my-auto' />
      <span className='font-bold'>{symbol}</span>
    </span>
  )
}

const TotalUnclaimed = (props) => {
  const { symbol, totalUnclaimed } = props
  return (
    <span className='flex my-2'>
      <Amount>{numberWithCommas(totalUnclaimed)}</Amount>
      <span className='ml-1 opacity-40'>{symbol}</span>
    </span>
  )
}

const UsdAmount = (props) => {
  const { totalValueUsd } = props
  return (
    <span className='flex my-2 justify-end'>
      $<Amount>{numberWithCommas(totalValueUsd, { precision: 2 })}</Amount>
    </span>
  )
}
