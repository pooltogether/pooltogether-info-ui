import React from 'react'
import classnames from 'classnames'

import EthLogo from '@pooltogether/evm-chains-extended/dist/umd/images/ethereum-icon.png'
import BscLogo from '@pooltogether/evm-chains-extended/dist/umd/images/bsc-icon-1.png'
import PoALogo from '@pooltogether/evm-chains-extended/dist/umd/images/poa-icon.png'
import XDaiLogo from '@pooltogether/evm-chains-extended/dist/umd/images/xdai-icon.png'
import PolygonLogo from '@pooltogether/evm-chains-extended/dist/umd/images/polygon-icon.png'

import { ETHEREUM_NETWORKS } from 'lib/constants'

export const NetworkIcon = (props) => {
  const { sizeClassName, className, chainId } = props

  const noMargin = props.noMargin || false

  let src
  if (ETHEREUM_NETWORKS.includes(chainId)) {
    src = EthLogo
  } else if (chainId === 97 || chainId === 56) {
    src = BscLogo
  } else if (chainId === 77 || chainId === 99) {
    src = PoALogo
  } else if (chainId === 100) {
    src = XDaiLogo
  } else if (chainId === 137 || chainId === 80001) {
    src = PolygonLogo
  }

  // Fallback to placeholder
  if (!src) {
    src = '/network-placeholder.png'
  }

  const classes = classnames(sizeClassName, {
    [className]: className,
    'inline-block': !className,
    'mr-1': !noMargin
  })

  return <img src={src} className={classes} />
}

NetworkIcon.defaultProps = {
  sizeClassName: 'w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10'
}
