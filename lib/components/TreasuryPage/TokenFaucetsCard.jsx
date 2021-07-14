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
import { getMinPrecision, numberWithCommas } from '@pooltogether/utilities'
import { ScreenSize, useScreenSize } from '@pooltogether/hooks'

import { CONTRACT_ADDRESSES } from 'lib/constants'
import { LoadingRows } from 'lib/components/LoadingRows'
import {
  // useGovernanceTokenBalancesTotal,
  useTokenFaucets,
  useTokenFaucetsFlattened
} from 'lib/hooks/useTokenFaucets'

export const TokenFaucetsCard = (props) => {
  const { className } = props
  // const chainIds = useChainIds()
  // const prizePoolContracts = usePrizePoolContracts(chainIds)
  // const { data, isFetched } = useTokenFaucets()

  return (
    <Card className={className}>
      <h6 className='font-inter text-accent-2 text-xs uppercase mt-2 mb-4'>Token Faucets</h6>
      {/* <h4 className='mb-4 sm:mb-8'>
        $
        {isFetched ? (
          <Amount>{numberWithCommas(data.totalValueUsd, { precision: 2 })}</Amount>
        ) : (
          '--'
        )}
      </h4> */}
      <TokensList />
    </Card>
  )
}

const TokensList = (props) => {
  const { data: tokenFaucets, isFetched } = useTokenFaucets()
  // const { data: tokenFaucets, isFetched } = useTokenFaucetsFlattened()
  console.log(tokenFaucets)

  return null
  // const { data: vestingPoolBalance, isFetched: isVestingPoolBalanceFetched } =
  //   useVestingPoolBalance()

  // const screenSize = useScreenSize()

  // const columns = useMemo(() => {
  //   const rows = {
  //     symbol: {
  //       accessor: 'symbol',
  //       className: '',
  //       Cell: (row) => <Symbol {...row.row.original} row={row} />
  //     },
  //     amount: {
  //       accessor: 'amount',
  //       className: '',
  //       Cell: (row) => <TokenAmount {...row.row.original} row={row} />
  //     },
  //     usd: {
  //       accessor: 'totalValueUsd',
  //       className: '',
  //       Cell: (row) => <UsdAmount {...row.row.original} row={row} />
  //     }
  //   }

  //   if (screenSize < ScreenSize.sm) {
  //     return [rows.symbol, rows.usd]
  //   }

  //   return [rows.symbol, rows.amount, rows.usd]
  // }, [screenSize])

  // const data = useMemo(() => {
  //   let data = []

  //   if (isFetched) {
  //     data = [...data, ...tokenBalances]
  //   }

  //   data = data.filter((balance) => !balance.amountUnformatted.isZero())

  //   return data
  // }, [tokenBalances, isFetched])

  // const tableInstance = useTable({
  //   columns,
  //   data
  // })

  // if (!isFetched) {
  //   return (
  //     <div>
  //       <LoadingRows className='mt-6' />
  //     </div>
  //   )
  // }

  // return <BasicTable tableInstance={tableInstance} noHeader />
}

const Symbol = (props) => {
  const { symbol, chainId, address } = props
  return (
    <span className='flex my-2'>
      <TokenIcon chainId={chainId} address={address} className='mr-2 sm:mr-4 my-auto' />
      <span className='font-bold'>{symbol}</span>
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
    <span className='flex my-2 justify-end'>
      $<Amount>{numberWithCommas(totalValueUsd, { precision: 2 })}</Amount>
    </span>
  )
}
