import { withRouter } from 'next/router';
import fetch from 'isomorphic-unfetch';

import Navbar from '../src/components/navbar/navbar';

import Checkout from "../src/components/checkout/checkoutDetails";
import CartDataContextProvider from '../utils/context/providers/cartDataContext';
import { decryptData } from '../src/factories/encryptDecrypt';

const Content = withRouter((props) => (
    <div>
        <Navbar 
            hideCart
        />
        <Checkout />
    </div>
));

const CheckoutDetailsPage = () => (
    <CartDataContextProvider>
        <section>
            <Content />
        </section>
    </CartDataContextProvider>
)

// CheckoutDetailsPage.getInitialProps = async({ req, ctx }) => {
//     const res = await fetch(`http://localhost:5000/api/user/check-for-auth`)
//     const json = await res.json();

//     console.log(decryptData(json.responseData));
//     return { };
// }

export default CheckoutDetailsPage;