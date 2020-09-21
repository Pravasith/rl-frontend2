import HomePage from '../src/components/common/homePage/homePage';
import Navbar from '../src/components/navbar/navbar';
import Head from 'next/head';
import "../src/assets/css/home_page.css";

export default () => (
    <div>
        <Head>
            <title>Hello</title>
            <meta charSet="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
            <link rel="shortcut icon" href="/favicon.ico" type="image/x-icon" />
            <link rel="icon" href="/favicon.ico" type="image/x-icon" />
        </Head>
        <Navbar />
        <HomePage />
    </div>
)