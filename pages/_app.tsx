import React from 'react';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import { ThemeProvider, createMuiTheme } from '@material-ui/core';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import { Provider as AuthProvider } from 'next-auth/client';

const theme = createMuiTheme();

function MyApp({ Component, pageProps }: AppProps) {
  return (
     <ThemeProvider theme={theme}>
       <SnackbarProvider>
         <AuthProvider session={pageProps.session}> 
          <Head>
            <title>SmartTable</title>
            <meta charSet="utf-8" />
          </Head>
          <Component {...pageProps} />
         </AuthProvider>
       </SnackbarProvider>
     </ThemeProvider>
  );
}

export default MyApp
