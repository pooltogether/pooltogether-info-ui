import { initRpcUrls } from '@pooltogether/wallet-connection'
import { Provider as JotaiProvider } from 'jotai'
import { ThemeProvider } from 'next-themes'
import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import '@styles/index.css'
import '@pooltogether/react-components/dist/globals.css'
import 'react-spring-bottom-sheet/dist/style.css'
import { RPC_URLS } from '@constants/rpc'

// Initialize react-query Query Client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchInterval: false,
      refetchIntervalInBackground: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false
    }
  }
})

// Initialize RPC providers
initRpcUrls(RPC_URLS)

export default function App({ Component, pageProps }: AppProps) {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <ReactQueryDevtools />
        <ThemeProvider attribute='class' defaultTheme='dark'>
          <Component {...pageProps} />
        </ThemeProvider>
      </QueryClientProvider>
    </JotaiProvider>
  )
}
