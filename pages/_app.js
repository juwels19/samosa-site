import '@/styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import Head from 'next/head'

const publicPages = ["/", "/signup", "/signin"]

export default function App({ Component, pageProps }) {

  const { pathname } = useRouter();

  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider>
      <ChakraProvider>
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
