import '@styles/globals.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import { ClerkProvider, RedirectToSignIn, SignedIn, SignedOut } from '@clerk/nextjs'
import { useRouter } from 'next/router'
import "@fontsource/nunito"
import Head from 'next/head'
import SamosaNavbar from '@components/Navbar'
import Layout from '@components/Layout'
import { NextUIProvider } from '@nextui-org/react'

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
      <NextUIProvider>
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
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                    </SignedIn>
                    <SignedOut>
                      <RedirectToSignIn />
                    </SignedOut>
                </>
              )}
        </ChakraProvider>
      </NextUIProvider>
    </ClerkProvider>
  )
}
