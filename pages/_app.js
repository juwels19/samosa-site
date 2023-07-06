import "@styles/globals.css";
import { ChakraProvider, DarkMode, extendTheme } from "@chakra-ui/react";
import {
  ClerkProvider,
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from "@clerk/nextjs";
import { useRouter } from "next/router";
import "@fontsource/nunito";
import Head from "next/head";
import Layout from "@components/Layout";
import { NextUIProvider } from "@nextui-org/react";
import theme from "@styles/theme";

const publicPages = ["/", "/signup", "/signin"];

export default function App({ Component, pageProps }) {
  const { pathname } = useRouter();

  const isPublicPage = publicPages.includes(pathname);

  return (
    <ClerkProvider>
      <ChakraProvider theme={theme}>
        <NextUIProvider>
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
        </NextUIProvider>
      </ChakraProvider>
    </ClerkProvider>
  );
}
