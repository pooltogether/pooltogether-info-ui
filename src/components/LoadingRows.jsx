import classNames from 'classnames'
import React from 'react'

export const LoadingRows = (props) => {
  const { className } = props

  return <div className={classNames('bg-secondary animate-pulse', className)} />
}
