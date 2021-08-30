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

import { NetworkBadge } from 'lib/components/NetworkBadge'
import { LoadingRows } from 'lib/components/LoadingRows'
import { useTokenFaucets } from 'lib/hooks/useTokenFaucets'

export const TokenFaucetsCard = (props) => {
  const { className } = props
  const governanceChainId = useGovernanceChainId()
  const isMainnet = governanceChainId === NETWORK.mainnet

  return (
    <Card className={className}>
      <h6 className='font-inter text-accent-2 text-xs uppercase mt-2 mb-8'>Token Faucets</h6>

      <TokensList chainId={governanceChainId} />

      {isMainnet && (
        <>
          <div className='mt-10'>
            <TokensList chainId={NETWORK.matic} />
          </div>
          <div className='mt-10'>
            <TokensList chainId={NETWORK.celo} />
          </div>
        </>
      )}
    </Card>
  )
}

const TokensList = (props) => {
  const { chainId } = props

  const { data: tokenFaucets, isFetched } = useTokenFaucets(chainId)
  const tokenFaucetsFlattened = tokenFaucets?.[chainId]

  const screenSize = useScreenSize()

  const columns = useMemo(() => {
    const rows = {
      dripToken: {
        Header: 'Drip',
        accessor: 'dripToken',
        className: '',
        Cell: (row) => <DripToken {...row.row.original} row={row} />
      },
      measureToken: {
        Header: 'Deposit',
        accessor: 'measureToken',
        className: '',
        Cell: (row) => <MeasureToken {...row.row.original} row={row} />
      },
      dripRate: {
        Header: 'Rate/day',
        accessor: 'dripRatePerDay',
        className: '',
        Cell: (row) => <DripRate {...row.row.original} row={row} />
      },
      totalUnclaimed: {
        Header: 'Unclaimed',
        accessor: 'totalUnclaimed',
        className: '',
        Cell: (row) => <TotalUnclaimed {...row.row.original} row={row} />
      },
      remainingDays: {
        Header: 'Days left',
        accessor: 'remainingDays',
        className: 'w-20',
        Cell: (row) => <RemainingDays {...row.row.original} row={row} />
      },
      explorerLink: {
        Header: '',
        accessor: 'explorerLink',
        className: 'w-8',
        Cell: (row) => <ExplorerLink {...row.row.original} row={row} />
      }
    }

    if (screenSize < ScreenSize.sm) {
      return [
        rows.measureToken,
        rows.dripToken,
        rows.dripRate,
        rows.remainingDays,
        rows.explorerLink
      ]
    }

    return [
      rows.measureToken,
      rows.dripToken,
      rows.dripRate,
      rows.totalUnclaimed,
      rows.remainingDays,
      rows.explorerLink
    ]
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

  return (
    <>
      <NetworkBadge
        textClassName='text-xs sm:text-sm'
        sizeClassName='w-4 sm:w-5 h-4 sm:h-5'
        className='mb-4 sm:mb-6'
        chainId={chainId}
      />
      <BasicTable
        headerClassName='text-xxxs'
        rowClassName='text-xs'
        tableInstance={tableInstance}
      />
    </>
  )
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

const MeasureToken = (props) => {
  const { chainId, measureToken } = props
  const { address, symbol } = measureToken

  return (
    <span className='flex my-2'>
      <TokenIcon chainId={chainId} address={address} className='mr-2 sm:mr-4 my-auto' />
      <span className='font-bold'>{symbol}</span>
    </span>
  )
}

const TotalUnclaimed = (props) => {
  const { dripToken, totalUnclaimed } = props
  const { symbol } = dripToken

  return (
    <span className='flex my-2'>
      <Amount>{numberWithCommas(totalUnclaimed)}</Amount>
      <span className='ml-1 opacity-40'>{symbol}</span>
    </span>
  )
}

const DripRate = (props) => {
  const { dripRatePerDay } = props

  return (
    <span className='flex my-2'>
      <Amount>{numberWithCommas(Math.round(dripRatePerDay))}</Amount>
    </span>
  )
}

const RemainingDays = (props) => {
  const { remainingDays } = props

  return (
    <span className='flex my-2'>
      <Amount>{numberWithCommas(remainingDays)}</Amount>
    </span>
  )
}

const ExplorerLink = (props) => {
  const { chainId, address } = props

  return (
    <BlockExplorerLink
      shorten
      noText
      className='m-auto'
      chainId={chainId}
      address={address}
      iconClassName='w-5 h-5'
    />
  )
}
