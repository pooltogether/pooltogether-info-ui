import { LoadingRows } from '@components/LoadingRows'
import { DISCORD_INVITE_URL, POOLTOGETHER_GOV_FORUM_URL } from '@constants/legacy'
import { useTokenFaucets } from '@hooks/useTokenFaucets'
import {
  BasicTable,
  Card,
  ExternalLink,
  LinkTheme,
  TokenIcon,
  useScreenSize,
  ScreenSize,
  NetworkIcon
} from '@pooltogether/react-components'
import { formatNumberForDisplay } from '@pooltogether/utilities'
import { BlockExplorerLink, CHAIN_ID } from '@pooltogether/wallet-connection'
import React, { useMemo } from 'react'
import { useTable } from 'react-table'

export const TokenFaucetsCard = (props) => {
  const { className } = props

  return (
    <Card className={className}>
      <h6 className='font-averta text-accent-2 text-xs uppercase mt-2 mb-4'>Token Faucets</h6>

      <p className='text-xs mb-8 text-accent-1 leading-normal w-3/4'>
        These are the PoolTogether Rewards faucets. Many will be extended before they expire by POOL
        governance. Check out our{' '}
        <ExternalLink
          className='text-xs'
          theme={LinkTheme.light}
          underline
          href={POOLTOGETHER_GOV_FORUM_URL}
        >
          Gov Forum
        </ExternalLink>{' '}
        or{' '}
        <ExternalLink
          className='text-xs'
          theme={LinkTheme.light}
          underline
          href={DISCORD_INVITE_URL}
        >
          Discord
        </ExternalLink>{' '}
        for the latest info.
      </p>

      <TokensList chainId={CHAIN_ID.mainnet} />
      <div className='mt-10'>
        <TokensList chainId={CHAIN_ID.polygon} />
      </div>
      <div className='mt-10'>
        <TokensList chainId={CHAIN_ID.celo} />
      </div>
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

    if (isFetched && tokenFaucetsFlattened) {
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
      <NetworkIcon className='mb-4 sm:mb-6' chainId={chainId} />
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
    <span id={address} className='flex my-2'>
      <TokenIcon chainId={chainId} address={address} className='mr-2 sm:mr-4 my-auto' />
      <span className='font-bold'>{symbol}</span>
    </span>
  )
}

const MeasureToken = (props) => {
  const { chainId, measureToken } = props
  const { address, symbol } = measureToken

  return (
    <span id={address} className='flex my-2'>
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
      <span>{formatNumberForDisplay(totalUnclaimed)}</span>
      <span className='ml-1 opacity-60'>{symbol}</span>
    </span>
  )
}

const DripRate = (props) => {
  const { dripRatePerDay } = props

  return (
    <span className='flex my-2'>
      <span>{formatNumberForDisplay(Math.round(dripRatePerDay))}</span>
    </span>
  )
}

const RemainingDays = (props) => {
  const { remainingDays } = props

  return (
    <span className='flex my-2'>
      <span>{formatNumberForDisplay(remainingDays)}</span>
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
