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
import { ScreenSize, useCoingeckoTokenPrices, useScreenSize } from '@pooltogether/hooks'
import { numberWithCommas } from '@pooltogether/utilities'

import { CONTRACT_ADDRESSES } from 'lib/constants'
import { LoadingRows } from 'lib/components/LoadingRows'
import {
  useGovernanceTokenBalancesTotal,
  useGovernanceTokenBalancesFlattened
} from 'lib/hooks/useGovernanceTokenBalances'
import { useAaveRewardsBalances } from 'lib/hooks/useAaveRewardsBalances'
import { useVestingPoolBalance } from 'lib/hooks/useVestingPoolBalance'
import { useOlympusProBondBalance } from 'lib/hooks/useOlympusProBondBalance'
import { useTimelockAaveDaiBalance } from 'lib/hooks/useTimelockAaveDaiBalance'
import { useTimelockTreasuryPTaUSDCBalance } from 'lib/hooks/useTimelockTreasuryPTaUSDCBalance'

const aDAI_ADDRESS = '0x028171bca77440897b824ca71d1c56cac55b68a3'
const PTaUSDC_ETHEREUM_ADDRESS = '0xdd4d117723c257cee402285d3acf218e9a8236e1'

export const TokenBalancesCard = (props) => {
  const { className } = props

  const { data, isFetched } = useGovernanceTokenBalancesTotal()

  return (
    <Card className={className}>
      <h6 className='font-averta text-accent-2 text-xs uppercase mt-2 mb-4'>Token Holdings</h6>
      <h4 className='mb-4 sm:mb-8'>
        $
        {isFetched ? (
          <Amount>{numberWithCommas(data.totalValueUsd, { precision: 2 })}</Amount>
        ) : (
          '--'
        )}
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

  const {
    data: vestingPoolBalance,
    isFetched: isVestingPoolBalanceFetched
  } = useVestingPoolBalance()

  const { data: bondBalance, isFetched: isBondBalanceFetched } = useOlympusProBondBalance()

  const {
    data: ptausdcTimelockTreasuryBalance,
    isFetched: isPTaUSDCTimelockTreasuryBalanceFetched
  } = useTimelockTreasuryPTaUSDCBalance()

  const {
    data: aaveDaiTimelockBalance,
    isFetched: isAaveDaiTimelockBalanceFetched
  } = useTimelockAaveDaiBalance()

  const {
    data: aaveRewardsBalance,
    isFetched: isAaveRewardsBalanceFetched
  } = useAaveRewardsBalances()

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

    if (isVestingPoolBalanceFetched) {
      data.push(vestingPoolBalance)
    }

    if (isBondBalanceFetched) {
      data.push(bondBalance)
    }

    if (isPTaUSDCTimelockTreasuryBalanceFetched) {
      data.push({
        ...ptausdcTimelockTreasuryBalance,
        address: PTaUSDC_ETHEREUM_ADDRESS
      })
    }

    if (isAaveDaiTimelockBalanceFetched) {
      data.push({ ...aaveDaiTimelockBalance, address: aDAI_ADDRESS })
    }

    if (isFetched) {
      data.push(...tokenBalances)
    }

    if (isAaveRewardsBalanceFetched) {
      data = extractAaveRewardsData(data, aaveRewardsBalance)
    }

    data = data.filter((balance) => !balance.amountUnformatted?.isZero())

    return data
  }, [
    vestingPoolBalance,
    isVestingPoolBalanceFetched,
    isBondBalanceFetched,
    bondBalance,
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
  const { isUnclaimedReward, symbol, amount } = props
  return (
    <span className='flex my-2'>
      <Amount>{numberWithCommas(amount)}</Amount>
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
      $<Amount>{numberWithCommas(totalValueUsd, { precision: 2 })}</Amount>
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
