/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/react-in-jsx-scope */
import 'bootstrap/dist/css/bootstrap.min.css';
import Head from 'next/head';
import { ThemeProvider } from 'styled-components';
import Header from '../src/components/Header';
import { GlobalStyle, theme } from '../public/static/css/globalStyles';

// eslint-disable-next-line react/prop-types
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Head>
        <title>Clínica</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Lato:ital,wght@0,300;1,300&family=Lobster+Two:ital@1&display=swap" rel="stylesheet" />
      </Head>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Header />
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  );
}
