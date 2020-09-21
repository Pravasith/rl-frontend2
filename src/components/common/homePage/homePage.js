import React, { Component } from 'react';
import Head from 'next/head';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { api } from '../../../actions/apiLinks';
import { hitApi } from "../../../actions/generalActions";
import { reCustomizeProduct } from "../../../actions/productCustomizationActions";

import { Image } from "cloudinary-react";
import PublicId from "../../../factories/cloudinaryFactory";

import LogoAnimation from "../../animations/logoAnimation";
import { IndiaIcon, MagicHat } from '../../../assets/images';
import { WhiteButton } from '../../UX/uxComponents';

import NewFooter from '../../footer/newFooter';
import AdComponent from '../../adComponent/adComponent';
import HtmlSlider from '../../UX/htmlSlider';
import Categories from '../../../lib/productsCategory';

import shuffleArray from '../../../factories/shuffleArray';
import { alterFetchId } from '../../../factories/alterFetchId';
import { convertToKebabCase, handleCategoryName } from '../../../factories/handleNames';
import nameRephraser from '../../../factories/nameRephraser';

import "../../../assets/css/home_page.css";
import HomePageModals from './homePageModals';

import PaidAdModal from "../../adComponent/paidAdModal"
import Axios from 'axios';
import { decryptData } from '../../../factories/encryptDecrypt';

class HomePage extends Component {

    state = {
        loadingClass: 'loadingAnim hide',
        mainClass: 'mainClass',
        footerDynamicData: [],
        trendingProducts: [],
        headerContainer: "headerContainer",
        showMore: "Show More",
        dynamicProductComponent: "dynamicProductComponent"
    };

    componentDidMount = async () => {

        // this.checkForCookie()


        // HOT JAR // HOT JAR // HOT JAR // HOT JAR 
        // HOT JAR // HOT JAR // HOT JAR // HOT JAR 
        // HOT JAR // HOT JAR // HOT JAR // HOT JAR 

        const script = document.createElement("script")

        script.innerHTML = (function(h,o,t,j,a,r){
            h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
            h._hjSettings={hjid:1329801,hjsv:6};
            a=o.getElementsByTagName('head')[0];
            r=o.createElement('script');r.async=1;
            r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
            a.appendChild(r);
        })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');

        // <!-- Hotjar Tracking Code for https://rollinglogs.com -->


        // script.src = "https://use.typekit.net/foobar.js"
        script.async = true

        document.body.appendChild(script)

        // HOT JAR // HOT JAR // HOT JAR // HOT JAR 
        // HOT JAR // HOT JAR // HOT JAR // HOT JAR 
        // HOT JAR // HOT JAR // HOT JAR // HOT JAR 


        let topOffers
        // window.addEventListener('scroll', this.handleScrollAnime);
        // console.log(window.innerWidth)
        const tl = new TimelineMax()
        tl.set(".headerContainer", { opacity: 0, })
            .to(".headerContainer", 0.2, { opacity: 1, ease: "easeIn", })

        this.setState({
            windowWidth : window.innerWidth,
        })

        const get20TrendingProducts = () => {

            let dummyArray = []

            Categories.map((cat, i) => {
                dummyArray.push(
                    this.props.hitApi(api.TRENDING_20_PRODUCTS, "POST",
                        {
                            requestData: {
                                categoryId: cat.categoryId
                            },
                            message: "Requesting 20 products"
                        }
                    )
                )
            })

            return dummyArray
        }
        
        this.props.hitApi(
            api.TOP_OFFERS,
            "GET"
        )
        .then(res => {
            const { topOffers, topOffersGIFS } = res.payload.responsePayload

            this.setState({
                topOffers, 
                topOffersGIFS
            })
        })

        .catch(e => console.error(e))

        await Promise.all([
            ...get20TrendingProducts(),
        ])

        .then((res) => {
            let dummyArray = [], allTrendingData = []
            let imagesObj

            res.map((item, i) => {
                let { trending20 } = item.payload.responsePayload
                allTrendingData.push(
                    {
                        categoryId: trending20[0].productId.split("-")[0],
                        trending20: [...trending20]
                    }
                )

                imagesObj = {
                    categoryName: "Trending products",
                    categoryId: trending20[0].productId.split("-")[0],
                    imagesInCategory: [...trending20.map(productInfo => {
                        return {
                            itemCode: productInfo.productName,
                            textOnRibbonSatisfied: false,
                            imageURL: productInfo.productThumb,
                            title: productInfo.productName, //- optional
                            subTitle: productInfo.productTypeName
                        }
                    })]
                }

                dummyArray.push(imagesObj)
            })


            this.setState({
                trendingProducts: dummyArray,
                allTrendingData
            })
        })

        .catch(err => {
            console.error(err);
        });

        this.setState({
            // loadingClass: 'loadingAnim hide',
            // mainClass: 'mainClass',
            windowWidth : window.innerWidth,
            // topGIFS : 
        })

        this.checkAuth();
    }

    checkForCookie = () => {
        Axios.get(
            api.GET_COOKIE_DATA_NEWSLETTER,
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
            console.log(decryptData(res.data.responseData));
        })
        .catch(err => console.log(err))
    }

    componentWillUnmount = () => {
        // window.removeEventListener('scroll', this.handleScrollAnime);
    };

    handleScrollAnime = () => {
        const anime = new TimelineMax();
        if (window.scrollY > this.prev) {
            anime.set(".animation", { fontSize: 5 })
        }
        else if (window.scrollY < this.prev) {
            anime.set(".animation", { fontSize: 150 })
        }

        this.prev = window.scrollY;

    };

    populateOffersForSlider = () => {
        const { topOffers } = this.state;

        let imagesObj

        imagesObj = {
            // uniqueClassName: "productsOnDemand",
            imagesInCategory: [...topOffers.map((productInfo, k) => {
                return {
                    itemCode: productInfo.productTitle,
                    textOnRibbonSatisfied:  false,
                    imageURL: productInfo.productImageURL,
                    // title: productInfo.productTitle, //- optional
                    subTitle: productInfo.subTitle,
                    hrefLink : productInfo.productLink
                }
            })]
        }

        return imagesObj;
    };

    toIndianCurrency = (str) => {
        return str.toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            style: 'currency',
            currency: 'INR'
        })
    };

    returnPrice = (product) => {

        if (Number(product.productDiscount) > 0 && product.price !== 1) {
            return (
                <div className="cost-container">
                    <div className="real-cost">
                        <h1>{this.toIndianCurrency(product.price)}</h1>
                    </div>
                    <div className="offer-cost">
                        {/* <h1>
                            {
                                this.toIndianCurrency(product.price - Number(product.productDiscount) / 100 * product.price)
                            }
                        </h1> */}
                        <h3>
                            {
                                this.toIndianCurrency(product.price - Number(product.productDiscount) / 100 * product.price)
                            }
                        </h3>
                    </div>
                </div>
            )
        }
        
        else {
            if (product.price !== 1)
                return (
                    <div className="cost-container">
                        <div className="offer-cost">
                            <h1>
                                {this.toIndianCurrency(product.price)}
                            </h1>
                        </div>
                    </div>
                )
        }
    };

    returnDynamicFooterImages = () => {

        const { allTrendingData } = this.state

        if (allTrendingData) {
            if (allTrendingData.length === 33) {

                let trendingData = [...allTrendingData]

                let aggregatedArr = []

                const populateTop3Products = () => {
                    return trendingData.map((item, i) => {
                        aggregatedArr = [
                            ...aggregatedArr,
                            item.trending20[0],
                            item.trending20[1]
                        ]
                    })
                }

                populateTop3Products()

                const returnArray = () => {


                    return shuffleArray(aggregatedArr).map((item, i) => {

                        const giveCategoryName = () => {
                            let categoryName
                            Categories.map((x, k) => {
                                if (x.categoryId === item.productId.split("-")[0]) {
                                    categoryName = x.categoryName
                                }
                            })

                            return convertToKebabCase(categoryName)
                        }

                        return (
                            
                            <a
                                key={i}
                                href={

                                    `/products/${giveCategoryName()}/${item.subCategoryName}/${item.productTypeName}/${alterFetchId(
                                        item.productId.split("-")[0] + "-" +
                                        item.productId.split("-")[1] + "-" +
                                        item.productId.split("-")[2]
                                    )}`
                                }
                            >

                                <div

                                    className="productGalleryDynamicContainer">
                                    <div 
                                        className="imageContainer"
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
                                                ref="cloudinaryImage"
                                                >
                                                <Image
                                                    cloudName="rolling-logs"
                                                    alt={item.productName}
                                                    publicId={PublicId(item.productThumb)}
                                                    width={
                                                        this.refs.cloudinaryImage
                                                        ?
                                                        this.refs.cloudinaryImage.offsetWidth
                                                        :
                                                        260
                                                    }
                                                    height={
                                                        Math.floor(
                                                        (
                                                        this.refs.cloudinaryImage
                                                        ?
                                                        this.refs.cloudinaryImage.offsetWidth
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

                                        <div className="see-more-of">
                                            <div className="inner-see-more">
                                                <p>Click to see more products in '{nameRephraser(item.subCategoryName)}' category</p>
                                            </div>
                                        </div>

                                        {
                                            item.brandDetails
                                                ?
                                                <div className="brandLogoContainer">
                                                    <div className="brandLogoContainerInnerLayer">
                                                        <Image
                                                            cloudName="rolling-logs"
                                                            alt={item.brandDetails.brandName}
                                                            publicId={PublicId(item.brandDetails.brandImage)}
                                                            width={62}
                                                            // height = {Math.floor(320 * 1 / 1.618)}
                                                            crop="fit"
                                                            secure="true"
                                                        />


                                                    </div>
                                                </div>
                                                :
                                                null
                                        }

                                    </div>

                                    <div className="titleContainer">
                                        <h3>{item.productName}</h3>
                                        <p>
                                            {nameRephraser(item.productTypeName)}
                                        </p>
                                    </div>


                                    <div className="discount-container">
                                        {this.returnPrice(item)}
                                        {
                                            Number(item.productDiscount) > 0
                                                ?
                                                <div className="discount-offer-wrap">
                                                    <div className="discount-percent-wrap">
                                                        <h3>
                                                            {
                                                                Number(item.productDiscount) + "% off"
                                                            }
                                                        </h3>
                                                    </div>
                                                    <p className="you-save-wrap">
                                                        {
                                                            "You save " + this.toIndianCurrency(Number(item.productDiscount) / 100 * item.price)
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


                return (
                    <div className="dynamicImagesContainerInnerLayer">
                        {
                            returnArray()
                        }
                    </div>
                )


            }
        }

        else {
            return (
                <div className="outer-loader-container">
                    {this.returnInnerLoader()}
                </div>
            )
        }


    };

    returnProductImages = () => {

        return this.state.topOffersGIFS.map((item, i) => {
            return (

                <a 
                    key={i} 
                    href={item.hrefLink}
                    >
                    <div
                        className="productGalleryContainer"
                        >
                        <div className="imageContainer">
                            <div
                                className="upper-offer-image-wrap"
                            >
                                <Image
                                    cloudName="rolling-logs"
                                    alt={item.name}
                                    publicId={PublicId(item.imageURL)}
                                    // transformations
                                    // width="250" 
                                    // height= "180"
                                    // crop="scale"
                                    width={ this.state.windowWidth > 1500 ? 350 : 250 }
                                    height={ this.state.windowWidth > 1500 ? Math.floor(410 * 1 / 1.6180) : Math.floor(310 * 1 / 1.6180) }
                                    crop="fill"
                                    secure="true"

                                />
                            </div>

                        </div>
                        {/* <div className="titleContainer">
                            <h3>{item.productTitle}</h3>
                            {productTitle()}
                        </div> */}
                    </div>
                </a>
            )
        })

    };

    checkAuth = () => {
        let { isAuthenticated } = this.props.isAuthed;

        if (isAuthenticated !== undefined) {
            if (isAuthenticated !== true) {
                this.props.reCustomizeProduct(
                    "open",
                    {
                        dropdownModal: "dropdownInModal",
                        modalType: "subscribe",
                        requestFrom: "home"
                    }
                )
            }

            else {
                // window.open(`/product-detail/RoofProducts/Roofs/Roof%20systems/CAT0025-SC0074-PT0762-P0249`, "_blank");
            }

        }
    };

    populateCategoryTrendingData = (catIds, uniqueName) => {

        let { allTrendingData } = this.state
        let aggregatedArr = [], catData = []

        if (allTrendingData) {
            if (allTrendingData.length === 33) {
                allTrendingData.map((cat, i) => {

                    // console.log(cat)

                    catIds.map((item, j) => {
                        if (cat.categoryId === item) {
                            catData.push(cat.trending20)
                        }
                    })
                })

                let numberOfCatIds = catIds.length
                let c = 0


                while (c < numberOfCatIds) {
                    catData[c].map((item, i) => {

                        // console.log(item)

                        const giveCategoryName = () => {
                            let categoryName
                            Categories.map((x, k) => {
                                if (x.categoryId === item.productId.split("-")[0]) {
                                    categoryName = x.categoryName
                                }
                            })

                            return convertToKebabCase(categoryName)
                        }

                        aggregatedArr.push(
                            {
                                itemCode: item.productName,
                                textOnRibbonSatisfied: i < catData[c].length / 2 ? true : false,
                                imageURL: item.productThumb,
                                title: item.productName, //- optional
                                subTitle: nameRephraser(item.productTypeName),
                                hrefLink: `/products/${giveCategoryName()}/${item.subCategoryName}/${item.productTypeName}/${alterFetchId(
                                    item.productId.split("-")[0] + "-" +
                                    item.productId.split("-")[1] + "-" +
                                    item.productId.split("-")[2]
                                )}`,
                                strikeThroughText: item.price !== 1 ? this.toIndianCurrency(item.price) : null,
                                mainText: Number(item.productDiscount) > 0 && item.price !== 1 ? this.toIndianCurrency(Number(item.price) - Number(item.productDiscount) / 100 * item.price) : null,
                                discountPercentage: Number(item.productDiscount) ? Number(item.productDiscount) + "% off" : null,
                                priceOff: Number(item.productDiscount) && item.price !== 1 ? "You save " + this.toIndianCurrency(Number(item.productDiscount) / 100 * item.price) : null,
                            }
                        )
                    })

                    c++
                }

                shuffleArray(aggregatedArr)

                return (
                    <HtmlSlider
                        // imageWidth = "80"
                        uniqueClassName={uniqueName}
                        categoryData={
                            {
                                categoryName: "Top trending architectural products",
                                imagesInCategory: [
                                    ...aggregatedArr
                                ]
                            }
                        } // format of Item
                        textOnRibbon={"BEST SELLER"} // All caps
                        runFunction={() => { }}
                    />
                )
            }
        }

        else {
            return (
                <div className="outer-loader-container">
                    {this.returnInnerLoader()}
                </div>
            )
        }

    };

    topTrendingProducts = () => {
        let { allTrendingData } = this.state
        let aggregatedArr = []

        if (allTrendingData) {
            if (allTrendingData.length === 33) {
                allTrendingData.map((cat, i) => {

                    const giveCategoryName = () => {
                        let categoryName
                        Categories.map((x, k) => {
                            if (x.categoryId === cat.trending20[1].productId.split("-")[0]) {
                                categoryName = x.categoryName
                            }
                        })

                        return convertToKebabCase(categoryName)
                    }

                    aggregatedArr.push(
                        {
                            itemCode: cat.trending20[1].productName,
                            textOnRibbonSatisfied: false,
                            imageURL: cat.trending20[1].productThumb,
                            title: cat.trending20[1].productName, //- optional
                            subTitle: nameRephraser(cat.trending20[1].productTypeName),
                            hrefLink: `/products/${giveCategoryName()}/${cat.trending20[1].subCategoryName}/${cat.trending20[1].productTypeName}/${alterFetchId(
                                cat.trending20[1].productId.split("-")[0] + "-" +
                                cat.trending20[1].productId.split("-")[1] + "-" +
                                cat.trending20[1].productId.split("-")[2]
                            )}`
                        }
                    )
                })


                return (
                    <HtmlSlider
                        // imageWidth = "80"
                        uniqueClassName="trending-products"
                        categoryData={
                            {
                                categoryName: "Top trending architectural products",
                                imagesInCategory: [
                                    ...aggregatedArr
                                ]
                            }
                        } // format of Item
                        textOnRibbon={"BEST SELLER"} // All caps
                        runFunction={() => {
                            // this.checkAuth()
                        }}
                    />
                )
            }


        }

        else {
            return (
                <div className="outer-loader-container">
                    {this.returnInnerLoader()}
                </div>
            )
        }

    };

    returnInnerLoader = () => {
        let arr = [1, 2, 3, 4]
        return arr.map(x => (
            <div
                className="inner-loader-container"
                key={x}
            >
                <div className="inner-wrap-loader"></div>
            </div>
        ))
    };

    returnMailChimpScript = () => {
        return this.state.mailChimp ? this.state.mailChimp : null
    }

    openContainer = () => {
        let container = document.getElementById("show-container")
        let btn = document.getElementById("show-Button")

        if(this.state.dynamicProductComponent){
            this.setState({
                dynamicProductComponent: "dynamicProductComponent open",
                showMore: "Show less"
            })
            // document.getElementById("show-Button").style.padding = "0"
        }
        if(this.state.dynamicProductComponent === "dynamicProductComponent open"){
            this.setState({
                dynamicProductComponent: "dynamicProductComponent",
                showMore: "Show More"
            })

        }

    }

    returnSEOcontent = () => {
        return (
            <Head>

               <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
                <link rel="canonical" href={`https://www.rollinglogs.com`} />

                <title>Architectural and building products with installation in India - RollingLogs</title>
                <meta name="description" content="Rollinglogs provides architectural, building, construction products including installation services for all indoor and outdoor requirements."/>
                <meta 
                    name="keywords" 
                    content= "Plywood vendors near me, custom design cabinets, designer kitchen products in India, Architectural products online India, kitchen hobs online India, bathroom taps online India, architectural product vendors online in India, decor products online India"
                />
               
                <meta property="og:type" content="website" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:title" content="Rollinglogs | Architectural and building products with installation in India" />
                <meta property="og:site_name" content="RollingLogs" />
                <meta property="og:url" content={`https://www.rollinglogs.com`} />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image" content="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/rollinglogs-discover-architectural-products.png" />
                <meta property="og:image:alt" content={`Find Livingroom, Bathroom, Kitchen , Finishes , Outdoor and building products in India with installation services.`} />
                <meta property="og:description" content={`Rollinglogs provides architectural, building, construction products including installation services for all indoor and outdoor requirements.`} />

                <meta name="twitter:title" content="Rollinglogs | Architectural and building products with installation in India"  />
                <meta name="twitter:url" content={`https://www.rollinglogs.com`} />
                <meta name="twitter:site" content="@Rollinglogs" />
                <meta name="twitter:description" content={`Rollinglogs provides architectural, building, construction products including installation services for all indoor and outdoor requirements.`} />
                <meta name="twitter:image" content="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/rollinglogs-discover-architectural-products.png" />
                <meta name="twitter:image:alt" content={`Find Livingroom, Bathroom, Kitchen , Finishes , Outdoor and building products in India with installation services.`} />
                <meta name="twitter:card" content="CARD_TYPE" />

                <meta name="p:domain_verify" content="2a0025b804debc821c2117954ac0180c"/>
                <meta name="google-site-verification" content="nNzH2hs2_buhgapOxpGi9GvXSTT7JkJhGZblVVI2VuA" />


                {this.returnMailChimpScript()}
                

                {/* <script id="mcjs">!function(c,h,i,m,p){m=c.createElement(h),p=c.getElementsByTagName(h)[0],m.async=1,m.src=i,p.parentNode.insertBefore(m,p)}(document,"script","https://chimpstatic.com/mcjs-connected/js/users/08fdeb4d552aca3414b3cde03/a72f089d619e21c119754e727.js");</script> */}

            </Head>
        )
    };

    returnProductsSegregatedURL = (categoryId) => {
        let { allTrendingData } = this.state, productURL;

        if (allTrendingData) {
            if (allTrendingData.length === 33) {
                allTrendingData.map((item, i) => {
                    if (item.categoryId === categoryId) {
                        let subCatDetails = item.trending20[0];

                        return productURL = `/products/${convertToKebabCase(handleCategoryName(categoryId).categoryName)}/${subCatDetails.subCategoryName}/${subCatDetails.productTypeName}/${alterFetchId(subCatDetails.productId.split("-P")[0] + "-" + subCatDetails.productId.split("-")[2])}`
                    }
                })
            }
        }

        return productURL;
    };

    // returnModals = () => {
    //     const { dropdownModal, modalType } = this.props.openOrCloseModal;

    //     if (dropdownModal === "dropdownInModal") {
    //         if (modalType === "paidAd") return <PaidAdModal modalType={modalType} />;
    //         else if (modalType === "askForProduct") return <AskForProductModal modalType={modalType} />;
    //         // else return <ErrorModal/>
    //     }

    //     else return ""
    // };

    // returnModals = () => {
    //     const { dropdownModal, modalType } = this.props.openOrCloseModal;

    //     if (dropdownModal === "dropdownInModal") {
    //         if (modalType === "paidAd") return <PaidAdModal modalType={modalType} />;
    //         else if (modalType === "askForProduct") return <AskForProductModal modalType={modalType} />;
    //         // else return <ErrorModal/>
    //     }

    //     else return ""
    // };


    render() {
        return (
            <article className="homePageWrapper">

                {this.returnSEOcontent()}

                <div className={this.state.loadingClass}>
                    <LogoAnimation text="Bringing back the Art in Architecture." />
                </div>

                <section className={this.state.mainClass}>
                    <div className="homePageInnerLayer">
                        <div className="dataContainer zero">
                            <div className="dataContainerInnerLayer">
                                <div className="data-container-category-one">
                                    <div className={this.state.headerContainer}>
                                        <h3 className="you-design-we-execute">You design, we execute.</h3>
                                        <div className="amazing-products">
                                            <h3>Discover amazing</h3>
                                            <h1>Architectural products</h1>
                                        </div>
                                        <h3>
                                            from <span><IndiaIcon /> </span>
                                        </h3>
                                    </div>
                                    <div className="imagesContainer">
                                        {
                                            this.state.topOffersGIFS 
                                            ?
                                            <div className="imagesContainerInnerLayer">
                                                {this.returnProductImages()}
                                            </div>
                                            :
                                            <div className="outer-loader-container">
                                                {this.returnInnerLoader()}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dataContainer">
                            <div className="dataContainerInnerLayer">
                               
                                <div className="trendingComponent">
                                    <div className="headerContentSecondContainer">
                                        <h3>Best offers for you</h3>
                                    </div>
                                    <div className="sliderContainer">
                                        {
                                            this.state.topOffers 
                                            ?
                                            <HtmlSlider
                                                // imageWidth = "100"
                                                uniqueClassName="best-offers"
                                                categoryData={this.populateOffersForSlider()} // format of Item
                                                numberOfSlides={4} // Change the css grid properties for responsiveness
                                                textOnRibbon={"BEST SELLER"} // All caps
                                                runFunction={() => {
                                                    // this.checkAuth()
                                                }}
                                            />
                                            :
                                            <div className="outer-loader-container">
                                                {this.returnInnerLoader()}
                                            </div>
                                        }
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="dataContainer">
                            <div className="dataContainerInnerLayer">
                                <div className="trendingComponent">
                                    <div className="headerContentSecondContainer">
                                        <h3>Kitchen products </h3>
                                            <a href={this.returnProductsSegregatedURL("CAT0017")}>
                                                <div className="showButtonContainer">
                                                    <WhiteButton>
                                                        Show All
                                                    </WhiteButton>
                                                </div>
                                            </a>
                                    </div>
                                    <div className="sliderContainer">
                                        {this.populateCategoryTrendingData(["CAT0017"], "kitchen-products")}
                                    </div>
                                </div>

                                <div className="trendingComponent">
                                    <div className="headerContentSecondContainer">
                                        <h3>Living room and décor products </h3>
                                        {/* <div className="showButtonContainer">
                                            <WhiteButton>
                                                Show All
                                            </WhiteButton>
                                        </div> */}
                                    </div>
                                    <div className="sliderContainer">
                                        {this.populateCategoryTrendingData(["CAT0012", "CAT0004"], "living-decor-furniture-products")}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <AdComponent
                            imageSrc={
                                [
                                    "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/patio-bangalore-1366x768.png",
                                    "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/patio-bangalore-1024x768.png",
                                    "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/patio-bangalore-768x420.png",
                                    "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/patio-bangalore-420x600.png",
                                    "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/patio-bangalore-1920x1080.png"
                                ]
                            }
                            profileLink="https://rollinglogs.com/vendor/dinesh-chengappa/sLQiR8963970887451YVlIZ"
                            header="Patio Bangalore"
                            stateCity="Bangalore, India"
                            imageAlt="PATIO Bangalore, buy great planters and outdoor products."
                            profileImage="https://res.cloudinary.com/rolling-logs/image/upload/c_fit,h_100,w_100/regularImage-VEN-ZIlVY1547880793698RiQLs-sOI1qlCY8Y-1547881491001"
                            imageLink="https://rollinglogs.com/vendor/dinesh-chengappa/sLQiR8963970887451YVlIZ"
                            promoteAd="This is a promoted ad."
                            weeklyCost=" to display your ad here @Rs.2,500/week"
                            buttonLink="https://tscalehub.com"
                        />

                        <div className="dataContainer">
                            <div className="dataContainerInnerLayer">

                                <div className="trendingComponent">
                                    <div className="headerContentSecondContainer">
                                        <h3>Exterior walls, cladding, partitions related products</h3>
                                        {/* <div className="showButtonContainer">
                                            <WhiteButton>
                                                Show All
                                            </WhiteButton>
                                        </div> */}
                                    </div>
                                    <div className="sliderContainer">
                                        {this.populateCategoryTrendingData(["CAT0022", "CAT0007"], "ext-walls-partitions-products")}
                                    </div>
                                </div>

                                <div className="trendingComponent">
                                    <div className="headerContentSecondContainer">
                                        <h3>Bathroom products with installation</h3>
                                        <a href={this.returnProductsSegregatedURL("CAT0001")}>
                                            <div className="showButtonContainer">
                                                <WhiteButton>
                                                    Show All
                                                </WhiteButton>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="sliderContainer">
                                        {this.populateCategoryTrendingData(["CAT0001"], "bathroom-products")}
                                    </div>
                                </div>

                                <div className="trendingComponent">
                                    <div className="headerContentSecondContainer">
                                        <h3>Doors, windows, tiles related products</h3>
                                        {/* <div className="showButtonContainer">
                                            <WhiteButton>
                                                Show All
                                            </WhiteButton>
                                        </div> */}
                                    </div>
                                    <div className="sliderContainer">
                                        {this.populateCategoryTrendingData(["CAT0009", "CAT0005", "CAT0031"], "doors-windows-products")}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div
                            className="addProductDetailClass"
                            onClick={() => {
                                this.props.reCustomizeProduct(
                                    "open",
                                    {
                                        dropdownModal: "dropdownInModal",
                                        modalType: "askForProduct"
                                    }
                                )
                            }}
                        >
                            <AdComponent
                                imageSrc={
                                    [
                                        "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/ask-for-products-1366x768.png",
                                        "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/ask-for-products-1024x768.png",
                                        "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/ask-for-products-768x420.png",
                                        "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/ask-for-products-420x600.png",
                                        "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/ask-for-products-1920x1080.png"
                                    ]
                                }
                                imageAlt="PATIO Bangalore, buy great planters and outdoor products."
                            // imageLink=""
                            />
                        </div>
                        <div className="dataContainer">
                            <div className="dataContainerInnerLayer">
                                <div className="trendingComponent">
                                    <div className="headerContentSecondContainer">
                                        <h3>Lighting products</h3>
                                        <a href={this.returnProductsSegregatedURL("CAT0019")}>
                                            <div className="showButtonContainer">
                                                <WhiteButton>
                                                    Show All
                                                </WhiteButton>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="sliderContainer">
                                        {this.populateCategoryTrendingData(["CAT0019"], "lighting-products")}
                                    </div>
                                </div>

                                <div className="trendingComponent">
                                    <div className="headerContentSecondContainer">
                                        <h3>Outdoor products</h3>
                                        <a href={this.returnProductsSegregatedURL("CAT0021")}>
                                            <div className="showButtonContainer">
                                                <WhiteButton>
                                                    Show All
                                                </WhiteButton>
                                            </div>
                                        </a>
                                    </div>
                                    <div className="sliderContainer">
                                        {this.populateCategoryTrendingData(["CAT0021"], "outdoor-products")}
                                    </div>
                                </div>

                                <div className="trendingComponent">
                                    <div className="headerContentSecondContainer">
                                        <h3>Home automation and electrical products </h3>
                                        {/* <div className="showButtonContainer">
                                            <WhiteButton>
                                                Show All
                                            </WhiteButton>
                                        </div> */}
                                    </div>
                                    <div className="sliderContainer">
                                        {this.populateCategoryTrendingData(["CAT0006", "CAT0015"], "home-automation-electrical-products")}
                                    </div>
                                </div>

                                <div className="trendingComponent">
                                    <div className="headerContentSecondContainer">
                                        <h3>Top trending products and RollingLog's best sellers</h3>
                                    </div>
                                    <div className="sliderContainer">
                                        {
                                            this.topTrendingProducts()
                                        }
                                        <div className="trending-container"></div>

                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <AdComponent
                            imageSrc = {
                                [
                                    "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/patio-bangalore-1366x768.png",
                                    "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/patio-bangalore-1024x768.png",
                                    "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/patio-bangalore-768x420.png",
                                    "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/patio-bangalore-420x600.png",
                                    "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/responsive-backgrounds/patio-bangalore-1920x1080.png"
                                ]
                            }
                            profileLink="https://rollinglogs.com/vendor-profile/Dinesh-Chengappa/VEN-ZIlVY1547880793698RiQLs"
                            header="Patio Bangalore"
                            stateCity="Bangalore, India"
                            imageAlt="PATIO Bangalore, buy great planters and outdoor products."
                            profileImage="http://res.cloudinary.com/rolling-logs/image/upload/c_fit,h_100,w_100/regularImage-VEN-ZIlVY1547880793698RiQLs-sOI1qlCY8Y-1547881491001"
                            imageLink="https://rollinglogs.com/vendor-profile/Dinesh-Chengappa/VEN-ZIlVY1547880793698RiQLs"
                            promoteAd="This is a promoted ad."
                            weeklyCost="to display your ad here for Rs.1000/week"
                            buttonLink="https://tscalehub.com"
                        /> */}
                        {/* <div className="adComponentOuterLayer"
                            // style = {{backgroundImage: "url(" + " https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/banner-vendor-background.png" + ")" }}
                        >
                            <div className="adComponentInnerLayer">
                                <div className="headerContainer">
                                    <h1>Discover amazing planters and outdoor 
                                        products for your design project</h1>
                                    <div className="line"></div>
                                </div>
                                <div className="vendorInfoContainer">
                                    <div className="profileContainer">
                                        <div className="profileImageConatiner">
                                            <img src=" https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/banner-vendor-background.png" alt=""/>
                                        </div>
                                        <div className="profileDetailsContainer">
                                            <h1>By <span>PATIO Bangalore</span> Bangalore, India</h1>
                                        </div>
                                        <div className="buttonContainer">
                                            <WhiteButton>
                                                See all products
                                            </WhiteButton>
                                        </div>
                                    </div>
                                    <div className="adContainer">
                                        <div className="adPromotionContainer">
                                            <div className="adPromotionContainerInnerLayer">
                                                <h3>This is a promoted ad.</h3>
                                                <p> <span>Click here</span> to get display here for Rs.1000/week </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div className="dyanmicFooterContainer">
                            <div className="dynamicFooterInnerLayer">
                                <div className="headerComponent">
                                    <div className="svgImageSection">
                                        <MagicHat />
                                    </div>
                                    <h3>Other magical products for you</h3>
                                </div>
                                <div id="show-container" className={this.state.dynamicProductComponent}>
                                    <div className="dynamicProductComponentInnerLayer">
                                        <div className="dynamicImagesContainer">
                                            {this.returnDynamicFooterImages()}
                                        </div>
                                    </div>
                                    <div id="show-Button" className="showMoreButton">
                                        <div className="showButtonInnerLayer">
                                            <WhiteButton
                                                runFunction = {() => {
                                                    this.openContainer()
                                                }}
                                            >
                                                <p>{this.state.showMore}</p>
                                            </WhiteButton>
                                        </div>  
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* <div className="addthis_inline_share_toolbox"></div> */}
                        {/* <!-- Go to www.addthis.com/dashboard to customize your tools --> */}
                        <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5cbaabb8590da7f1"></script>

                        <NewFooter />
                    </div>
                </section>
                <div className="modalContainer">
                    {/* <PaidAdModal />
                    <AskForProductModal /> */}
                    <HomePageModals />
                </div>
            </article>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        isAuthed: state.isAuthed,
        // openOrCloseModal: state.openOrCloseModal
    }
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        hitApi,
        reCustomizeProduct
    }, dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(HomePage);