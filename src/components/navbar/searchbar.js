import React, { Component } from "react";
import Axios from "axios";

import { api } from "../../actions/apiLinks";
import Suggestions from "./suggestions";

import "../../assets/css/navbar.css";
import { decryptData } from "../../factories/encryptDecrypt";
import nameRephraser from "../../factories/nameRephraser";

class Searchbar extends Component {

    state = {
        blogsData: [],
        categoryData: [],
        subCategoryData: [],
        productTypeData: [],
        productsData: [],

        overAllNamesAndId: [],

        cursor: null,

        filteredData: [],
        searchSuggestions: "hide",
        searchConsole: "search-console-outer"
    }

    componentDidMount = () => {
        let categoryData = [], subCategoryData = [], productTypeData = [];
        if(this.props.allCategoriesData)
        this.props.allCategoriesData.map(category => {
            categoryData.push({ id: category.categoryId, name: nameRephraser(category.categoryName) });
                category.subCategories.map(subCategory => {
                    subCategoryData.push({ id: subCategory.subCategoryId, name: subCategory.subCategoryName })
                        subCategory.productTypes.map(productType => {
                            if (productType.productsCount !== 0) {
                                productTypeData.push({ id: productType.productTypeId, name: productType.productTypeName })
                            }
                        })
                })
        })

        let overAllNamesAndId = (categoryData.concat(subCategoryData)).concat(productTypeData)

        this.setState({ categoryData, subCategoryData, productTypeData, overAllNamesAndId })
    }

    // componentDidUpdate = () => {
    //     console.log(this.state.filteredData, this.state.productsData);
    // }

    fetchSearchListSuggestions = (query) => {
        const { categoryData, subCategoryData, productTypeData, productsData } = this.state;

        if (query) {

            let categoryFilteredData = categoryData.filter((item) => {
                return item.name.toLowerCase().replace(/\s/g,'').startsWith(query.toLowerCase().replace(/\s/g,''));
            })

            let subCategoryFilteredData = subCategoryData.filter((item) => {
                return item.name.toLowerCase().replace(/\s/g,'').startsWith(query.toLowerCase().replace(/\s/g,''));
            })

            let productTypeFilteredData = productTypeData.filter((item) => {
                return item.name.toLowerCase().replace(/\s/g,'').startsWith(query.toLowerCase().replace(/\s/g,''));
            })

            // console.log(productsFilteredData);

            let n = 0, a, b, c, d, e;

            if (categoryFilteredData.length >= 2) a = 2;
                else a = categoryFilteredData.length;
            if (subCategoryFilteredData.length >= 2) b = 2;
                else b = subCategoryFilteredData.length;
            if (productTypeFilteredData.length >= 2) c = 2;
                else c = productTypeFilteredData.length;
            // if (blogFilteredData.length >= 2) d = 2;
                // else d = blogFilteredData.length;
            // if (productsFilteredData.length >= 2) e = (13 - (a + b + c));

            // console.log( a, b, c, e = (13 - (a + b + c)));

            let filteredData = [
                ...categoryFilteredData.slice(0, a),
                ...subCategoryFilteredData.slice(0, b),
                ...productTypeFilteredData.slice(0, c),
                // ...blogFilteredData.sllice(0, d),
                // ...productsFilteredData.slice(0, e)
            ];

            this.setState({ 
                cursor : null,
                filteredData
            })
        }

        else {
            this.setState({ 
                cursor: null,
                filteredData: []
            })
        }
    };

    handleKeyDown = (e)=> {
        const { cursor, filteredData } = this.state;

        // arrow up/down button should select next/previous list element

        if (e.keyCode === 38) {
            if (cursor > 0) {
                this.setState( prevState => ({
                    cursor: prevState.cursor - 1
                }))
            }

            else {
                this.setState({ cursor: (filteredData.length - 1) })
            }
        }
        
        else if (e.keyCode === 40) {
            if (cursor !== null) {
                if (cursor < filteredData.length - 1) {
                    this.setState( prevState => ({
                        cursor: prevState.cursor + 1
                    }))
                }

                else {
                    this.setState({ cursor: 0 })
                }
            }

            else {
                this.setState( prevState => ({
                    cursor: prevState.cursor + 0
                }))
            }
        }
    };

    submitOnEnter = (e) => {
        // console.log(e.key);

        if(e.key === "Enter"){
            /// OPENING ON ENTER ///
            /// OPENING ON ENTER ///
            /// OPENING ON ENTER ///
            this.setState({
                redirectToLink : `open ${this.state.cursor} index of the array`
            })
            /// OPENING ON ENTER ///
            /// OPENING ON ENTER ///
            /// OPENING ON ENTER ///
        }
    }

    // getProductsData = async (query) => {
    //     let productsFilteredData, structuredData = [];
    //     const { filteredData, productsData } = this.state;

    //     await Axios.get(`${api.GET_QUERIED_PRODUCTS}?searchForProduct=${query}`,
    //         {
    //             headers: {
    //                 'accept': 'application/json',
    //                 'Accept-Language': 'en-US,en;q=0.8',
    //                 "Content-Type": "application/json",
    //             },
    //             // withCredentials: true
    //         }
    //     )
    //     .then(res => {
    //         let decryptedData = decryptData(res.data.responseData);

    //         console.log(res);

    //         this.setState({
    //             productsData: decryptedData.queriedProductsData
    //         })
    //     })
    //     .catch(err => console.log(err))


    //     // if(productsData.length !== 0) {
    //         // productsFilteredData = productsData.filter((item) => {
    //         //     return item.productName.toLowerCase().replace(/\s/g,'').startsWith(query.toLowerCase().replace(/\s/g,''));
    //         // })

    //         // console.log(productsFilteredData);

    //         // productsFilteredData.map((item, i) => {
    //         //     structuredData.push({
    //         //         id: item.productId,
    //         //         name: item.productName
    //         //     })
    //         // })

    //         // let e;

    //         // if (structuredData.length >= 2) e = (13 - (filteredData.length));
    
    //         // let overallData = [
    //         //     ...filteredData,
    //         //     ...structuredData.slice(0, e)
    //         // ];

    //         // // console.log(overallData);
    
    //         // this.setState({ 
    //         //     cursor : null,
    //         //     filteredData: overallData
    //         // })
    //     // }
    // }

    render() {
        return (
            <div 
                className={this.state.searchConsole}
                onMouseEnter = {
                    () => {
                        this.setState({
                            searchConsole : "search-console-outer active-search-console",
                            searchSuggestions: "show"
                        })
                    }
                }
                onMouseLeave = {
                    () => {
                        this.setState({
                            searchConsole : "search-console-outer",
                            searchSuggestions: "hide"
                        })
                    }
                }
                >
                <div className="search-console-inner">
                    <input 
                        ref="searchConsole"
                        type="text"
                        placeholder="Search architectural products, ideas, blogs"  
                        onChange={ (e) => {
                            this.fetchSearchListSuggestions(e.target.value.trimStart())
                            // this.getProductsData(e.target.value.trimStart())

                            // console.log(e.target.value.length)

                            if (e.target.value.length !== 0) this.setState({ searchSuggestions: "show" });
                            else this.setState({ searchSuggestions: "hide", filteredData: []});
                        }}

                        onFocus={() => {
                            this.setState({
                                searchConsole : "search-console-outer active-search-console",
                                searchSuggestions: "show"
                            })
                        }}

                        

                        // onBlur = {() => {
                        //     this.setState({
                        //         searchConsole : "search-console-outer",
                        //         // searchSuggestions: "hide"
                        //     })
                        // }}

                        onKeyPress = {(e) => this.submitOnEnter(e)}

                        // onKeyUp={(e) => {
                        //     this.getProductsData(e.target.value.trimStart())
                        //     // this.fetchSearchListSuggestions(e.target.value.trimStart())
                        // }}

                        onKeyDown={(e) => {
                            if(e.keyCode === 38){
                                e.preventDefault()
                            }

                            this.handleKeyDown(e)
                        }}

                    />
                </div>

                <div 
                    className={this.state.searchSuggestions}
                    // onMouseLeave = { () => {
                    //     this.setState({
                    //         searchConsole : "search-console-outer",
                    //         searchSuggestions: "hide"
                    //     })
                    // } }
                    
                    >
                    <Suggestions 
                        cursor={this.state.cursor} 
                        results={this.state.filteredData}
                        overallData={this.state.overAllNamesAndId}
                        selectedQuery = {(r) => {
                            this.refs.searchConsole.value = r.name
                        }}

                        prodTypeData={this.state.productTypeData}

                        /// OPENING ON ENTER ///
                        /// OPENING ON ENTER ///
                        /// OPENING ON ENTER ///
                        redirectURL = {
                            this.state.redirectToLink
                        }
                        /// OPENING ON ENTER ///
                        /// OPENING ON ENTER ///
                        /// OPENING ON ENTER ///
                    />
                </div>
            </div>
        )
    }
}

export default Searchbar;