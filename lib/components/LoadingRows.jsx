import { ThemeContext } from '@pooltogether/react-components'
import React, { useContext } from 'react'
import ContentLoader from 'react-content-loader'

export const LoadingRows = (props) => {
  if (typeof window === 'undefined') {
    return null
  }

  const { theme } = useContext(ThemeContext)

  const bgColor = theme === 'light' ? '#ffffff' : '#401C94'
  const foreColor = theme === 'light' ? '#f5f5f5' : '#501C94'

  return (
    <ContentLoader
      gradientRatio={2.5}
      interval={0.05}
      speed={0.6}
      viewBox='0 0 100% 100'
      height={110}
      width='100%'
      backgroundColor={bgColor}
      foregroundColor={foreColor}
      className={props.className}
    >
      <rect x='0' y='0' rx='3' ry='3' width='100%' height='20' />
      <rect x='0' y='30' rx='3' ry='3' width='100%' height='20' />
      <rect x='0' y='60' rx='3' ry='3' width='100%' height='20' />
      <rect x='0' y='90' rx='3' ry='3' width='100%' height='20' />
    </ContentLoader>
  )
}
