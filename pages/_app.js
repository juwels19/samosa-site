import '@/styles/globals.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import "@fontsource/nunito"
import Head from 'next/head'
import Navbar from '@/src/components/Navbar'

const publicPages = ["/", "/signup", "/signin"]

const theme = extendTheme({
  fonts: {
    heading: `"Nunito", sans-serif`,
    body: `"Nunito", sans-serif`,
  }
})

export default function App({ Component, pageProps }) {

  const { pathname } = useRouter();

  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider>
      <ChakraProvider theme={theme}>
        <Head>
          <title>Samosa Stats</title>
          <meta name="description" content="Degenerate FRC Fantasy" />
          <link rel="icon" href="/favicon.ico" />
        </Head>
          {isPublicPage ? (
              <Component {...pageProps} />
            ) : (
              <>
                <SignedIn>
                  <Navbar />
                  <Component {...pageProps} />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            )}
        
      </ChakraProvider>
    </ClerkProvider>
  )
}
