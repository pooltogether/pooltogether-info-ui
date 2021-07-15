import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import classnames from 'classnames'

const navLinkClassName =
  'mx-3 px-2 flex items-center justify-center uppercase font-bold tracking-wider outline-none focus:outline-none active:outline-none hover:bg-default rounded-full border-2 px-10 py-1 trans trans-fast text-xs'
const inactiveNavLinkClassName = 'border-highlight-2 opacity-80 hover:opacity-100 text-highlight-2'
const activeNavLinkClassName = 'border-inverse opacity-100'

export const Nav = (props) => {
  const router = useRouter()

  const { pathname } = router
  const isFaucetsPage = pathname.match('/faucets')
  const isTreasuryPage = !isFaucetsPage

  return (
    <div className='flex justify-center mb-6'>
      <Link href='/'>
        <a
          className={classnames(navLinkClassName, {
            [inactiveNavLinkClassName]: !isTreasuryPage,
            [activeNavLinkClassName]: isTreasuryPage
          })}
        >
          Treasury
        </a>
      </Link>
      <Link href='/faucets'>
        <a
          className={classnames(navLinkClassName, {
            [inactiveNavLinkClassName]: !isFaucetsPage,
            [activeNavLinkClassName]: isFaucetsPage
          })}
        >
          Faucets
        </a>
      </Link>
    </div>
  )
}
