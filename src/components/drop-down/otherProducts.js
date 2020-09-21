import React, { Component } from 'react';

import { WhiteButton } from '../UX/uxComponents';
import { SelectList } from "../UX/uxComponents";

import { MinusIcon, PlusIcon, IndianIcon } from '../../assets/images';
import HtmlSlider from '../UX/htmlSlider';

import "../../assets/css/categories_dropdown.css";
import { TimelineMax } from 'gsap';

import { alterFetchId } from '../../factories/alterFetchId';
import { convertToKebabCase, handleCategoryName, handleNames } from '../../factories/handleNames';
import nameRephraser from '../../factories/nameRephraser';

// How to use this component



class OtherProductsDropDown extends Component {

    state = {
        categoryModal: "categoryModal",
        productTypesOuterLayer: "productTypesOuterLayer",
        categories: [],
        categorySelected: "",
        sCatsCollapseExpand: [],
        dropDownClass: "allProductsDropdownModalCategorySectionInnerLayer hide",
        dropDownLoaderClass: "loaderAnimationWrap",
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

    returnData = () => {
        const { categoryData } = this.props
        const { categoryName, productTypesOuterLayer, subCategoryName } = this.state;

        if (categoryData.length !== 0) {
            return categoryData.map((item, i) => {
                if (item.subCategories.length !== 0) {
                    return item.subCategories.map((subItem, j) => {

                        let fetchId = subItem.subCategoryId;

                        return (

                            <div
                                key={i + j}
                                className="subCategoryList"
                                >
                                <div className="subCategoryContainer">
                                    <div className="subCategoryHeaderContainer">
                                        {/* {this.returnRelevantIconBox(j)} */}

                                        {
                                            subItem.productTypes.length !== 0
                                                ?
                                                <a
                                                    href={
                                                        "/products/" +
                                                        handleNames(item, 1) + "/" +
                                                        handleNames(subItem, 2) + "/" +
                                                        handleNames(subItem.productTypes[0], 3) + "/" +
                                                        alterFetchId(fetchId)
                                                    }
                                                >
                                                    <div
                                                        className="headerSection"
                                                    >
                                                        <h3>{subItem.subCategoryName}</h3>
                                                        <div className={"line ptLine" + j}></div>
                                                    </div>
                                                </a>
                                                :
                                                null
                                        }

                                    </div>

                                    <div className={productTypesOuterLayer + " sCat" + j} >
                                        <div className="productTypes">
                                            {subItem.productTypes.map((product, k) => {
                                                let fetchId = product.productTypeId;

                                                if(product.productsCount > 0 )
                                                return (
                                                    <a
                                                        href={
                                                            "/products/" +
                                                            handleNames(item, 1) + "/" +
                                                            handleNames(subItem, 2) + "/" +
                                                            handleNames(product, 3) + "/" +
                                                            alterFetchId(fetchId)
                                                        }
                                                        key={k + i + j}
                                                    >
                                                        <div
                                                            className="productNames"
                                                            // style= {
                                                            //     product.productsCount > 0 
                                                            //     ? 
                                                            //     { opacity : 1 } 
                                                            //     : 
                                                            //     { display : "none" }
                                                            // }
                                                            >
                                                            <p 
                                                                // style={product.productsCount > 0 ? { opacity: "1", fontWeight: 600 } : { opacity: "0.5" }}
                                                                >
                                                                {/* {product.productTypeName} ({product.productsCount}) */}
                                                                {product.productTypeName} 
                                                            </p>
                                                        </div>
                                                    </a>
                                                )
                                            })
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }

                else return <div key={i} ></div>;
            })
        }

    };

    // returnLocation = () => {
    //     return [
    //         { label: "Bangalore, Karnataka", value: 1 },
    //         { label: "Hyderabad, Telangana", value: 2 },
    //         { label: "Mumbai, Maharastra", value: 3 },
    //         { label: "Kolkata, West Bengal", value: 4 }
    //     ];
    // };

    returnHtmlSlider = () => {
        const { trendingProductsData } = this.props;

        let imagesObj;

        trendingProductsData.map((item, i) => {

            const slicedArray = [...item.trendingProducts];

            imagesObj = {
                categoryName: "trendingProducts",
                imagesInCategory: [...slicedArray.map((productInfo, j) => {
                    let prodId = productInfo.productId.split("-"),
                        prodTypeId = `${prodId[0]}-${prodId[1]}-${prodId[2]}`;
                    return {
                        itemCode: productInfo.productId,
                        textOnRibbonSatisfied: false,
                        imageURL: productInfo.productThumb,
                        title: productInfo.productName, //- optional
                        subTitle: productInfo.productTypeName.split("-").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" "),

                        hrefLink: `/products/${convertToKebabCase(handleCategoryName(productInfo.productId.split("-")[0]).categoryName)}/${productInfo.subCategoryName}/${productInfo.productTypeName}/${alterFetchId(prodTypeId)}`
                    }
                })]
            }

        })

        return (
            <HtmlSlider
                imageWidth="280"
                uniqueClassName={Math.random().toString(36).replace(/[^a-z]+/g, '')}
                categoryData={imagesObj} // format of Item
                numberOfSlides={2} // Change the css grid properties for responsiveness
                textOnRibbon={"BEST SELLER"} // All caps
                runFunction={(data) => {
                    // console.log(`/products/${data.categoryName}/${data.subCategoryName}/${data.productTypeName}/${alterFetchId(data.itemCode)}`)
                    // window.open(`/products/${data.categoryName}/${data.subCategoryName}/${data.productTypeName}/${alterFetchId(data.itemCode)}`, "_self");
                }}
            />
        )
    };

    returnTopThreeImages = () => {
        const { trendingProductsData } = this.props;

        let topThreeImages;

        return trendingProductsData.map(item => {
            topThreeImages = [...item.trendingProducts.slice(0, 3)];

            return topThreeImages.map((prodImg, i) => {
                let prodId = prodImg.productId.split("-"),
                    prodTypeId = `${prodId[0]}-${prodId[1]}-${prodId[2]}`;
                return (
                    <div
                        key={i}
                        className="imageTagContainer"
                        onClick={() => window.open(`/products/${convertToKebabCase(handleCategoryName(prodImg.productId.split("-")[0]).categoryName)}/${prodImg.subCategoryName}/${prodImg.productTypeName}/${alterFetchId(prodTypeId)}`, "_blank")}
                    >
                        <img
                            src={prodImg.productThumb}
                            alt=""
                        />
                        <h1>{prodImg.productName}</h1>
                        <p>{prodImg.productTypeName.split("-").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" ")}</p>
                    </div>
                )
            })
        })
    }

    render() {
        return (
            <div className="returnOtherProductsInnerLayer">
                <section className="imagesInCategory">
                    <div className="imagesInCategoryInnerLayer">
                        <div className="headerSection">
                            <header>
                                <h3>Trending products</h3>
                                <div className="line"></div>
                            </header>
                            {/* <WhiteButton>
                                <p>Show All</p>
                            </WhiteButton> */}
                        </div>
                        <div className="imagesContainer">
                            <div className="sliderContainer">
                                {this.returnHtmlSlider()}
                            </div>
                            {/* <div className="imagesInnerContainer">
                                <div className="imageContainer">
                                    {this.returnTopThreeImages()}
                                </div>
                            </div> */}
                        </div>
                    </div>
                </section>

                <section className="productsInCategory">
                    <div className="headerSection">

                        <p>From vendors based out of</p>

                        <div className="flagIcon">
                            <IndianIcon />
                        </div>
                        {/* <div className="selectionCategory">
                            <SelectList
                                name="installerCostType"
                                // value={this.state.installerCostType}
                                // onChange={e =>
                                //     this.onChangeHandler(e, "installerCost")
                                // }
                                options={this.returnLocation()}
                            />
                        </div> */}
                    </div>
                    <div className="retunDataContainer">
                        <div className="retunDataContainerInnerLayer">
                            {this.returnData()}
                        </div>
                    </div>
                </section>
            </div>
        );
    };
}

export default OtherProductsDropDown;