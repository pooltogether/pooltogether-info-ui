import { SimpleLayout } from '@pooltogether/react-components'

import { Footer } from 'lib/components/Layout/Footer'
import { PageHeader } from 'lib/components/Layout/PageHeader'
import React from 'react'

export const Layout = (props) => (
  <SimpleLayout
    banner={null}
    header={<PageHeader />}
    content={<div className=''>{props.children}</div>}
    footer={<Footer />}
  />
)
