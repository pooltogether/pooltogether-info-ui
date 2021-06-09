import { SimpleLayout } from '@pooltogether/react-components'
import { Footer } from 'lib/components/Layout/Footer'
import { PageHeader } from 'lib/components/Layout/PageHeader'
import React from 'react'

const Layout = (props) => (
  <SimpleLayout
    banner={null}
    header={<PageHeader />}
    content={<div className='mt-6 sm:mt-8 pb-24'>{props.children}</div>}
    footer={<Footer />}
  />
)

export default Layout
