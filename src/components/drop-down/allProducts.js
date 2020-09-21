import React, { Component } from 'react';


import HtmlSlider from "../UX/htmlSlider";
import { IndianIcon, NavBarLoadingIcon, StarIcon } from '../../assets/images';

import { MinusIcon, PlusIcon } from '../../assets/images';
import { alterFetchId } from '../../factories/alterFetchId';
import { convertToKebabCase, handleCategoryName, handleNames } from '../../factories/handleNames';

class detailedCategoryData extends Component {

    state = {
        allProdCatSelected: this.props.navBarWholeCategoryData[0],
        highLightCategory: this.props.navBarWholeCategoryData[0].categoryId,
        sCatsCollapseExpand: [],
        toggler: 'y'
    };

    componentDidMount = () => {
        this.handleDefaultValue();
    };

    changeToggler = () => {
        const { toggler } = this.state

        if (toggler === 'x')
            this.setState({ toggler: 'y' })

        else
            this.setState({ toggler: 'x' })
    }

    handleDefaultValue = () => {
        const { navBarWholeCategoryData } = this.props;
        const { highLightCategory } = this.state;

        if (highLightCategory === "") this.setState({ highLightCategory: navBarWholeCategoryData[0].categoryId });
    };

    returnProductTypes = (category, subCategory) => {
        return subCategory.productTypes.map((product, i) => {

            let fetchId = product.productTypeId;

            if(product.productsCount > 0)
            return (
                <a
                    href={
                        "/products/" +
                        handleNames(category, 1) + "/" +
                        handleNames(subCategory, 2) + "/" +
                        handleNames(product, 3) + "/" +
                        alterFetchId(fetchId)
                    }
                    key={i}
                >
                    <div
                        className="wrapperForProductTypes"
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
    };

    populateDataForSlider = () => {


    };

    returnCategoriesData = (categorySelected) => {

        const { navBarWholeCategoryData } = this.props;
        const { allProdCatSelected } = this.state;

        const returnSubCategoriesInItem = () => {
            return categorySelected.subCategories.map((subCat, j) => {

                let fetchId = subCat.subCategoryId;

                return (
                    <div key={j} className={`subCategoryHeaderAndImages`}>
                        <div className="subCategoryHeader">
                            <div className="expandButtonContainer">
                                {/* <div className="iconBox">
                                    <MinusIcon />
                                </div> */}

                                {
                                    subCat.productTypes.length !== 0
                                        ?
                                        <a
                                            href={
                                                "/products/" +
                                                handleNames(allProdCatSelected, 1) + "/" +
                                                handleNames(subCat, 2) + "/" +
                                                handleNames(subCat.productTypes[0], 3) + "/" +
                                                alterFetchId(fetchId)
                                            }
                                        >
                                            <div
                                                className="buttonContainer"
                                            >
                                                <h3>{subCat.subCategoryName}</h3>
                                            </div>
                                        </a>
                                        :
                                        null
                                }

                            </div>

                            <div className="productTypesOuterLayer">
                                <div className="productTypesInnerLayer" >
                                    {this.returnProductTypes(allProdCatSelected, subCat)}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })

            //     if (allProdCatSelected !== "") {

            //     }

            //     else {
            //         if (navBarWholeCategoryData.length !== 0) {
            //             return navBarWholeCategoryData[0].subCategories.map((subCat, k) => {

            //                 let fetchId = subCat.subCategoryId;

            //                 return (
            //                     <div key={k} className={`subCategoryHeaderAndImages`}>
            //                         <div className="subCategoryHeader">
            //                             <div className="expandButtonContainer">
            //                                 {/* <div className="iconBox">
            //                                     <MinusIcon />
            //                                 </div> */}
            //                                 <a
            //                                     href={`/products/${handleNames(navBarWholeCategoryData[0], 1)}/${handleNames(subCat, 2)}/${handleNames(subCat.productTypes[0], 3)}/${alterFetchId(fetchId)}`}
            //                                 >
            //                                     <div
            //                                         className="buttonContainer"
            //                                     >
            //                                         <h3>{subCat.subCategoryName}</h3>
            //                                         <div className="line"></div>
            //                                     </div>
            //                                 </a>
            //                             </div>

            //                             <div className="productTypesOuterLayer">
            //                                 <div className="productTypesInnerLayer">
            //                                     {this.returnProductTypes(navBarWholeCategoryData[0], subCat)}
            //                                 </div>
            //                             </div>
            //                         </div>
            //                     </div>
            //                 )
            //             });
            //         }
            //     }
        };

        return (
            <div className="categoryDataContainer">
                {returnSubCategoriesInItem()}
            </div>
        )
    };

    returnCategoryNames = () => {
        const { navBarWholeCategoryData } = this.props;
        const { highLightCategory } = this.state;

        return (
            navBarWholeCategoryData.map((category, k) => {

                let catName = category.categoryName.split("")

                catName = catName.map((cat, i) => {
                    if (cat === cat.toUpperCase() && i > 0)
                        return " " + cat.toLowerCase()
                    else
                        return cat
                }).join("")

                return (
                    <div
                        key={k}
                        // className="productNames"
                        className={category.categoryId !== highLightCategory ? "productNames" : "highlight productNames"}

                        onClick={() => {
                            this.setState({
                                allProdCatSelected: category,
                                highLightCategory: category.categoryId
                            })
                        }}
                    >
                        <p
                        // className={category.categoryId !== highLightCategory ? "" : "highlight"}
                        >
                            {catName}
                        </p>
                    </div>
                )
            })
        )
    }

    returnSliderForAllCategories = () => {

        const { highLightCategory } = this.state;
        let { trendingProductsData } = this.props;


        return trendingProductsData.map((trendingItem, i) => {
            if (trendingItem.categoryId === highLightCategory) {
                return (
                    <div
                        key={i}
                    >
                        <HtmlSlider
                            imageWidth={"180"}
                            uniqueClassName={highLightCategory + Math.random().toString(36).replace(/[^a-z]+/g, '')}
                            categoryData={
                                {
                                    categoryName: "productsOnDemand",
                                    imagesInCategory: trendingItem.trendingProducts.map((productInfo, k) => {
                                        let prodId = productInfo.productId.split("-"),
                                            prodTypeId = `${prodId[0]}-${prodId[1]}-${prodId[2]}`;
                                        return {
                                            textOnRibbonSatisfied: false,
                                            imageURL: productInfo.productThumb,
                                            title: productInfo.productName, //- optional
                                            subTitle: productInfo.subCategoryName.split("-").map((s) => s.charAt(0).toUpperCase() + s.substring(1)).join(" "),
                                            hrefLink: `/products/${convertToKebabCase(handleCategoryName(productInfo.productId.split("-")[0]).categoryName)}/${productInfo.subCategoryName}/${productInfo.productTypeName}/${alterFetchId(prodTypeId)}`,
                                        }
                                    })
                                }
                            } // format of Item
                            textOnRibbon={"BEST SELLER"} // All caps
                            runFunction={(data) => {
                                // this.fetchProductData(data.itemCode)
                                // this.setState({
                                //     modalClass: 'modalClass',
                                //     productManagerWrapperClass: "productManagerWrapperClass blurClass",
                                //     activeModalType: "subCategoryDetailedPreview",
                                //     itemCode: data.itemCode
                                // })
                            }}
                        />
                    </div>
                )
            }

            else {
                return null
            }
        })

    }

    returnCategoryTypeData = (categorySelected) => {

        return (
            <div className="allProductsDropdownModalSubcategorySectionInnerLayer">
                <div className="vendorsLocation">
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

                <div className="productsOnDemand">
                    <div className="productsOnDemandInnerLayer">
                        <div className="categoryData">
                            <div className="headerSection">
                                <div className="headerContainer">
                                    <h3>On high demand</h3>
                                    <div className="line"></div>
                                </div>
                                <div className="sliderContainer">
                                    {this.returnSliderForAllCategories()}
                                </div>
                            </div>

                            {this.returnCategoriesData(categorySelected)}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render() {
        return (
            <div className="all-products-dropdown-main-class">
                <div className="leftLayer">
                    <div className="header-select-category">
                        <div className="icon-wrap">
                            <StarIcon/>
                        </div>

                        <h3 className="select-category">
                            Select a category
                        </h3>  
                    </div>
                    
 
                    <section className="allProductsDropdownModalCategorySection">
                        {this.returnCategoryNames()}
                    </section>
                </div>

                <div className="rightLayer">
                    
                    <section className="allProductsDropdownModalSubcategorySection">
                        {this.returnCategoryTypeData(this.state.allProdCatSelected)}
                    </section>
                </div>

            </div>
        )
    };
};

export default detailedCategoryData;