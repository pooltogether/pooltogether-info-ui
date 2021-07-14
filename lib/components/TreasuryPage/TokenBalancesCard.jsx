import React, { useMemo } from 'react'
import { useTable } from 'react-table'
import FeatherIcon from 'feather-icons-react'
import {
  Amount,
  BasicTable,
  BlockExplorerLink,
  Card,
  TokenIcon
} from '@pooltogether/react-components'
import { ScreenSize, useScreenSize } from '@pooltogether/hooks'
import { getMinPrecision, numberWithCommas } from '@pooltogether/utilities'

import { CONTRACT_ADDRESSES } from 'lib/constants'
import { LoadingRows } from 'lib/components/LoadingRows'
import {
  useGovernanceTokenBalancesTotal,
  useGovernanceTokenBalancesFlattened
} from 'lib/hooks/useGovernanceTokenBalances'
import { useVestingPoolBalance } from 'lib/hooks/useVestingPoolBalance'

export const TokenBalancesCard = (props) => {
  const { className } = props

  const { data, isFetched } = useGovernanceTokenBalancesTotal()

  return (
    <Card className={className}>
      <h6 className='font-inter text-accent-2 text-xs uppercase mt-2 mb-4'>Token Holdings</h6>
      <h4 className='mb-4 sm:mb-8'>
        $
        {isFetched ? (
          <Amount>{numberWithCommas(data.totalValueUsd, { precision: 2 })}</Amount>
        ) : (
          '--'
        )}
      </h4>
      <TokensList />

      <h6 className='font-inter text-accent-2 uppercase mt-2'>
        <BlockExplorerLink
          chainId={1}
          address={CONTRACT_ADDRESSES[1].GovernanceTimelock}
          className='opacity-60 hover:opacity-100 text-xs mt-4'
        >
          Governance Timelock
        </BlockExplorerLink>
      </h6>
    </Card>
  )
}

const TokensList = () => {
  const { data: tokenBalances, isFetched } = useGovernanceTokenBalancesFlattened()
  // console.log(tokenBalances)

  const { data: vestingPoolBalance, isFetched: isVestingPoolBalanceFetched } =
    useVestingPoolBalance()

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
      }
    }

    if (screenSize < ScreenSize.sm) {
      return [rows.symbol, rows.usd]
    }

    return [rows.symbol, rows.amount, rows.usd]
  }, [screenSize])

  const data = useMemo(() => {
    let data = []

    if (isVestingPoolBalanceFetched) {
      data = [vestingPoolBalance]
    }

    if (isFetched) {
      data = [...data, ...tokenBalances]
    }

    data = data.filter((balance) => !balance.amountUnformatted.isZero())

    return data
  }, [vestingPoolBalance, isVestingPoolBalanceFetched, tokenBalances, isFetched])

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
  const { symbol, chainId, address, isVesting } = props
  return (
    <span className='flex my-2'>
      <TokenIcon chainId={chainId} address={address} className='mr-2 sm:mr-4 my-auto' />
      {isVesting ? (
        <>
          <BlockExplorerLink chainId={chainId} address={CONTRACT_ADDRESSES[chainId].TreasuryVester}>
            <FeatherIcon icon='lock' className='h-4 w-4 my-auto mr-1' />
            <span className='mr-1 font-bold'>Vesting</span>
            <span className='font-bold'>{symbol}</span>
          </BlockExplorerLink>
        </>
      ) : (
        <BlockExplorerLink chainId={chainId} address={address}>
          <span className='font-bold'>{symbol}</span>
        </BlockExplorerLink>
      )}
    </span>
  )
}

const TokenAmount = (props) => {
  const { symbol, amount } = props
  return (
    <span className='flex my-2'>
      <Amount>{numberWithCommas(amount, { precision: getMinPrecision(amount) })}</Amount>
      <span className='ml-1 opacity-40'>{symbol}</span>
    </span>
  )
}

const UsdAmount = (props) => {
  const { totalValueUsd } = props
  return (
    <span className='flex justify-end'>
      $<Amount>{numberWithCommas(totalValueUsd, { precision: 2 })}</Amount>
    </span>
  )
}
