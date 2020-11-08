import React from 'react';
import { AppProps } from 'next/dist/next-server/lib/router/router';
import { ThemeProvider, createMuiTheme, CssBaseline, NoSsr } from '@material-ui/core';
import Head from 'next/head';
import { SnackbarProvider } from 'notistack';
import { Provider as AuthProvider } from 'next-auth/client';
import { lightGreen } from '@material-ui/core/colors';

const theme = createMuiTheme({
	palette: {
		type: "dark",
		primary: lightGreen
	}
});

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ThemeProvider theme={theme}>
			<SnackbarProvider>
				<AuthProvider session={pageProps.session}>
					<CssBaseline />
					<Head>
						<title>SmartTable</title>
						<meta charSet="utf-8" />
					</Head>
					<NoSsr>
						<Component {...pageProps} />
					</NoSsr>
				</AuthProvider>
			</SnackbarProvider>
		</ThemeProvider>
	);
}

export default MyApp
