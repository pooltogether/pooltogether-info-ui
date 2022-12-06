import classNames from 'classnames'
import { MotionStyle } from 'framer-motion'
import { useRouter } from 'next/router'
import React from 'react'
import { FadeInDiv } from './FadeInDiv'

interface PagePaddingProps {
  children?: React.ReactNode
  className?: string
  pxClassName?: string
  pyClassName?: string
  widthClassName?: string
  marginClassName?: string
  style?: MotionStyle
}

export const PagePadding = (props: PagePaddingProps) => {
  const { className, style, children, pxClassName, pyClassName, widthClassName, marginClassName } =
    props
  const router = useRouter()
  return (
    <FadeInDiv
      id={`page-padding-animation-wrapper-${router.pathname}`}
      className={classNames(pxClassName, pyClassName, widthClassName, marginClassName, className)}
      style={style}
    >
      {children}
    </FadeInDiv>
  )
}

PagePadding.defaultProps = {
  pxClassName: 'px-2 sm:px-8',
  pyClassName: 'pb-20 pt-2 xs:pt-4 sm:pt-8',
  widthClassName: 'max-w-screen-md',
  marginClassName: 'mx-auto'
}
