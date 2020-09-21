import React from 'react';
import Axios from 'axios';
import { withRouter } from 'next/router';
import Navbar from '../src/components/navbar/navbar';
import { api } from '../src/actions/apiLinks';

import { decryptData, encryptData } from '../src/factories/encryptDecrypt';

import VendorSharedLink from "../src/components/public-url/vendorSharedLink";

import "../src/assets/css/vendor_shared_link.css";

const Content = withRouter((props) => {
    return (
        <div>
            <Navbar/>
            <VendorSharedLink
                vName={props.router.query.vName}
                vId={props.router.query.vId}
                vendorProductsData={props.vendorProductsData}
            />
        </div>
    )
});

const VendorSharedLinkURL = (props) => (
    <section>
        <Content vendorProductsData={props.vendorProductsData} />
    </section>
)


VendorSharedLinkURL.getInitialProps = async function ({ req, query: { vId } }) {
    const rawData = { rLId: "VEN" + "-" + vId.split("").reverse().join("")  };

    let vendorProductsData;

    await Axios.post(
        api.GET_PUBLIC_VENDOR_DATA,
        {
            requestData: encryptData(rawData),
            message: "Requesting vendor products"
        }
    )
        .then(res => {
            vendorProductsData = decryptData(res.data.responseData);

            // console.log(vendorProductsData)
        })

        .catch(e => console.error(e))

    return { vendorProductsData };
}

export default VendorSharedLinkURL;