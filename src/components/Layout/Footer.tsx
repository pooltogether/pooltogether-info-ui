import { ExternalLink, LinkTheme } from '@pooltogether/react-components'
import Link from 'next/link'

export const Footer = () => {
  return (
    <div className='flex space-x-6 justify-center text-xxs opacity-75 pb-4 xs:w-2/3 mx-auto'>
      <ExternalLink theme={LinkTheme.default} href={'https://vote.pooltogether.com'} noIcon>
        Vote
      </ExternalLink>
      <ExternalLink theme={LinkTheme.default} href={'https://tools.pooltogether.com'} noIcon>
        Tools
      </ExternalLink>
      <ExternalLink theme={LinkTheme.default} href={'https://pooltogether.com/discord'} noIcon>
        Discord
      </ExternalLink>
      <Link href={'/faucets'}>
        <a className='text-pt-white  transition hover:text-pt-teal'>Token Faucets</a>
      </Link>
    </div>
  )
}
