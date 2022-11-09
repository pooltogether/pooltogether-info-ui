import React from 'react'

import { Meta } from 'lib/components/Meta'
import { Layout } from 'lib/components/Layout'
import { TokenFaucetsCard } from 'lib/pages/Treasury/TokenFaucetsCard'

export const Faucets = (props) => {
  return (
    <>
      <Meta title='Faucets - Protocol Analytics' />
      <Layout>
        <TokenFaucetsCard className='leading-none' />
      </Layout>
    </>
  )
}
