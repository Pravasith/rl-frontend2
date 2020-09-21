import React, { Component } from 'react';

import { SelectList } from "../UX/uxComponents";

import OtherProducts from "./otherProducts";
import AllProducts from './allProducts';

import LogoAnimation from "../animations/logoAnimation";
import { IndianIcon, NavBarLoadingIcon } from '../../assets/images';
import "../../assets/css/categories_dropdown.css";

class AllProductsDropDown extends Component {

    state = {
        categoryModal: "categoryModal hide",
        categorySelected: "",
        // allProdCatSelected: "",
        productTypesOuterLayer: "productTypesOuterLayer",
        highLightCategory: "",

        loadingClass: 'loadingAnim hide',
        mainClass: 'mainClass',
    };

    // componentDidUpdate = () => {
    //     this.handleDefaultValue();
    // };

    // handleDefaultValue = () => {
    //     const { categories } = this.props;
    //     const { highLightCategory } = this.state;

    //     categories.map((item, i) => {
    //         if (item.categoryTypes) {
    //             if (item.categoryTypes.length !== 0) {
    //                 if (highLightCategory === "") this.setState({ highLightCategory: item.categoryTypes[0].categoryId })
    //             }
    //         }
    //     })
    // };

    returnLocation = () => {
        return [
            { label: "Bangalore, Karnataka", value: 1 },
            { label: "Hyderabad, Telangana", value: 2 },
            { label: "Mumbai, Maharastra", value: 3 },
            { label: "Kolkata, West Bengal", value: 4 }
        ];
    };

    handlePopulatedCategory = () => {
        const { categories, navBarWholeCategoryData, categorySelected, trendingProductsArray } = this.props;
        const { highLightCategory } = this.state;

        // console.log(navBarWholeCategoryData)

        const categoryDataOfOtherProducts = (categoryId) => {
            return navBarWholeCategoryData.filter(item => {
                return item.categoryId === categoryId
            })
        }

        const trendingProductsOfOtherProducts = (categoryId) => {
            return trendingProductsArray.filter(item => item.categoryId === categoryId);

            //     else if (allOrOther === "allProducts") {
            //         if (categoryId.categoryId) return item.categoryId === categoryId.categoryId;
            //         else return item.categoryId === highLightCategory;
            //     }
            // })
        }

        if (categories.length !== 0) {

            return categories.map((item, c) => {
                if (item.categoryId !== 10) {
                    if (item.categoryId === categorySelected) {
                        return (
                            <div key={c} className="returnOtherProducts">
                                <OtherProducts
                                    categoryData={categoryDataOfOtherProducts(categorySelected)}
                                    trendingProductsData={trendingProductsOfOtherProducts(categorySelected)}
                                />
                            </div>
                        )
                    }
                }

                else {
                    if (item.categoryId === categorySelected) {
                        if (navBarWholeCategoryData.length !== 0) {
                            return (
                                <div key={c} className="allProductsDropdownModalOuterLayer">
                                    
                                    <AllProducts
                                        // allProdCatSelected={this.state.allProdCatSelected}
                                        // highLightCategory={this.state.highLightCategory}
                                        navBarWholeCategoryData={navBarWholeCategoryData}
                                        trendingProductsData={trendingProductsArray}
                                    />
    
                                    {/* <section className="allProductsDropdownModalSubcategorySection">
                                        <div className="allProductsDropdownModalSubcategorySectionInnerLayer">
                                            <div className="vendorsLocation">
                                                <p>From vendors based out of</p>
                                                <div className="flagIcon">
                                                    <IndianIcon />
                                                </div>
                                            </div>
    
                                            <div className="productsOnDemand">
                                                <div className="productsOnDemandInnerLayer">
                                                    <div className="categoryData">
                                                        <AllProducts
                                                            navBarWholeCategoryData={navBarWholeCategoryData}
                                                            allProdCatSelected={this.state.allProdCatSelected}
                                                            categories={categories}
                                                            trendingProductsData={trendingProductsOfOtherProducts("allProducts", this.state.allProdCatSelected)}
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </section> */}

                                </div>
                            )
                        }
                    }
                }
            })
        }

        // if (categories[categories.length - 1].categoryTypes.length !== 0) {
        //     return categories.map((item, c) => {
        //         if (!item.categoryTypes) {
        //             if (item.categoryId === categorySelected) {
        //                 return (
        //                     <div key={c} className="returnOtherProducts">
        //                         <OtherProducts
        //                             categoryData={categoryDataOfOtherProducts(categorySelected)}
        //                             trendingProductsData={trendingProductsOfOtherProducts("otherProducts", categorySelected)}
        //                         />
        //                     </div>
        //                 )
        //             }
        //         }

        //         else if (item.categoryTypes) {
        //             if (item.categoryTypes.length !== 0) {
        //                 if (item.categoryId === categorySelected) {
        //                     return (
        //                         <div key={c} className="allProductsDropdownModalOuterLayer">
        //                             <div className="outerLayer">

        //                                 <section className="allProductsDropdownModalCategorySection">
        //                                     {item.categoryTypes.map((category, k) => {

        //                                         let catName = category.categoryName.split("")

        //                                         catName = catName.map((cat, i) => {
        //                                             if (cat === cat.toUpperCase() && i > 0)
        //                                                 return " " + cat.toLowerCase()
        //                                             else
        //                                                 return cat
        //                                         }).join("")

        //                                         return (
        //                                             <div
        //                                                 key={k}
        //                                                 // className="productNames"
        //                                                 className={category.categoryId !== highLightCategory ? "productNames" : "highlight productNames"}

        //                                                 onClick={() => {
        //                                                     this.setState({
        //                                                         allProdCatSelected: category,
        //                                                         highLightCategory: category.categoryId
        //                                                     })
        //                                                 }}
        //                                             >
        //                                                 <p
        //                                                 // className={category.categoryId !== highLightCategory ? "" : "highlight"}
        //                                                 >
        //                                                     {catName}
        //                                                 </p>
        //                                             </div>
        //                                         )
        //                                     }
        //                                     )}
        //                                 </section>
        //                             </div>

        //                             <section className="allProductsDropdownModalSubcategorySection">
        //                                 <div className="allProductsDropdownModalSubcategorySectionInnerLayer">
        //                                     <div className="vendorsLocation">
        //                                         <p>From vendors based out of</p>
        //                                         <div className="flagIcon">
        //                                             <IndianIcon />
        //                                         </div>

        //                                         {/* <div className="selectionCategory">
        //                                             <SelectList
        //                                                 name="installerCostType"
        //                                                 // value={this.state.installerCostType}
        //                                                 // onChange={e =>
        //                                                 //     this.onChangeHandler(e, "installerCost")
        //                                                 // }

        //                                                 options={this.returnLocation()}
        //                                             />

        //                                         </div> */}
        //                                     </div>

        //                                     <div className="productsOnDemand">
        //                                         <div className="productsOnDemandInnerLayer">
        //                                             <div className="categoryData">
        //                                                 <AllProducts
        //                                                     allProdCatSelected={this.state.allProdCatSelected}
        //                                                     categories={categories}
        //                                                     trendingProductsData={trendingProductsOfOtherProducts("allProducts", this.state.allProdCatSelected)}
        //                                                 />
        //                                             </div>
        //                                         </div>
        //                                     </div>
        //                                 </div>
        //                             </section>

        //                         </div>
        //                     )
        //                 }
        //             }
        //         }
        //     })
        // }

        // else {
        //     return (
        //         <div
        //             className="loadingClassAnime"
        //         // style = {{background: "yellow", padding : "10em"}}
        //         >
        //             <div className="loadingAnimeInnerLayer">
        //                 <div className="imageAnimationContainer">
        //                     <div className="headerAnimationContainer">
        //                         <div className="headerContainer"></div>
        //                     </div>
        //                     <div className="lower-section">
        //                         <div className="upperAnimationContainer">
        //                             <div className="bigBoxContainer">
        //                                 <div className="bigBoxContainerInnerLayer"></div>
        //                             </div>
        //                             <div className="bigBoxContainer">
        //                                 <div className="bigBoxContainerInnerLayer"></div>
        //                             </div>
        //                         </div>
        //                         <div className="lowerAnimationContainer">
        //                             <div className="smallBoxContainer">
        //                                 <div className="smallBoxContainerInnerLayer"></div>
        //                             </div>
        //                             <div className="smallBoxContainer">
        //                                 <div className="smallBoxContainerInnerLayer"></div>
        //                             </div>
        //                             <div className="smallBoxContainer">
        //                                 <div className="smallBoxContainerInnerLayer"></div>
        //                             </div>
        //                         </div>
        //                     </div>
        //                 </div>
        //                 <div className="smallAnimationContainer">
        //                     <div className="smallAnimeContainer">
        //                         <NavBarLoadingIcon />
        //                     </div>
        //                 </div>
        //             </div>
        //         </div>
        //     )
        // }

    };

    render() {
        return (
            <div className="productCategoriesMenuDropdown" >
                <div className={this.state.loadingClass}>
                    <LogoAnimation text="Bringing back the Art in Architecture." />
                </div>
                <div className={this.state.mainClass}>
                    {this.handlePopulatedCategory()}
                </div>
            </div>
        );
    };
};

export default AllProductsDropDown;