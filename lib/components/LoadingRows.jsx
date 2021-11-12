import { ThemeContext } from '@pooltogether/react-components'
import classNames from 'classnames'
import React, { useContext } from 'react'

export const LoadingRows = (props) => {
  const { className } = props

  return <div className={classNames('bg-secondary animate-pulse', className)} />
}
