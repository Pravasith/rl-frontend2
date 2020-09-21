import React, { Component } from "react";
import Head from "next/head";

import { Image } from "cloudinary-react";
import PublicId from "../../factories/cloudinaryFactory";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { api } from "../../actions/apiLinks";
import { reCustomizeProduct } from "../../actions/productCustomizationActions";
import { navBarLoadingAnimationShowHide, hitApi } from "../../actions/generalActions";

import nameRephraser from "../../factories/nameRephraser";
import { getBackFetchId, alterFetchId } from "../../factories/alterFetchId";
import { convertToKebabCase, handleProdTypeName } from "../../factories/handleNames";

import NewFooter from '../footer/newFooter';

import LogoAnimation from "../animations/logoAnimation";
import { GradientButton, WhiteButton } from "../UX/uxComponents";
import { SmallModalCloseButton, NavBarLoadingIcon, ModalCloseButton } from "../../assets/images/index";
import { NavigatorArrow, MinusIcon, PlusIcon } from "../../assets/images";

import "../../assets/css/products_segregated.css";

class ProductsSegregated extends Component {

    state = {
        loadingClass: 'loadingAnim',
        mainClass: 'mainClass hide',
        categorisedData: [],
        categoryName: "",
        categoryId: "",
        subCategoryName: "",
        subCategoryId: "",
        sCatsCollapseExpand: [],
        productTypeName: "",
        productTypeId: "",
        productTypeSelected: "",
        productTypeData: [],
        productTypesContainer: "productTypesContainer",
        modalPage: "modalPage hide",
        chatroom: "chatroom-outer-container hide",

        loadingMore: "loading-more-wrap hide",

        setNumber: 0,

        allProductsShown: false,
    };

    componentDidMount = async () => {

        this.refs.outerScrollProductType.addEventListener("scroll", this.handleScroll);

        const { catName, subCatName, productTypeName } = this.props

        const fetchId = getBackFetchId(this.props.fetchId)
        let isSubCat = false, analyticsDataToBackend

        let categoryId = fetchId.split("-")[0],
            subCategoryId = categoryId + "-" + fetchId.split("-")[1],
            productTypeId

        if (fetchId.length > 14) {
            productTypeId = fetchId

           
        }

        else{
            isSubCat = true
        }

        analyticsDataToBackend = {
            isSubCat,
            fetchId,
            subCategoryName : subCatName,
            categoryName : catName,
            productTypeName : productTypeName
        }

        const rawData = { categoryId: categoryId }

        let dataToSend = {
            fetchId: fetchId,
            productSetNumber: this.state.setNumber
        }


        let theResponseDataObj = {}

        await Promise.all([
            this.props.hitApi(api.GET_CATEGORISED_PRODUCTS_DATA, "POST", {
                requestData: rawData,
                message: "Requesting products"
            }),
            this.props.hitApi(
                api.GET_10_MORE_PRODUCTS,
                "POST",
                {
                    requestData: dataToSend,
                    message: "All units, one o in pursuit, calling back up, limb shots only!"
                }
            ),
            this.props.hitApi(
                api.DEEP_ANALYTICS,
                "PUT",
                {
                    requestData: analyticsDataToBackend,
                    message: "Deep analytics commencing in T-3, T-2, T-1, brace for impact!"
                }
            )
        ])
        .then(data => {
            theResponseDataObj = data.reduce((all, item) => {
                all = {
                    ...all,
                    ...item.payload.responsePayload
                }
                return all
            }, {})
        })
        .catch(err => {
            console.error(err)
        })

        // console.log(theResponseDataObj.setOf10Products)

        this.setState({
            loadingClass: 'loadingAnim  hide',
            mainClass: 'mainClass',
            categorisedData: theResponseDataObj.subCategories,
            setOf10Products: theResponseDataObj.setOf10Products,
            categoryName: catName,
            subCategoryName: subCatName,
            subCategoryId,
            productTypeId
        });
        this.scrollToSelectedItem();
        this.handleName()

        window.addEventListener("scroll", this.hideBar);
    }

    componentWillUnmount = () => {
        this.refs.outerScrollProductType.removeEventListener('scroll', this.handleScroll);
        window.removeEventListener("scroll", this.hideBar);
    }

    toIndianCurrency = (str) => {
        return str.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'INR'
        })
    }

    returnPrice = (product) => {

        if (Number(product.discount) > 0 && product.basePrice !== 1) {
            return (
                <div className="cost-container">
                    <div className="real-cost">
                        <h1>{this.toIndianCurrency(product.basePrice)}</h1>
                    </div>
                    <div className="offer-cost">
                        <h3>
                            {
                                this.toIndianCurrency(product.basePrice - Number(product.discount) / 100 * product.basePrice)
                            }
                        </h3>
                    </div>
                </div>
            )
        }


        else {
            if (product.basePrice !== 1)
                return (
                    <div className="cost-container">
                        <div className="offer-cost">
                            <h1>
                                {this.toIndianCurrency(product.basePrice)}
                            </h1>
                        </div>
                    </div>
                )
        }
    }

    returnColorsFinishes = (prod) => {
        let colorFinishArray = prod.colorOptions.concat(prod.finishingOptions)
        
        return colorFinishArray.map((item, i) => {
            if(item){
                if(item.colorName){
                    return (
                        <div 
                            key = {i + " " + item.colorName}
                            className="color-preview-wrap"
                            title = {item.colorName}
                            key={item.colorName + i}
                            >
                            <div 
                                className="color-inner-wrap"
                                style = {{
                                    background : item.colorCode
                                }}
                                >
                            </div>
                        </div>
                    )
                }

                if(item.finishName){
                    return (
                        <div 
                            key = {i + " " + item.finishName}
                            className="finish-preview-wrap"
                            title= {item.finishName}
                            key = {item.finishName + i}
                            >
                            <Image
                                cloudName="rolling-logs"
                                alt={item.finishName}
                                publicId={PublicId(item.finishImage)}
                                width={20}
                                height={20}
                                // height = {Math.floor(320 * 1 / 1.618)}
                                crop="fill"
                                secure="true"
                            />
                        </div>
                    )
                }
            }
        })
    }

    returnProducts = () => {

        let { categoryName, subCategoryName, productTypeName, setOf10Products } = this.state

        if (setOf10Products) {
            return setOf10Products.map((product, i) => {
                return (
                    <a
                        key={i}
                        href={
                            // this.checkAuth(
                            //     categoryName,
                            //     subCategoryName,
                            //     productTypeName,
                            //     product.productId
                            // )
                            product.productId ? `/product-detail/${categoryName}/${subCategoryName}/${convertToKebabCase(productTypeName)}/${alterFetchId(product.productId)}` : ""
                        }
                    >
                        <div
                            className="productGalleryDynamicContainer"
                            key={i}
                            >
                            <div className="imageContainerProdSeg"
                                 ref = "imageWrapFooter"
                                 style = {
                                     this.refs.imageWrapFooter
                                     ?
                                     {
                                         height : this.refs.imageWrapFooter.offsetWidth / 1.618
                                     }
                                     :
                                     {}
                                 }
                            >
                                <div className="image-inner-container">
                                    <div 
                                        className="image-wrap-dummy"
                                        ref = "imageWrapDummy"
                                        >
                                        <Image
                                            cloudName="rolling-logs"
                                            alt={product.productName}
                                            publicId={PublicId(product.productThumbImage)}
                                            width={
                                                this.refs.imageWrapDummy
                                                ?
                                                this.refs.imageWrapDummy.offsetWidth
                                                :
                                                260
                                            }
                                            height={
                                                Math.floor(
                                                    (
                                                        this.refs.imageWrapDummy
                                                        ?
                                                        this.refs.imageWrapDummy.offsetWidth
                                                        :
                                                        260
                                                    )
                                                    * 1 / 1.618)
                                            }
                                            crop="fit"
                                            secure="true"
                                        />
                                    </div>
                                </div>

                                {
                                    product.brandImage !== "" && product.brandImage !== null
                                        ?
                                        <div className="brandLogoContainer">
                                            <div className="brandLogoContainerInnerLayer">
                                                <Image
                                                    cloudName="rolling-logs"
                                                    alt={product.brandName}
                                                    publicId={PublicId(product.brandImage)}
                                                    width={62}
                                                    // height = {Math.floor(320 * 1 / 1.618)}
                                                    crop="fill"
                                                    secure="true"
                                                />
                                            </div>
                                        </div>
                                        :
                                        null
                                }

                            </div>

                            <div className="titleContainerProd">
                                <h1>{product.productName }</h1>
                                <p>
                                    {

                                        product.productDescription.length > 150
                                        ?
                                        product.productDescription.split("").filter((x, i) => i < 150).join("") + "..."
                                        :
                                        product.productDescription
                                    }
                                </p>
                                {/* <p className="installation-cost">
                                    Installation <span>{`@ ₹${product.productInstallationServiceCost} per sq.ft.`}</span>
                                </p> */}
                            </div>

                            <div className="color-previews">
                                { this.returnColorsFinishes(product) }
                            </div>


                            <div className="discount-container">
                                { this.returnPrice(product) }
                                {
                                    Number(product.discount) > 0
                                    ?
                                    <div className="discount-offer-wrap">
                                        <div className="discount-percent-wrap">
                                            <h3>
                                                {
                                                    Number(product.discount) + "% off"
                                                }
                                            </h3>
                                        </div>
                                        <p className="you-save-wrap">
                                            {
                                                "You save " + this.toIndianCurrency(Number(product.discount) / 100 * product.basePrice)
                                            }
                                        </p>
                                    </div>
                                    :
                                    <div></div>
                                }
                            </div>
                        </div>
                    </a>
                )
            })
        }

        else {
            return <p>Oops.. there has been an error, please try again later.</p>
        }
    }

    showAnimationAndGet10MoreProducts = (setNumber) => {

        let dataToSend = {
            fetchId: getBackFetchId(this.props.fetchId),
            productSetNumber: setNumber
        }

        this.props.hitApi(
            api.GET_10_MORE_PRODUCTS,
            "POST",
            {
                requestData: dataToSend,
                message: "All units, one o in pursuit, calling back up, limb shots only!"
            }
        )
        .then(res => {

            let productsSetOf10 = this.props.responseData.responsePayload

            if (productsSetOf10.setOf10Products.length !== 10) {

                if (productsSetOf10.setOf10Products.length > 0) {
                    this.setState({
                        allProductsShown: false,
                        setOf10Products: [...this.state.setOf10Products, ...productsSetOf10.setOf10Products]
                    })
                }

                else {
                    this.setState({
                        allProductsShown: true,
                        loadingMore: "loading-more-wrap hide",
                    })
                }

            }

            else (
                this.setState({
                    allProductsShown: false,
                    setOf10Products: [...this.state.setOf10Products, ...productsSetOf10.setOf10Products]
                })
            )
        })
        .catch(e => {
            console.log(e)
        })
    }

    loadMoreItems = () => {

        if (!this.state.allProductsShown) {
            this.setState({
                setNumber: this.state.setNumber + 9,
                loadingMore: "loading-more-wrap",
            })
        }

        this.showAnimationAndGet10MoreProducts(this.state.setNumber)

    }

    handleScroll = () => {

        if (
            this.refs.outerScrollProductType.scrollTop + this.refs.outerScrollProductType.clientHeight >=
            this.refs.outerScrollProductType.scrollHeight
        ) {
            this.loadMoreItems();
            // console.log(this.refs.outerScrollProductType.scrollTop + this.refs.outerScrollProductType.clientHeight);
        }

    }

    // openSlider = () => {
    //     document.getElementById("slider").style.width = "50%";
    // };


    scrollToSelectedItem = () => {
        const { productTypeId, subCategoryId } = this.state;

        let prodTypeElmnt = document.getElementById(productTypeId),
            subCategoryElmnt = document.getElementById(subCategoryId)

        if (prodTypeElmnt !== null) prodTypeElmnt.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" })
        else subCategoryElmnt.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" })
    }

    handleName = () => {
        const { categorisedData, subCategoryId, productTypeId } = this.state;

        categorisedData.map(subCategories => {
            if (productTypeId !== undefined) {
                subCategories.productTypes.map(product => {
                    if (productTypeId === product.productTypeId) this.setState({ productTypeName: product.productType });
                })
            }

            else {
                if (subCategoryId === subCategories.subCategoryId) {
                    const { productType, productTypeId } = subCategories.productTypes[0];
                    this.setState({ productTypeId, productTypeName: productType });
                }
            }
        })
    };

    hideProductTypes = (index) => {
        const tl = new TimelineMax()

        tl
            .to(".sCat" + index, 0.1, { opacity: 0 })
            .to(".ptLine" + index, 0.1, { width: 0 })
            .set(".sCat" + index, { display: "none" })

        let dummyArray = [...this.state.sCatsCollapseExpand]

        if (!dummyArray.includes("sCat" + index)) {
            dummyArray.push("sCat" + index)
        }

        this.setState({
            sCatsCollapseExpand: dummyArray
        })
    };

    showProductTypes = (index) => {
        const tl = new TimelineMax()

        tl
            .set(".sCat" + index, { display: "flex" })
            .set(".ptLine" + index, { width: 0 })
            .to(".sCat" + index, 0.1, { opacity: 1 })
            .to(".ptLine" + index, 0.1, { width: "50%" })

        let dummyArray = [...this.state.sCatsCollapseExpand]

        dummyArray.splice(dummyArray.indexOf("sCat" + index), 1)

        this.setState({
            sCatsCollapseExpand: dummyArray
        })
    };

    returnRelevantIconBox = (index) => {
        let collapseOrExpandIcon = "collapseActive"

        this.state.sCatsCollapseExpand.map((item, i) => {
            if ("sCat" + index === item) {
                collapseOrExpandIcon = "expandActive"
            }
        })

        if (collapseOrExpandIcon === "collapseActive")
            return (
                <div
                    className="iconBox"
                    onClick={() => {
                        this.hideProductTypes(index)
                    }}
                >
                    <MinusIcon />
                </div>
            )

        else if (collapseOrExpandIcon === "expandActive")
            return (
                <div
                    className="iconBox"
                    onClick={() => {
                        this.showProductTypes(index)
                    }}
                >
                    <PlusIcon />
                </div>
            )
    };

    returnSegregatedSubCategoryData = () => {
        const { categorisedData, categoryName, subCategoryId, productTypeId } = this.state;
        // let dummyArray = [];

        const productTypes = (subCategory) => {
            return subCategory.productTypes.map((prodType, k) => {
                if(prodType.productsCount > 0)
                return (
                    <a
                        href={productTypeId ? `/products/${categoryName}/${convertToKebabCase(subCategory.subCategoryName)}/${convertToKebabCase(prodType.productTypeName)}/${alterFetchId(prodType.productTypeId)}` : ""}
                        key={k}
                    >
                        <div
                            id={prodType.productTypeId}
                            key={k}
                            className="dataSectionProductTypeName"
                            onClick={() => {
                                //     dummyArray = prodType.products

                                this.setState({
                                    //         productTypeData: dummyArray,
                                    productTypeId: prodType.productTypeId,
                                    //         productTypeSelected: prodType.productType,
                                    //         subCategoryName: subCategory.subCategoryName,
                                    //         subCategoryId: subCategory.subCategoryId,
                                    //         productTypeName: prodType.productType
                                })
                            }}
                        >
                            <p 
                                className={productTypeId === prodType.productTypeId ? "highLightSubCategory" : ""}
                                >
                                {/* {prodType.productType + " (" + prodType.productsCount + ")"} */}
                                { prodType.productType }
                            </p>
                        </div>
                    </a>
                )
            })
        };

        if (categorisedData)
            return categorisedData.map((subCategories, i) => {
                return (
                    <div key={i} className="subCategoryHead">
                        <div className="expansionButtonContainier">
                            <a
                                href={
                                    productTypeId ?
                                        `/products/${categoryName}/${convertToKebabCase(subCategories.subCategoryName)}/${convertToKebabCase(subCategories.productTypes[0].productTypeName)}/${alterFetchId(subCategories.productTypes[0].productTypeId)}`
                                        : ""}
                            >
                                <div className={subCategoryId === subCategories.subCategoryId ? "highLightSubCategory" : ""}>
                                    <h1 id={subCategories.subCategoryId}>{subCategories.subCategoryName}</h1>
                                </div>
                            </a>
                            {this.returnRelevantIconBox(i)}
                        </div>
                        <div className={this.state.productTypesContainer + " sCat" + i}>
                            {productTypes(subCategories)}
                        </div>
                    </div>
                )
            })
    };

    // checkAuth = (categoryName, subCategoryName, productTypeName, pId) => {

    //     let { isAuthenticated } = this.props.isAuthed

    //     // console.log(pId)

    //     // let productId = alterFetchId(pId)

    //     // productId = productId + pId.split("-")[3]

    //     if (isAuthenticated !== undefined) {
    //         if (isAuthenticated !== true) {

    //         }

    //         else {
    //             return (pId ? `/product-detail/${categoryName}/${subCategoryName}/${convertToKebabCase(productTypeName)}/${alterFetchId(pId)}` : "")
    //         }
    //     }
    // }

    returnLoadingMoreAnim = () => {
        return (
            <div className={this.state.loadingMore}>
                <div className="icon-box">
                    <NavBarLoadingIcon />
                </div>

                <h3>Loading more...</h3>
            </div>
        )
    }


    returnSegregatedProductTypeData = () => {
        const {
            categorisedData,
            categoryName,
            subCategoryId,
            subCategoryName,
            productTypeId,
            productTypeName,
            productTypeSelected,
            productTypeData
        } = this.state;

        return (
            <div className="productTypeContainer">
                <div className="product-type-container-header-outer-layer">
                    <div className="productTypeContainerHeader">
                        <div className="product-type-container-header-one">
                            <div className="product-category-name-container">
                                <h3>{nameRephraser(categoryName)}</h3>
                                <div className="iconBox">
                                    <p>/</p>
                                </div>
                                <a
                                    href={
                                        subCategoryId ?
                                            `/products/${categoryName}/${subCategoryName}/${handleProdTypeName(categorisedData, subCategoryId)}/${alterFetchId(subCategoryId)}`
                                            : ""
                                    }
                                >
                                    <h3>{nameRephraser(subCategoryName)}</h3>
                                </a>
                                <div className={productTypeName !== "" ? "iconBox" : "hide"}>
                                    {/* <NavigatorArrow /> */}
                                    <p>/</p>
                                </div>
                                <a
                                    href={
                                        productTypeId ?
                                            `/products/${categoryName}/${subCategoryName}/${convertToKebabCase(productTypeName)}/${alterFetchId(productTypeId)}`
                                            : ""
                                    }
                                >
                                    <h3>{nameRephraser(productTypeName)}</h3>
                                </a>
                            </div>
                            {/* <div 
                                className="live-chat-container"
                                onClick={() => {
                                    this.openSlider()
                                    this.setState({
                                        chatroom: "chatroom-outer-container",
                                    })
                                }}
                            >
                                <div className="chat-container-inner-layer">
                                    <div className="chat-indicator"/>
                                    <p>Live enquiries</p>
                                </div>
                            </div> */}
                        </div>
                        <div className="product-type-container-header-two">
                            <GradientButton
                                runFunction={() => {
                                    this.setState({
                                        modalPage: "modalPage"
                                    })
                                }}
                            >
                                See more {this.props.catName}
                            </GradientButton>
                        </div>
                    </div>
                </div>

                <div
                    className="outer-scroll-product-type"
                    ref="outerScrollProductType"
                >
                    <div
                        className="productTypeContainerContent"

                    >
                        <div className="productsContainerOuterLayer">
                            {this.returnProducts()}

                        </div>
                    </div>
                    {this.returnLoadingMoreAnim()}
                </div>

            </div>
        )
    };

    returnSegregatedModal = () => {
        const { categorisedData, categoryName, subCategoryId, productTypeId } = this.state;
        let dummyArray = [];

        const productTypes = (subCategory) => {
            return subCategory.productTypes.map((prodType, k) => {
                if(prodType.productsCount > 0)
                return (
                    <a
                        href={productTypeId ? `/products/${categoryName}/${convertToKebabCase(subCategory.subCategoryName)}/${convertToKebabCase(prodType.productTypeName)}/${alterFetchId(prodType.productTypeId)}` : ""}
                        key={k}
                    >
                        <div
                            key={k}
                            className="dataSectionProductTypeName"
                            onClick={() => {
                                dummyArray = prodType.products

                                this.setState({
                                    productTypeId: prodType.productTypeId,
                                })
                            }}
                        >
                            <p 
                                className= {productTypeId === prodType.productTypeId ? "highLightSubCategory" : ""}
                                >
                                {/* {prodType.productType + " (" + prodType.productsCount + ")"} */}
                                { prodType.productType }
                            </p>
                        </div>
                    </a>
                )
            })
        };

        const categoryData = () => {
            return categorisedData.map((subCategories, i) => {
                return (
                    <div
                        key={i}
                        className="subCategoryHead"
                    >
                        <div className="expansionButtonContainier">
                            <a
                                key={i}
                                href={
                                    productTypeId ?
                                        `/products/
                                        ${categoryName}/
                                        ${convertToKebabCase(subCategories.subCategoryName)}/
                                        ${convertToKebabCase(subCategories.productTypes[0].productTypeName)}/
                                        ${alterFetchId(subCategories.productTypes[0].productTypeId)}`
                                        : ""
                                    }
                            >
                                <h1 className={subCategoryId === subCategories.subCategoryId ? "highLightSubCategory" : ""}>
                                    {subCategories.subCategoryName}
                                </h1>
                            </a>

                            {this.returnRelevantIconBox(i)}

                        </div>
                        <div className={this.state.productTypesContainer + " sCat" + i}>
                            {productTypes(subCategories)}
                        </div>
                        <div className="line"></div>
                    </div>
                )
            })

        }

        return (
            <div className={this.state.modalPage}>
                <div
                    className="modalCloseButton"
                    onClick={() => {
                        this.setState({
                            modalPage: "modalPage hide"
                        })
                    }}
                >
                    {/* <SmallModalCloseButton /> */}
                    <ModalCloseButton />
                </div>
                <div className="modalPageOuterLayer">
                    <div className="modalPageInnerLayer">
                        {categoryData()}
                    </div>
                </div>
            </div>
        )
    }

    returnSEOcontent = () => {
        const { catName, subCatName, productTypeName, fetchId } = this.props;

        return (
            <Head>

                <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
                <link rel="canonical" href={`https://www.rollinglogs.com/products/${catName}/${subCatName}/${productTypeName}/${fetchId}`} />


                <title>{`${nameRephraser(productTypeName)} online in India at Rollinglogs.com | ${nameRephraser(subCatName)}`}</title>
                <meta name="description" content={`${nameRephraser(productTypeName)}: Discover architectural products like ${nameRephraser(subCatName)} in India with delivery and installation services at Rollinglogs.com.`} />
                <meta
                    name="keywords"
                    content={
                        nameRephraser(productTypeName).toLowerCase() + ", " +
                        nameRephraser(subCatName).toLowerCase() + ", " +

                        nameRephraser(productTypeName).toLowerCase() + " online India" + ", " +
                        nameRephraser(subCatName).toLowerCase() + " online India" + ", " +

                        nameRephraser(productTypeName).toLowerCase() + " vendors in India" + ", " +
                        nameRephraser(subCatName).toLowerCase() + " vendors in India" + ", " +

                        "architectural " + nameRephraser(productTypeName).toLowerCase() + ", " +
                        "designer " + nameRephraser(productTypeName).toLowerCase()
                    }
                />

                <meta property="og:type" content="website" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:title" content={`${nameRephraser(productTypeName)} online in India at Rollinglogs.com | ${nameRephraser(subCatName)}`} />
                <meta property="og:site_name" content="RollingLogs" />
                <meta property="og:url" content={`https://www.rollinglogs.com/products/${catName}/${subCatName}/${productTypeName}/${fetchId}`} />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image" content="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/rollinglogs-discover-architectural-products.png" />
                <meta property="og:image:alt" content={`${nameRephraser(productTypeName)}: Discover architectural products like ${nameRephraser(subCatName)} in India with delivery and installation services at Rollinglogs.com.`} />
                <meta property="og:description" content={`${nameRephraser(productTypeName)}: Discover architectural products like ${nameRephraser(subCatName)} in India with delivery and installation services at Rollinglogs.com.`} />

                <meta name="twitter:title" content={`${nameRephraser(productTypeName)} online in India at Rollinglogs.com | ${nameRephraser(subCatName)}`} />
                <meta name="twitter:url" content={`https://www.rollinglogs.com/products/${catName}/${subCatName}/${productTypeName}/${fetchId}`} />
                <meta name="twitter:site" content="@Rollinglogs" />
                <meta name="twitter:description" content={`${nameRephraser(productTypeName)}: Discover architectural products like ${nameRephraser(subCatName)} in India with delivery and installation services at Rollinglogs.com.`} />
                <meta name="twitter:image" content="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/rollinglogs-discover-architectural-products.png" />
                <meta name="twitter:image:alt" content={`${nameRephraser(productTypeName)}: Discover architectural products like ${nameRephraser(subCatName)} in India with delivery and installation services at Rollinglogs.com.`} />
                <meta name="twitter:card" content="CARD_TYPE" />



            </Head>
        )
    }

    render() {
        return (
            <div className="segregatedProductsContainer">

                {this.returnSEOcontent()}

                <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5cbaabb8590da7f1"></script>

                <div className={this.state.loadingClass}>
                    <LogoAnimation text="Bringing back the Art in Architecture." />
                </div>

                <div className={this.state.mainClass}>
                    <div className="segregated-product-container-layer-2">
                        <section className="segregatedSubcategoriesDataContainer">
                            <div className="dataContainer">
                                <div className="segregatedSubcategoriesDataContainerOuterLayer">
                                    <div className="segregatedSubcategoriesInnerLayer">
                                        {this.returnSegregatedSubCategoryData()}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="segregatedProductTypeDataContainer">
                            <div className="dataContainerOuterLayer">
                                <div className="segregatedProductTypeInnerLayer">
                                    {this.returnSegregatedProductTypeData()}
                                </div>
                            </div>
                        </section>
                    </div>
                    {this.returnSegregatedModal()}
                    <div id="slider" className={this.state.chatroom}>
                        <div className="chatroom-inner-container">
                            <div 
                                className="close-button-container"
                                onClick={() => {
                                    this.setState({
                                        chatroom: "chatroom-outer-container hide"
                                    })
                                }}
                            >
                                <ModalCloseButton/>  
                            </div>
                            <div className="chat-header-container">
                                <h3>Live enquiry panel</h3>
                            </div>
                            <div className="chatroom-content-container">
                                <div className="chatbox-container">
                                    <div className="chatbox-container-inner-layer">
                                        <div className="msg-recieved-container">
                                            <div className="msg-recieved-inner-container">
                                                <div className="img-container"></div>
                                                <div className="recieved-name-container">
                                                    <h3>Ravi shankar</h3>
                                                    <p> 
                                                        What is the cost of cutting plywood?
                                                        How much plywood would
                                                        this design take? 
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="msg-sent-container">
                                            <div className="msg-sent-inner-container">
                                                <div className="sent-name-container">
                                                    <h3>Rolling logs</h3>
                                                    <p> 
                                                         What is the cost of cutting plywood? 
                                                         How much plywood would
                                                         this design take? 
                                                         What is the cost of cutting plywood? 
                                                         How much plywood would
                                                         this design take? 
                                                    </p>
                                                </div>
                                                <div className="img-container"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="bubble-msg-container">
                                    <div className="bubble-msg-inner-container">
                                        <div className="bubble-content">
                                            <p>How much is per sq. ft. cost?</p>
                                        </div>  
                                    </div>
                                </div>
                                <div className="textarea-container-outer-layer">
                                    <div className="text-area-container-inner-layer">
                                        <div className="text-area-content-container">
                                            <textarea 
                                            rows="5" 
                                            cols="85"
                                            placeholder="Type your query here..."
                                            >

                                            </textarea>
                                        </div>
                                        <div className="send-button-container">
                                            <WhiteButton>
                                                Send
                                            </WhiteButton>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        navBarLoadingClass: state.navBarLoadingClass,
        responseData: state.responseDataFromAPI,
        isAuthed: state.isAuthed
    }
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        navBarLoadingAnimationShowHide,
        hitApi,
        reCustomizeProduct
    }, dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(ProductsSegregated);