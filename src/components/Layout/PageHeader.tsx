import { HeaderLogo, PageHeaderContainer, SettingsModal } from '@pooltogether/react-components'
import classNames from 'classnames'
import FeatherIcon from 'feather-icons-react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { useState } from 'react'

export const NEGATIVE_HEADER_MARGIN = '-mt-12 sm:-mt-16'

export const PageHeader = (props) => (
  <PageHeaderContainer
    maxWidthClassName='max-w-screen-md'
    logo={
      <Link href='/deposit'>
        <a>
          <HeaderLogo />
        </a>
      </Link>
    }
  >
    <div className='flex flex-row justify-end items-center space-x-4'>
      {/* TODO: Need to update the settings modal to support no i18n */}
      {/* <Settings /> */}
    </div>
  </PageHeaderContainer>
)

const Settings = () => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button onClick={() => setIsOpen(true)}>
        <FeatherIcon
          icon='menu'
          className={classNames('w-6 h-6 text-gradient-magenta hover:text-inverse transition')}
        />
      </button>
      <SettingsModal
        isOpen={isOpen}
        walletChainId={null}
        closeModal={() => setIsOpen(false)}
        networkView={null}
        t={undefined}
        langs={undefined}
        currentLang={undefined}
        changeLang={undefined}
      />
    </>
  )
}
