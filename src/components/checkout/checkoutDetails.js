import React, { useContext, useEffect, useRef, useState } from 'react';
import Axios from 'axios';
import { Image } from "cloudinary-react";

import { ModalContext } from '../../../utils/context/context';

import { MapAutocompleteSearch } from './maps/autoCompleteSearch';

import { api } from "../../actions/apiLinks";

import PublicId from "../../factories/cloudinaryFactory";
import { alterFetchId } from '../../factories/alterFetchId';
import { formatPricesToLocale, arrayUnique } from '../../factories/formatter';
import { setCookieData, getProductHierarchy } from '../../factories/setCookieData';
import { decryptData, encryptData } from '../../factories/encryptDecrypt';

import HooksLoginOrSignupModal from '../common/loginOrSignUp/modals/hooksLoginOrSignupModal';

import LogoAnimation from "../animations/logoAnimation";
import { SimpleShadeTransitionLoader, ModalTransitionLoader } from "../common/loaders/modalTransitionLoader";


import { BigCartTruck, DeleteCloseButton, NewTruck } from '../../assets/images/index';
import "../../assets/css/checkout_details.css";
import { CartDataContext } from '../../../utils/context/context';
import sumProperty from '../../factories/sumProperty';
import { WhiteButton } from '../UX/uxComponents';

function Checkout() {

    const [ locationDetails , setLocationDetails ] = useState('selcetion-container-outer-layer'); 
    const [ cartData, setCartData ] = useState([]);

    const [ checkoutLocation, setCheckoutLocation] = useState("checkout-location-inner-layer");
    const [ loginGraphic, setLoginGraphic] = useState("login-button-page hide")

    const [ loadingClass , setloadingClass ] = useState('loadingAnim');
    const [checkoutDetailsPage, setCheckoutDetailsPage] = useState('checkout-container-inner-layer hide');
    const [ showSelectList, setShowSelectList ] = useState(null);

    const [smallLoader, setSmallLoader] = useState("small-loader hide");
    const [totalCost, setTotalCost] = useState("total-amount-inner-layer");
    const [priceData, setPriceData] = useState("price-content");

    const [itemContentContainer, setItemContentContainer ] = useState("item-content-container");
    const [itemContainerLoader, setItemContainerLoader] = useState("item-loader hide");

    const [ truckContainer, setTruckContainer ] = useState("checkout-truck-container");

    const [isAuth, setIsAuth] = useState(false);

    const [ newCookie, setNewCookie ] = useState(null);
    let decryptedSIDs = [];

    const context = useContext(CartDataContext);
    const modalContext = useContext(ModalContext);
    const imageWrapDummy = useRef(null);

    useEffect(() => {
        Axios.get(
            api.CHECK_FOR_AUTH,
            {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    "Content-Type": "application/json"
                },

                withCredentials: true
            }
        )
            .then(res => {
                let responseData = decryptData(res.data.responseData);

                if (!responseData.isAuthenticated) {
                    setIsAuth(false)
                }
                else{
                    setIsAuth(true)
                }
            })
            .catch(e => console.error(e)) 

        getCookieData()
        
        const script = document.createElement("script")
        script.src = "https://checkout.razorpay.com/v1/checkout.js"

        document.body.appendChild(script);
    }, []);

    useEffect(() => {
        context.cartData(cartData)
    }, [cartData])

    const getCookieData = async () => {

        let decryptedCookieData, decryptedDetailsData, decryptedSessionData, dummyArray = [], allCartData = [];

        let handleProductDetailsData = (data) => {

            // console.log(data);
            
            decryptedSIDs = data;

            if (data) {
                data.map((prod, i) => {
        
                    let dataToBackend_forProductData = {
                        productId : prod.productId
                    };
        
                    dummyArray.push(
                        Axios.post(api.GET_DETAILED_PRODUCTS_DATA,
                            {
                                requestData: encryptData(dataToBackend_forProductData),
                                message: "All units, requesting for product expected load in T-45"
                            },
                            {
                                headers: {
                                    'accept': 'application/json',
                                    'Accept-Language': 'en-US,en;q=0.8',
                                    "Content-Type": "application/json"
                                },
                        
                                withCredentials: true
                            }
                        )
                    )
                })
            }
        }

        await Axios.get(
            api.GET_COOKIE_DATA,
            {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    "Content-Type": "application/json"
                },

                withCredentials: true
            }
        )
        .then(async res => {
            decryptedCookieData = decryptData(res.data.responseData); 

            if (decryptedCookieData.authData) {
                let cookieCartData = decryptedCookieData.authData.cartData;

                // console.log("cookie:", cookieCartData);

                if(decryptedCookieData.authData.rLId) {

                    await Axios.get(
                        api.GET_ITEMS_IN_CART,
                        {
                            headers: {
                                'accept': 'application/json',
                                'Accept-Language': 'en-US,en;q=0.8',
                                "Content-Type": "application/json"
                            },
            
                            withCredentials: true
                        }
                    )
                    .then(res => {
                        let { cart, cartItemsExist } = decryptData(res.data.responseData);

                        // console.log(cart, cartItemsExist);

                        if (cart) {
                            if (cartItemsExist) {
                                if (cookieCartData) {

                                    let arr1 = cart.cartItems,
                                    arr2 = cookieCartData, newArr;

                                    newArr = arr2.reduce((acc, eachArr2Elem) => {
                                        if (arr1.findIndex((eachArr1Elem) => eachArr1Elem.productId === eachArr2Elem.productId)  === -1) {
                                            acc.push(eachArr2Elem)
                                        }
                                        return acc
                                    }, [...arr1])

                                    arr1.map(arr1Item => {
                                        arr2.map(arr2Item => {
                                            if (arr1Item.quantity !== arr2Item.quantity) {
                                                newArr = arr2;
                                            }
                                        })
                                    })

                                    decryptedSessionData = newArr
                                    handleAddToCart(decryptedSessionData)
                                    
                                    handleProductDetailsData(decryptedSessionData)
                                }

                                else { 
                                    decryptedSessionData = cart.cartItems;

                                    // decryptedSIDs = decryptedSessionData;
                                    handleProductDetailsData(decryptedSessionData)
                                    // set old cookie into state, to look for any change in quantity and create new cookie
                                    setNewCookie(decryptedSessionData) 
                                }
                            }
                        }

                        else if (cookieCartData) {
                            // decryptedSIDs = cookieCartData;
                            handleProductDetailsData(cookieCartData)
                            handleAddToCart(decryptedCookieData.authData.cartData)
                        }
                    })
                    .catch(err => console.log(err))
                }

                else {
                    setNewCookie(cookieCartData)
                    handleProductDetailsData(cookieCartData)
                    setCheckoutLocation("checkout-location-inner-layer hide")
                    setLoginGraphic("login-button-page")
                }
            }

            else {
                setCheckoutLocation("checkout-location-inner-layer hide")
                setLoginGraphic("login-button-page")
            }

        })
        .catch(err => console.log(err))

        await Promise.all([ ...dummyArray ])
            .then(res => {

                res.map((item, i) => {
                    decryptedDetailsData = decryptData(item.data.responseData);

                    // console.log(decryptedDetailsData, decryptedSIDs);

                    decryptedSIDs.map((item, i) => {
                        if(item.productId === decryptedDetailsData.productId) {

                            let dataToHandlePrices = {
                                ...item,
                                basePrice: decryptedDetailsData.basePrice,
                                discount: decryptedDetailsData.discount,
                                gstPercentage: decryptedDetailsData.gstPercentage
                            }

                            let dataForDetails = {
                                productId: decryptedDetailsData.productId,
                                productName: decryptedDetailsData.productName,
                                productCode: decryptedDetailsData.productCode,
                                basePrice: decryptedDetailsData.basePrice,
                                gstPercentage: decryptedDetailsData.gstPercentage,
                                productMaterial: item.productMaterial,
                                size: item.size,
                                quantity: item.quantity,
                                discount: decryptedDetailsData.discount,
                                productThumbImage: decryptedDetailsData.productThumbImage,
                                brandName: decryptedDetailsData.brandName,
                                minQuantity: decryptedDetailsData.minQuantity,
                                maxQuantity: decryptedDetailsData.maxQuantity,
                                netPriceInclGST: handlePrices(dataToHandlePrices, "netPrice"),
                                discountInclGST: handlePrices(dataToHandlePrices, "discountedPrice"),
                                totalPriceInclGST: handlePrices(dataToHandlePrices, "totalPrice")
                            }

                            if (item.colorOption || item.finishingOption) {
                                if (item.colorOption) dataForDetails["color"] = item.colorOption;
                                else if (item.finishingOption) dataForDetails["finish"] = item.finishingOption;
                            }
                            
                            // console.log(dataForDetails);
                            allCartData.push(dataForDetails)
                            // setloadingClass('loadingAnim hide')
                            setCheckoutDetailsPage('checkout-container-inner-layer')
                        }
                    })
                })
            })
            .catch(err => console.log(err))

        setCartData(allCartData);
        setloadingClass('loadingAnim hide');
        setCheckoutDetailsPage('checkout-container-inner-layer')
        setItemContentContainer("item-content-container")
        setItemContainerLoader("item-loader hide")
    };
    
    const handleAddToCart = (decryptedCookieData) => {
        let decryptedSessionData;

        // console.log(decryptedCookieData);

        let dataToSendBackend =  {
            requestData: encryptData({
                cartItems: decryptedCookieData
            }) 
        }

        // console.log(decryptData(dataToSendBackend.requestData));

        if (decryptedCookieData.length !== 0) {
            Axios.put(
                api.ADD_ITEM_TO_CART,
                dataToSendBackend,
                {
                    headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        "Content-Type": "application/json"
                    },
        
                    withCredentials: true
                })
                .then(res => {
                    decryptedSessionData = decryptData(res.data.responseData).cartItems;
    
                    decryptedSIDs = decryptedSessionData;
                    // set old cookie into state, to look for any change in quantity and create new cookie
                    setNewCookie(decryptedSessionData) 

                })
                .catch(err => console.log(err))
        }

        else {
            // Hit remove rLId route 

            Axios.delete(
                api.DELETE_CART_DATA,
                {
                    headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        "Content-Type": "application/json"
                    },
    
                    withCredentials: true
                }
            )
        }
       
    };

    const handlePrices = (product, priceOf) => {

        let colorCost, finishCost, materialCost, sizeCost;

        if (product.colorOption) colorCost = product.colorOption.colorCost;
        else colorCost = 0;

        if (product.finishingOption) finishCost = product.finishingOption.finishCost;
        else finishCost = 0;

        if (product.productMaterial) materialCost = product.productMaterial.materialCost;
        else materialCost = 0;

        if (product.size) sizeCost = product.size.sizeCost;
        else sizeCost = 0;  

        let netPrice = Number((product.basePrice + colorCost + finishCost + materialCost + sizeCost) * Number(product.quantity)).toFixed(2);
        let discount = Number(netPrice * (product.discount / 100)).toFixed(2);
        let totalPrice = Number(netPrice - discount).toFixed(2);

        let netPriceInclGST = Number(netPrice * ((100 + product.gstPercentage) / 100)).toFixed(2);
        let discountInclGST = Number(discount * ((100 + product.gstPercentage) / 100)).toFixed(2);
        let totalPriceInclGST = Number(netPriceInclGST - discountInclGST).toFixed(2);

        if (priceOf === "netPrice") return netPriceInclGST;
        else if (priceOf === "discountedPrice") return discountInclGST;
        else if (priceOf === "totalPrice") return totalPriceInclGST;
        else {
            return (
                <div className="price-tags">
                    <h1> ₹ {formatPricesToLocale(totalPriceInclGST)}</h1>
                    {/* <p><strike>₹ {formatPricesToLocale(netPriceInclGST)}</strike></p> */}
                </div>
            );
        }
    };

    const returnAddedItemsContainer = () => {
        let cookieUpdatedCartData;
        
        let newCookieData = async (data) => {

            await setCookieData(data)
                .then(res => {
                    cookieUpdatedCartData = decryptData(res.data.responseData);

                    if(cookieUpdatedCartData.message === "Cookie Set") {
                        getCookieData()
                        setSmallLoader("small-loader hide")
                        setPriceData("price-content")
                        // setItemContentContainer("item-content-container")
                        // setItemContainerLoader("item-loader hide")
                    }

                })
                .catch(err => console.log(err))
        };

        let setQuantityChange = (e,product) => {

            let updatedQuantity = Number(e.target.value) !== 0 ? Number(e.target.value) : 1 ;
            let updatedProductInCart = cartData, updatedCookieData = newCookie;

            console.log(updatedQuantity);

            updatedProductInCart.map((item) => {
                if (item.productId === product.productId) {
                    product.quantity = updatedQuantity
                    return item;
                }
            });

            updatedCookieData.map((item) => {
                if (item.productId === product.productId) {
                    item.quantity = updatedQuantity
                    return item;
                }
            });

            updatedCookieData = encryptData({ cartData: updatedCookieData });

            newCookieData(updatedCookieData);
            setCartData(updatedProductInCart);
        };

        return cartData.map((item, i) => {
            return(
                <div
                    key={i} 
                    className="added-item-outer-container"
                >
                    <div 
                        className="added-items-inner-container"
                    >
                        <div 
                            className="image-wrap-dummy"
                            ref={imageWrapDummy}
                            >
                            {
                                item.productThumbImage ? productThumbImageHandler(item) : null
                            }
                        </div>  
                        <div className="item-details-container">
                            <div className="item-name-header-container">
                                <h3
                                    onClick={() => {
                                        getProductHierarchy(encryptData({ pId: item.productId }))
                                            .then(res => {
                                                let decryptedNamesData = decryptData(res.data.responseData);

                                                let categoryName = decryptedNamesData.categoryName;
                                                let subCategoryName = decryptedNamesData.subCategoryName;
                                                let productTypeName = decryptedNamesData.productTypeName;

                                                window.open(`/product-detail/${categoryName}/${subCategoryName}/${productTypeName}/${alterFetchId(item.productId)}`, "_self")
                                            })
                                            .catch(err => console.log(err))
                                    }}
                                >
                                    {item.productName}
                                </h3>
                            </div>
                            <div
                                className="item-qunatity-container"
                            >
                                <div className="x-sign"><h3>X</h3></div>
                                <div className="column-container">
                                    <div className={showSelectList !== item.productId ? "show" : "hide"}>
                                        <input
                                            defaultValue={item.quantity}
                                            onChange={(e) => {
                                                setQuantityChange(e,item)
                                                setSmallLoader("small-loader")
                                                setPriceData("price-content hide")
                                                }
                                            }  
                                        />
                                    </div>                                    
                                </div>
                            </div>
                            <div className="price-tag-container">
                                <h1> ₹ {item.totalPriceInclGST} <span>incl GST</span> </h1>
                            </div>
                        </div>
                    </div>
                    <div className="delete-cart-data">
                        <div 
                            className="delete-cart-button"
                            onClick={() => {

                                cookieUpdatedCartData = {
                                    cartData : newCookie.filter((product) => {
                                        return product.productId !== item.productId
                                    })
                                }; 

                                handleAddToCart(newCookie.filter((product) => product.productId !== item.productId))
                                cookieUpdatedCartData = encryptData(cookieUpdatedCartData)
                                setItemContentContainer("item-content-container hide")
                                setItemContainerLoader("item-loader")
                                newCookieData(cookieUpdatedCartData)
                            }}
                        >
                            <DeleteCloseButton/>    
                        </div>  
                    </div>
                </div>
            )
        });
    };

    const productThumbImageHandler = (product) => {
        return (
            <Image
                cloudName="rolling-logs"
                alt={product.productName}
                publicId={PublicId(product.productThumbImage)}
                width="90"
                height="80"
                crop="fit"
                secure="true"
            />
        )
    };

    const handleTotalCost = () => {
        if (cartData.length !== 0) return <h1>₹ {formatPricesToLocale(sumProperty(cartData, "totalPriceInclGST"))}</h1>
    };

    const checkAuth = () => {
        Axios.get(
            api.CHECK_FOR_AUTH,
            {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    "Content-Type": "application/json"
                },
    
                withCredentials: true
            }
        )
        .then(res => {
            let responseData = decryptData(res.data.responseData);
            
            if(!responseData.isAuthenticated) {
                modalContext.loginSignUpOrPaymentModal("open", "logIn");
            } 
        })
        .catch(e => console.error(e))  
    };

    const returnTruckData = () => {

        let cartItemsContainer = () =>{
            return(
                <div className={checkoutDetailsPage}>
                    <div className="checkout-items-outer-layer">
                        <div className="checkout-items-inner-layer">
                            <div className="item-header-conatiner">
                                <div className="item-header-inner-container">
                                    <div className="svg-img-conatiner">
                                        <BigCartTruck />
                                    </div>
                                    {cartData ? (cartData.length !== 0 ? <h3>Truck is loaded with {cartData.length} {cartData.length > 1 ? "items" : "item"}</h3> : <h3>Truck is empty</h3>) : <h3>Truck is empty</h3>}
                                </div>
                            </div>
                            <div className={itemContentContainer}>
                                <div className="item-content-inner-container">
                                    <div className="added-item-container">
                                        {cartData ? (cartData.length !== 0 ? returnAddedItemsContainer() : <p>Add items to welcome truck home.</p>) : <p>Add items to welcome truck home.</p>}
                                    </div>
                                </div>
                            </div>
                            <div className={itemContainerLoader}>
                                <ModalTransitionLoader />
                            </div>
                        </div>
                    </div>
                    <div id="map-content" className="checkout-location-outer-layer">
                        <div className={checkoutLocation}>
                            <div className="location-header-container">
                                <div className="location-header-inner-container">
                                    <h3>Select the delivery location</h3>
                                </div>
                            </div>
                            <div className={locationDetails}>
                                <div className="address-input-field-container">
                                    <MapAutocompleteSearch cartData={cartData} />
                                </div>
                            </div>
                        </div>
                        <div className={loginGraphic}>
                            <div className="image-category-section">
                                {/* <NewTruck/> */}
                                <img src="https://rolling-logs.s3.ap-south-1.amazonaws.com/app-data/backgrounds/IMG_2207.jpg" alt="" />
                            </div>
                            <WhiteButton
                                runFunction={() => checkAuth()}
                            >
                                Login / Signup
                            </WhiteButton>
                        </div>
                    </div>
                    {
                        cartData
                            ?
                            (cartData.length !== 0 ?
                                <div className="checkout-amount-container">
                                    <div className={totalCost}>
                                        <h1>Total</h1>
                                        <div
                                            className={priceData}
                                        >
                                            {handleTotalCost()}
                                        </div>
                                    </div>
                                    <div className={smallLoader}>
                                        <SimpleShadeTransitionLoader />
                                    </div>
                                </div> :
                                <div className="checkout-amount-container">
                                    {/* <h3>Add products to place order</h3> */}
                                </div>
                            )
                            :
                            <div></div>
                    }
                </div>
            )
        }

        let emptyCartContainer = () => {
            return(
                <div className={truckContainer}>
                    <div className="checkout-truck-inner-container">
                        <div className="truck-img-container">
                            <img src="https://rolling-logs.s3.ap-south-1.amazonaws.com/app-data/backgrounds/IMG_2238.jpg" alt="" />
                        </div>
                        <div className="text-container">
                            <h3>Oops! our truck is empty</h3>
                            <p>Add items to welcome truck home</p>
                        </div>
                    </div>
                </div>
            )
        }

        if (isAuth){
            if (cartData.length !== 0) return cartItemsContainer()
            else return emptyCartContainer()
        }
        
        else{
            if (cartData.length !== 0) return cartItemsContainer()
            else return emptyCartContainer()
        }
    }

    return (
        <div className="checkout-container-outer-layer">
            <div className={loadingClass}>
                <LogoAnimation text="Bringing back the Art in Architecture." />
            </div>
                {returnTruckData()}
            <div>
                <HooksLoginOrSignupModal/>
            </div>
        </div>
    );
};

export default Checkout;