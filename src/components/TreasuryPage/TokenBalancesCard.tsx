import { LoadingRows } from '@components/LoadingRows'
import { CONTRACT_ADDRESSES } from '@constants/legacy'
import { useDelegationBalances } from '@hooks/useDelegationBalances'
import {
  useGovernanceTokenBalancesTotal,
  useGovernanceTokenBalancesFlattened
} from '@hooks/useGovernanceTokenBalances'
import { useVestingPoolBalance } from '@hooks/useVestingPoolBalance'
import { useCoingeckoTokenPrices } from '@pooltogether/hooks'
import {
  BasicTable,
  Card,
  TokenIcon,
  useScreenSize,
  ScreenSize
} from '@pooltogether/react-components'
import { formatCurrencyNumberForDisplay, formatNumberForDisplay } from '@pooltogether/utilities'
import { BlockExplorerLink } from '@pooltogether/wallet-connection'
import FeatherIcon from 'feather-icons-react'
import React, { useMemo } from 'react'
import { useTable } from 'react-table'

export const TokenBalancesCard = (props) => {
  const { className } = props

  const { data, isFetched } = useGovernanceTokenBalancesTotal()

  return (
    <Card className={className}>
      <h6 className='font-averta text-accent-2 text-xs uppercase mt-2 mb-4'>Token Holdings</h6>
      <h4 className='mb-4 sm:mb-8'>
        {isFetched && <span>{formatCurrencyNumberForDisplay(data.totalValueUsd)}</span>}
      </h4>
      <TokensList />

      <h6 className='font-averta   uppercase mt-2'>
        <BlockExplorerLink
          chainId={1}
          address={CONTRACT_ADDRESSES[1].GovernanceTimelock}
          className='opacity-90 hover:opacity-100 text-xs mt-4 text-highlight-1'
        >
          Governance Timelock
        </BlockExplorerLink>
      </h6>
    </Card>
  )
}

const TokensList = () => {
  const { data: tokenBalances, isFetched } = useGovernanceTokenBalancesFlattened()

  const { data: vestingPoolBalance, isFetched: isVestingPoolBalanceFetched } =
    useVestingPoolBalance()

  const { data: delegationBalances, isFetched: isDelegationBalancesFetched } =
    useDelegationBalances()

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
        Cell: (row) =>
          row.row.original.totalValueUsd ? (
            <UsdAmount {...row.row.original} row={row} />
          ) : (
            <UsdAmountFromCoingekco {...row.row.original} row={row} />
          )
      }
    }

    if (screenSize < ScreenSize.sm) {
      return [rows.symbol, rows.usd]
    }

    return [rows.symbol, rows.amount, rows.usd]
  }, [screenSize])

  const data = useMemo(() => {
    let data = []

    if (isFetched) {
      tokenBalances.forEach((tokenBalance) => {
        if (!tokenBalance.amountUnformatted?.isZero()) {
          const foundIndex = data.findIndex(
            (entry) =>
              entry.address.toLowerCase() === tokenBalance.address.toLowerCase() &&
              entry.chainId === tokenBalance.chainId
          )
          if (foundIndex >= 0) {
            data[foundIndex].amount = (
              Number(data[foundIndex].amount) + Number(tokenBalance.amount)
            ).toString()
            if (
              data[foundIndex].totalValueUsd !== undefined &&
              tokenBalance.totalValueUsd !== undefined
            ) {
              data[foundIndex].totalValueUsd = (
                Number(data[foundIndex].totalValueUsd) + Number(tokenBalance.totalValueUsd)
              ).toString()
            }
          } else {
            data.push(tokenBalance)
          }
        }
      })
    }

    if (isVestingPoolBalanceFetched) {
      data.push(vestingPoolBalance)
    }

    if (isDelegationBalancesFetched) {
      data.push(delegationBalances)
    }

    // don't show dusty tokens
    data = data.filter(
      (balance) => balance.totalValueUsd === undefined || balance.totalValueUsd > 5
    )
    data = data.sort((a, b) => Number(b.totalValueUsd) - Number(a.totalValueUsd))

    return data
  }, [
    vestingPoolBalance,
    isVestingPoolBalanceFetched,
    delegationBalances,
    isDelegationBalancesFetched,
    tokenBalances,
    isFetched
  ])

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

const Symbol = (props: {
  symbol: string
  chainId: number
  address: string
  isVesting?: boolean
  isDelegating?: boolean
}) => {
  const { symbol, chainId, address, isVesting, isDelegating } = props

  return (
    <span className='flex my-2'>
      {isDelegating ? (
        <TokenIcon
          chainId={1}
          address={'0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48'}
          className='mr-2 sm:mr-4 my-auto'
        />
      ) : (
        <TokenIcon
          chainId={chainId}
          address={
            address === '0xd5f60154bef3564ebfbe9bb236595f0da548a742'
              ? '0xae7ab96520de3a18e5e111b5eaab095312d7fe84'
              : address
          }
          className='mr-2 sm:mr-4 my-auto'
        />
      )}
      {isVesting ? (
        <>
          <BlockExplorerLink chainId={chainId} address={CONTRACT_ADDRESSES[chainId].TreasuryVester}>
            <FeatherIcon icon='lock' className='h-4 w-4 my-auto mr-1' />
            <span className='mr-1 font-bold'>Vesting</span>
            <span className='font-bold'>{symbol}</span>
          </BlockExplorerLink>
        </>
      ) : isDelegating ? (
        <span className='mr-1 font-bold'>Delegating</span>
      ) : (
        <BlockExplorerLink chainId={chainId} address={address}>
          <span className='font-bold'>{symbol}</span>
        </BlockExplorerLink>
      )}
    </span>
  )
}

const TokenAmount = (props) => {
  const { isUnclaimedReward, symbol, amount } = props
  return (
    <span className='flex my-2'>
      <span>{formatNumberForDisplay(amount)}</span>
      <span className='ml-1 opacity-60'>{symbol}</span>
      <span className='ml-1 opacity-30'>{isUnclaimedReward && '(unclaimed)'}</span>
    </span>
  )
}

const UsdAmountFromCoingekco = (props) => {
  const { address, chainId, amount } = props

  const { data: usdData } = useCoingeckoTokenPrices(chainId, [address])

  const usd = usdData?.[address]?.usd
  const totalValueUsd = Number(amount) * usd

  return <UsdAmount totalValueUsd={totalValueUsd} />
}

const UsdAmount = (props) => {
  const { totalValueUsd } = props
  return (
    <span className='flex justify-end'>
      <span>{isNaN(totalValueUsd) ? '-' : formatCurrencyNumberForDisplay(totalValueUsd)}</span>
    </span>
  )
}

const extractAaveRewardsData = (data, aaveRewardsBalance) => {
  if (!aaveRewardsBalance) {
    return data
  }

  const chainIds = Object.keys(aaveRewardsBalance)

  chainIds.forEach((chainId) => {
    const balances = aaveRewardsBalance[chainId]
    balances.forEach((balance) => {
      data.push({
        chainId,
        isUnclaimedReward: true,
        ...balance
      })
    })
  })

  return data
}
