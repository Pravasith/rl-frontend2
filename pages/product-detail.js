import React from 'react';
import Axios from 'axios';
import { withRouter } from 'next/router';
import Navbar from '../src/components/navbar/navbar';
import { api } from '../src/actions/apiLinks';

import { getBackFetchId } from '../src/factories/alterFetchId';
import { encryptData, decryptData } from '../src/factories/encryptDecrypt';

import ProductDetails from "../src/components/products/product-details/index";

const Content = withRouter((props) => {
    return (
        <div>
            <Navbar/>
            <ProductDetails
                catName={props.router.query.catName}
                subCatName={props.router.query.subCatName}
                prodTypeName={props.router.query.prodTypeName}
                fetchId={props.router.query.fetchId}
                productData={props.productData}
            />
        </div>
    )
})


const ProductDetailsPage = (props) => (
    <section>
        <Content productData={props.productData} />
    </section>
)


ProductDetailsPage.getInitialProps = async function ({ req, query: { fetchId } }) {
    const productId = getBackFetchId(fetchId);
    const categoryId = productId.split("-")[0];

    const dataToBackend_forProductData = { productId }
    const dataToBackend_forCategoriesData = { categoryId }

    const requestData = {
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            "Content-Type": "application/json"
        },

        withCredentials: true
    }

    let productData

    await Promise.all([
        Axios.post(
            api.GET_DETAILED_PRODUCTS_DATA,
            {
                requestData: encryptData(dataToBackend_forProductData),
                message: "All units, requesting for product " + fetchId + ", expected load in T-45"
            },
            requestData
        ),
        Axios.post(
            api.GET_CATEGORISED_PRODUCTS_DATA,
            {
                requestData: encryptData(dataToBackend_forCategoriesData),
                message: "All units, requesting for categories, expected load in T-45.1"
            },
            requestData
        ),

    ])

        .then(res => {
            productData = res.reduce((all, item) => {
                if (item) {
                    all = {
                        ...all,
                        ...decryptData(item.data.responseData)
                    }
                }

                return all
            }, {})

        })
        .catch(e => console.error(e))

    return {
        productData
    }
}

export default ProductDetailsPage;