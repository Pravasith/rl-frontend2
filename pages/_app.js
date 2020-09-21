import App, { Container } from 'next/app';
import Head from 'next/head';

import React from 'react';
import { Provider } from 'react-redux';

import store from '../src/store';

import { Footer } from '../src/components/footer/footer';

import { initGA, logPageView } from '../utils/analytics';

import ModalContextProvider from '../utils/context/providers/modalContext';

class MyApp extends App {

    componentDidMount = () => {
        if (!window.GA_INITIALIZED) {
            initGA()
            window.GA_INITIALIZED = true
        }
        logPageView()
    }

    render() {
        const { Component, pageProps } = this.props;

        return (
            <Provider store={store}>
                    <Head>
                        <meta charSet="UTF-8" />
                        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                        <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
                        <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
                        <link rel="icon" href="/favicon.ico" type="image/x-icon" />
                    </Head>

                    <Container>
                        <ModalContextProvider>
                            <section>
                                <Component 
                                    {...pageProps}
                                />
                            </section>
                        </ModalContextProvider>
                    </Container>

                    {/* <Footer /> */}
            </Provider>
        )
    }
}

export default MyApp;