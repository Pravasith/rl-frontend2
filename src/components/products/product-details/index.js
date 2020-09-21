import react, { Component } from "react";
import Head from "next/head";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { api } from "../../../actions/apiLinks";
import { navBarLoadingAnimationShowHide, hitApi } from "../../../actions/generalActions";
import { checkForAuth } from "../../../actions/userActions";
import { reCustomizeProduct } from "../../../actions/productCustomizationActions";
import { modalLoading } from "../../../actions/modalActions";

import ProductImages from "./productImages";
import ProductData from "./productData";
import ProductCost from "./productCost";

import ProductImageMagnifierModal from "./productModals/productImageMagnifierModal";
import ProductCustomModal from "./productModals/productCustomModal";
import ProductQuoteOrSampleModal from './productModals/productQuoteOrSampleModal';

import NewFooter from '../../footer/newFooter';

import LogoAnimation from "../../animations/logoAnimation";

import nameRephraser from "../../../factories/nameRephraser";
import { alterFetchId, getBackFetchId } from "../../../factories/alterFetchId";
import { convertToKebabCase, handleProdTypeName } from './../../../factories/handleNames';

import "../../../assets/css/product_details.css";
import SuccessScreenModal from './../../common/screenModals/successScreenModal';
import ErrorScreenModal from './../../common/screenModals/errorScreenModal';
import { FacebookIcon, TwitterSmallIcon, LinkedInSmallIcon, PinterestSmallIcon, FacebookSmallIcon, LinkedinSmallIcon } from "../../../assets/images/socialNetworkIcons";

class ProductDetails extends Component {

    state = {
        loadingClass: "loadingAnim",
        mainClass: "mainClass hide",
        productData: [],
        dropdownModal: "dropdownInModal hide",

        colorSelectedOnModal: "",
        finishSelectedOnModal: "",
        materialSelectedOnModal: "",
        sizeSelectedOnModal: "",
    };

    componentDidMount = async () => {
        const { fetchId, catName, subCatName, prodTypeName, productData } = this.props;

        const script = document.createElement("script");

        script.src = "//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5cbaabb8590da7f1";
        script.async = true;

        document.body.appendChild(script);

        let pId = getBackFetchId(fetchId), catId = getBackFetchId(fetchId).split("-")[0], scId = getBackFetchId(fetchId).split("-PT")[0];

        let realProductData = {}
        let theResponseDataObj = { ...productData }

        realProductData = { ...theResponseDataObj }

        let productDataForAnalytics = {
            productName: realProductData.productName,
            productId: realProductData.productId,
            productDiscount: realProductData.discount,
            productThumb: realProductData.productThumbImage,
            subCategoryName: this.props.subCatName,
            productTypeName: this.props.prodTypeName,
            price: realProductData.basePrice,
            productImages: realProductData.productImages.map(x => x.imageURL)
        }

        if (realProductData.brandImage) {
            if (realProductData.brandImage !== "") {
                productDataForAnalytics = {
                    ...productDataForAnalytics,
                    brandDetails: {
                        brandName: realProductData.brandName,
                        brandImage: realProductData.brandImage
                    }
                }
            }
        }



        this.setState({
            loadingClass: "loadingAnim  hide",
            mainClass: "mainClass",
            productData: theResponseDataObj,
            categorisedData: theResponseDataObj.subCategories,
            categoryName: catName,
            subCategoryName: subCatName,
            subCategoryId: scId,
            productId: pId,
            productTypeName: prodTypeName,
            productName: theResponseDataObj.productName,
            showImage: theResponseDataObj.productThumbImage,
            // magnifier : {
            //     ...this.state.magnifier,
            //     backgroundImage: `url(${theResponseDataObj.productThumbImage})`,
            // }
        });

        ////////////////////////

        // console.log(productDataForAnalytics)
        await this.props.hitApi(
            api.UPDATE_TRENDING_30_PRODUCTS,
            "POST",
            {
                requestData: productDataForAnalytics,
                message: "Requesting analytics"
            }
        )
            .then(res => {
                let { responsePayload } = this.props.responseData

                // console.log(responsePayload)
            })

            .catch(e => console.error(e))


        ////////////////////////////////////////////////
        ////////////////////////////////////////////////


    };

    returnProductLienName = () => {
        const { categoryName, categorisedData, productId, productTypeName, productName, subCategoryId, subCategoryName } = this.state;

        const returnDefaultProdTypeName = () => {
            let newHref = "";

            if (categorisedData) {
                categorisedData.map((item, i) => {
                    if (item.subCategoryId === subCategoryId) {
                        let productTypeName = convertToKebabCase(item.productTypes[0].productTypeName);

                        newHref = `/products/${categoryName}/${subCategoryName}/${productTypeName}/${alterFetchId(subCategoryId)}`
                    }
                })
            }

            return newHref;
        }

        return (
            <div className="productTypeContainerHeader">
                {/* <a href=""> */}
                <h3>{nameRephraser(categoryName)}</h3>
                {/* </a> */}
                <div className="iconBox">
                    {/* <NavigatorArrow /> */}
                    <p>/</p>
                </div>
                <a
                    // href={handleProdTypeName(categorisedData, subCategoryId)}
                    href={subCategoryId ? `/products/${categoryName}/${subCategoryName}/${handleProdTypeName(categorisedData, subCategoryId)}/${alterFetchId(subCategoryId)}` : ""}
                >
                    <h3>{nameRephraser(subCategoryName)}</h3>
                </a>
                <div className="iconBox">
                    {/* <NavigatorArrow /> */}
                    <p>/</p>
                </div>
                <a href={productId ? `/products/${categoryName}/${subCategoryName}/${productTypeName}/${alterFetchId(productId).split("P")[0]}` : ""}>
                    <h3>{nameRephraser(productTypeName)}</h3>
                </a>
                <div className="iconBox">
                    {/* <NavigatorArrow /> */}
                    <p>/</p>
                </div>
                <a href="">
                    <h3>{productName}</h3>
                </a>
            </div>
        )
    };

    returnComponent = (typeOf) => {
        const { productData, categoryName, subCategoryName, productTypeName } = this.state;

        // console.log(prodTypeName);

        if (productData)
            if (productData.length !== 0) {
                if (typeOf === "Images") return <ProductImages productData={productData} />;
                else if (typeOf === "Data") return <ProductData productData={productData} />;
                else if (typeOf === "Cost") {
                    return (
                        <ProductCost 
                            productData={productData}
                            categoryName={categoryName}
                            subCategoryName={subCategoryName}
                            productTypeName={productTypeName} 
                        />
                    )
                }
            }
    };

    returnMyModal = () => {
        const { dropdownModal, modalType, miscellaneousData, reqFrom } = this.props.openOrCloseModal;
        const { productData, showImage } = this.state;

        if (dropdownModal === "dropdownInModal") {
            if (modalType === "imageMagnifier") return <ProductImageMagnifierModal productData={productData} showImage={showImage} />;
            else if (modalType === "requestQuote") return <ProductQuoteOrSampleModal modalType={modalType} miscellaneousData={miscellaneousData} />;
            else if (modalType === "color" || modalType === "size" || modalType === "material" || modalType === "finish") return <ProductCustomModal productData={productData} />;
            else if (modalType === "successScreen") return <SuccessScreenModal successMsg="We received your request, we will call you back in 6 hours." />;
            else if (modalType === "errorScreen") return <ErrorScreenModal reqFrom={reqFrom} />;
        }

        else {
            return ""
        }
    };

    returnSEOContent = () => {
        const { fetchId, catName, subCatName, prodTypeName, productData } = this.props
        const productDescription = productData.productName + " online India from Indian vendors at RollingLogs."

        // console.log(productData)

        let OGImage = productData.productThumbImage
        let shrink = "c_limit,w_150"

        let tempImg1 = OGImage.split("upload")[0], tempImg2 = OGImage.split("regularImage")[1]

        let shrinkedImg = tempImg1 + "upload/" + shrink + "/regularImage" + tempImg2
        

        return (
            <Head>
                <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
                <link rel="canonical" href={`https://www.rollinglogs.com/product-detail/${catName}/${subCatName}/${prodTypeName}/${fetchId}`} />

                <title>{productData.brandName ? productData.brandName + " " + productDescription : productDescription}</title>
                <meta name="description" content={productDescription + " " + productData.productDescription.split("").filter((item, i) => i < 100).join("") + " | Rollinglogs"} />
                <meta
                    name="keywords"
                    content={productData.tags + ", " + productData.tags.map(item => item + " online India") + " bengaluru, bangalore, hyderabad, India"}
                />

                <meta property="og:type" content="product" />
                {/* <meta property="og:locale" content="en_US" /> */}
                <meta property="og:title" content={productData.brandName ? productData.brandName + " " + productDescription : productDescription} />
                <meta property="og:site_name" content="Rolling logs" />
                <meta property="og:url" content={`https://www.rollinglogs.com/product-detail/${catName}/${subCatName}/${prodTypeName}/${fetchId}`} />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image" content={shrinkedImg} />
                <meta property="og:image:alt" content={productData.brandName ? productData.brandName + " " + productDescription : productDescription} />
                <meta property="og:description" content={productDescription + " " + productData.productDescription.split("").filter((item, i) => i < 100).join("") + " | Rollinglogs"} />

            
                <meta property="product:price:amount" content={productData.basePrice} />
                <meta property="product:price:currency" content="INR" />
                <meta property="og:availability" content={ productData.availability ? "instock" : "out of stock" }  />
                <meta property="og:brand" content={productData.brandName} />

                <meta name="twitter:title" content={productData.brandName ? productData.brandName + " " + productDescription : productDescription} />
                <meta name="twitter:url" content={`https://www.rollinglogs.com/product-detail/${catName}/${subCatName}/${prodTypeName}/${fetchId}`} />
                <meta name="twitter:site" content="@Rollinglogs" />
                <meta name="twitter:description" content={productDescription + " " + productData.productDescription.split("").filter((item, i) => i < 100).join("") + " | Rollinglogs"} />
                <meta name="twitter:image" content={shrinkedImg} />
                <meta name="twitter:image:alt" content={productData.brandName ? productData.brandName + " " + productDescription : productDescription} />
                <meta name="twitter:card" content="CARD_TYPE" />



            </Head>
        )
    }

    returnAddThisShare = () => {
        return <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5cbaabb8590da7f1"></script>
    }

    render() {
        return (
            <div className="productDetailsContainer">

                {
                    this.returnSEOContent()
                }

                <div className={this.state.loadingClass}>
                    <LogoAnimation text="Bringing back the Art in Architecture." />
                </div>

                <div className={this.state.mainClass}>
                    <div className="productDetailsContainerInnerLayer">
                        {
                            this.returnAddThisShare()
                        }
                        <section className="productImagesContainer">
                            <div className="productImages">
                                {this.returnComponent("Images")}
                            </div>

                        </section>

                        <section className="productDetailedDataContainer">
                            <div className="dataContainerOuterLayer">
                                <div className="productLineDetails">
                                    {this.returnProductLienName()}
                                </div>
                                <div className="dataContainerInnerLayer">
                                    {this.returnComponent("Data")}
                                </div>
                            </div>
                        </section>


                        <section className="productCostEstimatorContainer">
                            {this.returnComponent("Cost")}
                        </section>

                    </div>
                    <NewFooter />
                    {this.returnMyModal()}
                </div>

            </div>
        )
    };
};

const mapStateToProps = (state) => {
    return {
        navBarLoadingClass: state.navBarLoadingClass,
        responseData: state.responseDataFromAPI,
        openOrCloseModal: state.openOrCloseModal,
        isAuthed: state.isAuthed
    }
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        modalLoading,
        navBarLoadingAnimationShowHide,
        hitApi,
        reCustomizeProduct,
        checkForAuth
    }, dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(ProductDetails);