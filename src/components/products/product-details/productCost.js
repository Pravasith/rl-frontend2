import React, { Component } from 'react';
import Axios from 'axios';
import { connect } from "react-redux";

import { api } from '../../../actions/apiLinks';
import { hitApi } from '../../../actions/generalActions';
import { reCustomizeProduct } from '../../../actions/productCustomizationActions';
import { addToCartClicked } from '../../../actions/userActions';

import { alterFetchId } from '../../../factories/alterFetchId';
import { decryptData } from '../../../factories/encryptDecrypt';

import { GradientButton, WhiteButton } from "../../UX/uxComponents";
import { SimpleShadeTransitionLoader } from "../../common/loaders/modalTransitionLoader";
import { ColorIcon, SizeIcon, MaterialIcon } from "../../../assets/images/index";

import { typesOfPriceNotation } from "../../../lib/productNotations";

class ProductCost extends Component {

    state = {
        colorSelected: "",
        finishSelected: "",
        materialSelected: "",
        sizeSelected: "",

        isAuthenticated: false,
        productExistIncart: false,
        addToCartDisabled: "enable",

        addOrGoTocartBtn: "hide",
        goCart: "go-cart hide",
        cartButton: "cartButton hide",
        addCart: "add-cart",
        smallLoader: "small-loader",

        // tooltip: "tooltip-text-container",

        // dropdownModal: "dropdownInModal hide",

        displayQuantityValueValidationError: "displayQuantityValueValidationError hide",
        displayMaxQuantityValueError: "displayMaxQuantityValueError hide",
        displayMinQuantityValueError: "displayMinQuantityValueError hide"
    };

    componentDidMount = () => {
        const { minQuantity, priceNotation } = this.props.productData;


        console.log(this.props.productData);

        // return [
        //     { label: 'Choose One', value: 0 },
        //     { label: "per cubic feet ", value: 1 },
        //     { label: "per square feet", value: 2 },
        //     { label: "per running feet", value: 3 },
        //     { label: "per quantity", value: 4 },
        //     { label: "per litre", value: 5 }
        // ];
        
        if (priceNotation === 4) this.setState({ addOrGoTocartBtn: "show" })

        if (minQuantity !== 0) this.setState({ productQuantityRequired: minQuantity });
        else this.setState({ productQuantityRequired: 1 });

        this.getCookieData(this.props.productData);
    };

    getCookieData = async (productData) => {
        let decryptedCookieData;

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
        .then(res => {
            decryptedCookieData = decryptData(res.data.responseData);  
            
            this.setState({
                cartButton: "cartButton",
                smallLoader: "small-loader hide",
            })

            
            if (decryptedCookieData.authData) {
                
                if (decryptedCookieData.authData.rLId) {

                    this.setState({ 
                        isAuthenticated: true
                    })

                    Axios.get(
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

                        if(cart && cartItemsExist) { 
                            cart.cartItems.map((cartProd, i) => {
                                if (cartProd.productId === productData.productId) {
                                    this.setState({ 
                                        productExistIncart: true,
                                    })
                                }
                            })
                        }

                        
                    })
                    .catch(err => console.log(err))
                }

                else if(decryptedCookieData.authData.cartData) {    
                    let checkForCookie = [...decryptedCookieData.authData.cartData];

                    checkForCookie.map((cartProd, i) => {
                        if (cartProd.productId === productData.productId) {
                            this.setState({ 
                                productExistIncart: true,
                            })
                        }
                    })
                }

            }

        })
        .catch(err => console.log(err))
    };

    setCookieData = (dataToSend) => {

        this.props.hitApi(
            api.SET_DATA_AS_COOKIE,
            "POST",
            {
                requestData: dataToSend,
                message: "All units, one o in pursuit, calling back up, limb shots only!"
            }
        )
        .then(() => {
            this.props.addToCartClicked()
            this.setState({ 
                productExistInCart: true,
                goCart: "go-cart",
                cartButton: "hide"
            })
        })
    };

    returnCustomisedOptions = (typeOf) => {
        const { colorOptions, finishingOptions, productMaterials, sizesAvailable } = this.props.productData;
        const { colorOrFinishSelected, materialSelected, sizeSelected } = this.props.newCustomOptionData;

        const choosenType = () => {
            if (colorOrFinishSelected) {
                if (colorOrFinishSelected.finishName) return "finish";
                else if (colorOrFinishSelected.colorName) return "color";
            }
        };

        if (typeOf === "colorOrFinish") {
            let option = choosenType();

            if (option === "color") {
                return (
                    <div className="productCustomizeContentContainer">
                        <div className="contentColorFinsihContainer">
                            <div
                                className="colorDetails"
                                style={{ background: colorOrFinishSelected.colorCode }}
                            />
                            <div className="colorName">
                                <p className="boldText">{colorOrFinishSelected.colorName}</p>
                                <p>{colorOrFinishSelected.colorCode}</p>
                            </div>
                        </div>
                        <div className={colorOptions.length > 1 ? "buttonContainer" : "buttonContainer hide"}>
                            <WhiteButton
                                runFunction={() => {
                                    this.props.reCustomizeProduct(
                                        "open",
                                        {
                                            dropdownModal: "dropdownInModal",
                                            modalType: "color"
                                        }
                                    )
                                }}
                            >
                                Choose another
                            </WhiteButton>
                        </div>
                    </div>
                )
            }

            else if (option === "finish") {
                return (
                    <div className="productCustomizeContentContainer">
                        <div className="contentColorFinsihContainer">
                            <div className="colorDetails">
                                <img
                                    src={colorOrFinishSelected.finishImage}
                                    alt=""
                                />
                            </div>
                            <div className="colorName">
                                <p className="boldText">{colorOrFinishSelected.finishName}</p>
                                <p>{colorOrFinishSelected.finishCode}</p>
                            </div>
                        </div>
                        <div className={finishingOptions.length > 1 ? "buttonContainer" : "buttonContainer hide"}>
                            <WhiteButton
                                runFunction={() => {
                                    this.props.reCustomizeProduct(
                                        "open",
                                        {
                                            dropdownModal: "dropdownInModal",
                                            modalType: "finish"
                                        }
                                    )
                                }}
                            >
                                Choose another
                            </WhiteButton>
                        </div>
                    </div>
                )
            }
        }

        else if (typeOf === "size") {
            if (sizeSelected)
                return (
                    <div className="productCustomizeContentContainer">
                        <div className="columnContainer">
                            <p>{sizeSelected.sizeName}</p>
                        </div>
                        <div className={sizesAvailable.length > 1 ? "buttonContainer" : "buttonContainer hide"}>
                            <WhiteButton
                                runFunction={() => {
                                    this.props.reCustomizeProduct(
                                        "open",
                                        {
                                            dropdownModal: "dropdownInModal",
                                            modalType: "size"
                                        }
                                    )
                                }}
                            >
                                Choose another
                            </WhiteButton>
                        </div>
                    </div>
                )
        }

        else if (typeOf === "material") {
            if (materialSelected)
                return (
                    <div className="productCustomizeContentContainer">
                        <div className="columnContainer">
                            <p>{materialSelected.materialName}</p>
                            <p>{materialSelected.materialGrade}</p>
                        </div>
                        <div className={productMaterials.length > 1 ? "buttonContainer" : "buttonContainer hide"}>
                            <WhiteButton
                                runFunction={() => {
                                    this.props.reCustomizeProduct(
                                        "open",
                                        {
                                            dropdownModal: "dropdownInModal",
                                            modalType: "material"
                                        }
                                    )
                                }}
                            >
                                Choose another
                        </WhiteButton>
                        </div>
                    </div>
                )
        }
    };

    handleFinishOrColorCost = () => {
        const { colorOrFinishSelected } = this.props.newCustomOptionData;

        if (colorOrFinishSelected !== undefined) {
            if (colorOrFinishSelected.finishCost !== undefined) {
                return colorOrFinishSelected.finishCost
            }

            else if (colorOrFinishSelected.colorCost !== undefined) {
                return colorOrFinishSelected.colorCost
            }
        }
    };

    checkTypeNumber = (e, checkFor) => {
        const { productData } = this.props;
        const val = e.target.value === "" ? null : Number(e.target.value);
        const regEx = /^(?!0+$)[0-9]{1,10}$/;

        // console.log(this.refs.quantity)

        if (val !== null) {
            if (regEx.test(val) === true) {
                if (checkFor === "quantity") {
                    if (val >= productData.minQuantity) {
                        if (val <= productData.maxQuantity) {
                            this.setState({
                                productQuantityRequired: Number(val),
                                displayQuantityValueValidationError: "displayQuantityValueValidationError hide",
                                displayMaxQuantityValueError: "displayMaxQuantityValueError hide",
                                displayMinQuantityValueError: "displayMinQuantityValueError hide"
                            });
                        }
                        else {
                            this.setState({
                                productQuantityRequired: productData.maxQuantity,
                                displayMaxQuantityValueError: "displayMaxQuantityValueError"
                            });
                        }
                    }
                    else {
                        this.setState({
                            productQuantityRequired: productData.minQuantity,
                            // displayMinQuantityValueError: "displayMinQuantityValueError"
                        });
                    }
                }
            }

            else if (regEx.test(val) === false) {
                if (checkFor === "quantity") {
                    this.setState({
                        productQuantityRequired: 1,
                        displayQuantityValueValidationError: "displayQuantityValueValidationError"
                    });
                }
            }
        }

        else if (val === null) {
            // console.log("wrks null")
            this.setState({
                productQuantityRequired: 1,
                displayError: "displayError hide",
                displayQuantityValueValidationError: "displayQuantityValueValidationError hide",
                displayMaxQuantityValueError: "displayMaxQuantityValueError hide",
                displayMinQuantityValueError: "displayMinQuantityValueError hide"
            });
        }
    };

    handleAddToCart = async (productData, materialSelected, sizeSelected, colorOrFinishSelected) => {
        let cartData = [];
        let cpData = {
            productId: productData.productId,
            productMaterial: materialSelected,
            size: sizeSelected,
            quantity: this.state.productQuantityRequired
        }

        if (colorOrFinishSelected) {
            if (colorOrFinishSelected.colorName) {
                cpData["colorOption"] = colorOrFinishSelected
            }
            else if (colorOrFinishSelected.finishName) {
                cpData["finishingOption"] = colorOrFinishSelected
            }
        }

        cartData.push(cpData)

        let dataToSend = { cartData };

            await this.props.hitApi(
                api.GET_COOKIE_DATA,
                "GET"
            )
            .then(async res => {
    
                const { authData } = res.payload.responsePayload;
                
                if(authData) {
                    if (authData.cartData) {
    
                    let checkForCookie = [...res.payload.responsePayload.authData.cartData];

                    if (!this.state.productExistIncart) {
                        await checkForCookie.push(cpData);
                    }
    

                    if (authData.rLId) {

                        await Promise.all([
                            this.props.hitApi(
                                api.SET_DATA_AS_COOKIE,
                                "POST",
                                {
                                    requestData: { cartData : checkForCookie },
                                    message: "All units, one o in pursuit, calling back up, limb shots only!"
                                }
                            ),

                            this.props.hitApi(
                                api.ADD_ITEM_TO_CART,
                                "PUT", 
                                {
                                    requestData: { cartItems: checkForCookie },
                                    message: "Authorized to team up"
                                }
                            )
                        ])
                        .then(res => {

                            this.props.addToCartClicked()
                            this.setState({ 
                                productExistInCart: true,
                                goCart: "go-cart",
                                cartButton: "hide"
                            })
                        })
                        .catch(err => console.log(err))
                    }

                    else {
    
                        await this.props.hitApi(
                            api.SET_DATA_AS_COOKIE,
                            "POST",
                            {
                                requestData: { cartData : checkForCookie },
                                message: "All units, one o in pursuit, calling back up, limb shots only!"
                            }
                        )
                        .then(() => {
                            this.props.addToCartClicked()
                            this.setState({ 
                                productExistInCart: true,
                                goCart: "go-cart",
                                cartButton: "hide"
                            })
                        })
                        .catch(err => console.log(err))
                    }
                }

                else {
                    this.setCookieData(dataToSend)
                }
            }

            else {
                this.setCookieData(dataToSend)
            }
        })
        .catch(err => console.log(err))

    };


    handlePriceNotaion = (priceNotation) => {
        let notatedType;

        // if (priceNotation) {
            typesOfPriceNotation.map(item => {
                if (item.value === priceNotation) notatedType = item.label;
            })

            return notatedType;
        // }
    }

    returnProductDetailedCost = () => {
        const { newCustomOptionData, productData, categoryName, subCategoryName, productTypeName } = this.props;
        const { colorOrFinishSelected, materialSelected, sizeSelected } = newCustomOptionData;

        // console.log(productData)

        let finishOrColorCost, materialCost, sizeCost;

        if (newCustomOptionData !== {}) {
            if (colorOrFinishSelected) finishOrColorCost = this.handleFinishOrColorCost();
            else finishOrColorCost = 0;

            if (materialSelected) materialCost = materialSelected.materialCost;
            else materialCost = 0;

            if (sizeSelected) sizeCost = sizeSelected.sizeCost;
            else sizeCost = 0;
        };

        let netPrice = (productData.basePrice + finishOrColorCost + materialCost + sizeCost) * Number(this.state.productQuantityRequired);
        // let netPrice = (productData.basePrice + finishOrColorCost + materialCost + sizeCost) * 1;
        let discount = netPrice * productData.discount / 100;
        let discountedPrice = netPrice - discount;

        // let netPriceExclGST = netPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        // let totalPriceExclGST = discountedPrice.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        // let savedPriceExclGST = (netPrice - discountedPrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        let netPriceInclGST = Number(netPrice + (netPrice  * productData.gstPercentage / 100));
        let totalPriceInclGST = (discountedPrice + (discountedPrice * productData.gstPercentage / 100));
        let savedPriceInclGST = ((netPrice - discountedPrice));

        // console.log(netPriceInclGST, totalPriceInclGST, savedPriceInclGST, productData.discount)
        // console.log(netPrice, discountedPrice, productData.gstPercentage)

        return (
            <div className="productDetailCostContainer">
                <div className="product-detail-cost-container-inner-layer">
                    <div className="productDetailCostHeader">
                        <div className="headerContainer">
                            <h1>Cost estimate</h1>
                            <div className="line"></div>
                        </div>
                        <div className="productCustomizeOptions">
                            <h3>Customization options</h3>

                            <div className="productCustomizeOptionsOuterLayer">
                                <div className="productCustomizeOptionsInnerLayer">
                                    {/* <div className="dashed-line"></div> */}
                                    <div className={colorOrFinishSelected ? "productCustomizeContainer" : "productCustomizeContainer hide"}>
                                        <div className="iconContainer">
                                            <ColorIcon />
                                            <h3>Color/finish</h3>
                                        </div>
                                        {this.returnCustomisedOptions("colorOrFinish")}
                                    </div>
                                    <div className={materialSelected ? "dashed-line" : "dashed-line hide"}></div>
                                    <div className={materialSelected ? "productCustomizeContainer" : "productCustomizeContainer hide"}>
                                        <div className="iconContainer">
                                            <MaterialIcon />
                                            <h3>Material</h3>
                                        </div>
                                        {this.returnCustomisedOptions("material")}
                                    </div>
                                    <div className={sizeSelected ? "dashed-line" : "dashed-line hide"}></div>
                                    <div className={sizeSelected ? "productCustomizeContainer" : "productCustomizeContainer hide"}>
                                        <div className="iconContainer">
                                            <SizeIcon />
                                            <h3>Size</h3>
                                        </div>
                                        {this.returnCustomisedOptions("size")}
                                    </div>
                                    {/* <div className="dashed-line"></div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="line"></div>
                    <div className="productQuantityInput">
                        <div className="inputSection">
                            <h3>Quantity</h3>
                                {this.state.productExistIncart ? 
                                    (
                                        <input
                                            defaultValue={this.state.productQuantityRequired}
                                            readOnly
                                        />
                                    )
                                    :
                                    (
                                        <input
                                            ref="quantity"
                                            type="text"
                                            name="productQuantity"
                                            defaultValue={this.state.productQuantityRequired}
                                            placeholder="Ex. 20"
                                            onChange={e => this.checkTypeNumber(e, "quantity")}
                                            maxLength="8"
                                        />
                                    )
                                }
                            <div className="switchContainer">
                                {/* <p>Min. : {productData.minQuantity !== 0 ? productData.minQuantity : 1}</p> */}
                                <p>Max. : {productData.maxQuantity}</p>
                            </div>
                        </div>
                        <div className="errorContent">
                            <p className={this.state.displayQuantityValueValidationError}>
                                Numbers Only (zero cannot be accepted as a valid number)
                            </p>
                            <p className={this.state.displayMinQuantityValueError}>
                                Minimum quantity cannot be less than {productData.minQuantity}.
                            </p>
                            <p className={this.state.displayMaxQuantityValueError}>
                                Maximum quantity cannot be greater than {productData.maxQuantity}.
                            </p>
                        </div>
                    </div>
                    <div className="line"></div>
                    <div className={productData.basePrice !== 1 ? "productTotalCost" : "productTotalCost hide"}>
                        <h3>Total cost</h3>

                        <p className={productData.discount !== 0 ? "noDiscountPrice" : "noDiscountPrice hide"}>
                            ₹ {netPriceInclGST.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>

                        <h3 className="inclusiveCostRate">
                                <span> ₹ {totalPriceInclGST.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} </span>
                                <span className="per-piece-text"> {this.handlePriceNotaion(productData.priceNotation)} </span> 
                                incl. GST 
                         </h3>

                        {/* <h1><span> ₹ {totalPriceInclGST}</span> incl. GST</h1>  */}

                        <div className={productData.discount !== 0 ? "offer" : "offer hide"}>
                            <p className="discountOffer">Offer {(productData.discount)}% off</p>
                            <p className="priceSaved">You save <span>₹ {savedPriceInclGST.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span> </p>
                        </div>

                        <p>
                            <span className="notePoint">NOTE</span> This is an approximation of the cost to be incurred. You
                            can <span>order in bulk and save BIG!!!</span> Please click the button
                            below to send this requirement to the vendor and negotiate.
                        </p>
                    </div>
                </div>
                {/* <div className="add-to-cart-button-container">
                    <WhiteButton>
                        ADD TO CART
                    </WhiteButton>
                </div> */}
                <div className="active-gradient-button">
                    {/* <div className={this.state.reqQuoteBtn} > */}
                        <GradientButton
                            buttonDisabled={this.handleButtonDisability()}
                            runFunction={() => {

                                let pData = {
                                    productName: productData.productName,
                                    productCode: productData.productCode,
                                    basePrice: productData.basePrice,
                                    gstPercentage: productData.gstPercentage,
                                    productMaterial: materialSelected,
                                    size: sizeSelected,
                                    quantity: this.state.productQuantityRequired,
                                    productId: productData.productId,
                                    discount: productData.discount,
                                    productImages: [...productData.productImages],
                                    productThumbImage: productData.productThumbImage,
                                    brandImage: productData.brandImage,
                                    brandName: productData.brandName
                                }

                                if (colorOrFinishSelected) {
                                    if (colorOrFinishSelected.colorName) {
                                        pData["colorOption"] = colorOrFinishSelected
                                    }
                                    else if (colorOrFinishSelected.finishName) {
                                        pData["finishingOption"] = colorOrFinishSelected
                                    }
                                }

                                this.props.reCustomizeProduct(
                                    "open",
                                    {
                                        dropdownModal: "dropdownInModal",
                                        modalType: "requestQuote",
                                        miscellaneousData: {
                                            productLink: `/product-detail/${categoryName}/${subCategoryName}/${productTypeName}/${alterFetchId(productData.productId)}`,
                                            productData: pData
                                        }
                                    }
                                )
                            }}
                        >
                            {productData.basePrice !== 1 ? "Request quote / ask more details / negotiate" : "Request quote / ask more details / negotiate"}
                        </GradientButton>
                    {/* </div> */}
                    
                    <div className={this.state.addOrGoTocartBtn}>
                        <div className={this.state.cartButton}>
                            {
                                this.state.productExistIncart ?
                                    (
                                        <WhiteButton
                                            runFunction={() => {
                                                window.open('/checkout-details', "_self")
                                            }}
                                        >
                                            Go to cart
                                        </WhiteButton>
                                    )

                                    :

                                    (
                                        <WhiteButton
                                            runFunction={() => {
                                                this.handleAddToCart(productData, materialSelected, sizeSelected, colorOrFinishSelected)
                                            }}
                                        >
                                            Add to cart
                                        </WhiteButton>
                                    )
                            }
                        </div>
                        
                        <div className={this.state.goCart}>
                            <WhiteButton
                                runFunction={() => {
                                    window.open('/checkout-details', "_self")
                                }}
                            >
                                Go to cart
                            </WhiteButton>
                        </div>
                    </div>

                    <div className={this.state.smallLoader}>
                        <SimpleShadeTransitionLoader/>
                    </div>
                    <p className={productData.basePrice !== 1 ? "hide" : ""}><span className="notePoint">NOTE</span> You can <span>order in bulk and save BIG!!!</span></p>
                </div>

            </div>
        )
    };

    handleButtonDisability = () => {
        const { displayMinQuantityValueError, displayMaxQuantityValueError, displayQuantityValueValidationError, productQuantityRequired } = this.state,
            { basePrice, minQuantity } = this.props.productData;

        // if (this.refs.quantity !== "" || this.refs.quantity !== 0) { 
        if (basePrice !== 1) {
            if (displayQuantityValueValidationError !== "displayQuantityValueValidationError hide"
                || displayMinQuantityValueError !== "displayMinQuantityValueError hide"
                || displayMaxQuantityValueError !== "displayMaxQuantityValueError hide"
            ) return true
        }

        else return false
        // }

        // else return false
    };

    render() {
        return (
            <div className="costEstimatorContainerInnerLayer">
                {this.returnProductDetailedCost()}
            </div>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        resultAfterLoadingStopsInModal: state.resultAfterLoadingStopsInModal,
        newCustomOptionData: state.newCustomOptionData
    }
};

export default connect(mapStateToProps, { reCustomizeProduct, hitApi, addToCartClicked })(ProductCost);