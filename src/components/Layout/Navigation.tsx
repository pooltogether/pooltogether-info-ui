import { NavigationContainer, NavigationLink } from '@pooltogether/react-components'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

const navLinks = []

export const Navigation: React.FC<{ className?: string }> = (props) => {
  const { className } = props
  const router = useRouter()

  return (
    <NavigationContainer className={className}>
      {navLinks.map((link) => (
        <NavigationLink
          {...link}
          key={`nav-${link.i18nKey}`}
          t={(a) => a}
          Link={Link}
          pathname={router.pathname}
          selectedClassName='bg-gradient-magenta'
        />
      ))}
    </NavigationContainer>
  )
}
