import React, { useState, useEffect,useRef } from 'react';
import { decryptData } from "../../factories/encryptDecrypt";
import nameRephraser from "../../factories/nameRephraser";
import { api } from "../../actions/apiLinks";
import Axios from 'axios';
import NewFooter from '../footer/newFooter';
import LogoAnimation from "../animations/logoAnimation";
import { MinusIcon, PlusIcon } from "../../assets/images";
import "../../assets/css/category-products-page.css";

function CategoryProductsPage(){

    const[ categorydata , setCategorydata ] = useState([]);
    const[ loadingClass , setLoadingClass ] = useState("loadingAnim");
    const[ categoryContent , setCategoryContent ] = useState("all-categories-container");
    const[productContainer , setProductContainer ] = useState("sub-category-inner-container hide")

    useEffect(() => {
        Axios.get(
            api.GET_ALL_PRODUCTS_DATA
        )
        .then(categoryData => {
            
                // DECRYPT REQUEST DATA
                //
                let decryptedData = decryptData(categoryData.data.responseData)
                //
                // DECRYPT REQUEST DATA
                //
                // 
                console.log(decryptedData.allCategories);
                setCategorydata(decryptedData.allCategories)
                setLoadingClass('loadingAnim  hide')
                setProductContainer('sub-category-inner-container')
        })
    },[])

    const returnRelevantIconBox = () => {
        if(categoryContent === "all-categories-container hide"){
            return(
                <div 
                    className="iconBox"
                    onClick = {() => {
                        setCategoryContent("all-categories-container")
                    }}
                >
                    <PlusIcon/>
                </div>
            )
        }
        if(categoryContent === "all-categories-container"){
            return(
                <div 
                    className="iconBox"
                    onClick = {() => {
                        setCategoryContent("all-categories-container hide")
                    }}
                >
                    <MinusIcon/>
                </div>
            )
        }
    }

    const returnAllCategoryData = () => {
        return(
            <div className="selection-header">
                <h3>Categories</h3>
                {returnRelevantIconBox()}
            </div>
        )
    }

    const returnAllCategories = () => {

        if(categorydata.length !== 0){
            return categorydata.map((item,i) => {
                return(
                    <div
                        className="category-name-container"
                        key={i}
                    >
                        <div className="header-container">
                            <a href="">
                                <p>{nameRephraser(item.categoryName).split("products")[0]}</p>
                            </a>
                        </div>
                    </div>
                )
            })
        }
    }

    const returnSubCategoryData = () => {

        const returnProductTypes = () => {
            return(
                <div className="product-types-data">
                    <a href="">
                        <p>Sofas</p>
                    </a>
                </div>
            )
        }

        return(
            <div className="category-type-container">
                <div className="type-content-container">
                    <div className="image-container"></div>
                    <div className="sub-category-header-container">
                        <a href="">
                            <h3>Sofas and armchairs</h3>
                        </a>
                    </div>
                    <div className="product-types-container">
                        {
                            returnProductTypes()
                        }
                        <a href="">
                            <p>More...</p>
                        </a>
                    </div>
                </div>
            </div>
        )
    }

    return(
        <div className="sub-category-main-container">
            <div className={loadingClass}>
                <LogoAnimation text="Bringing back the Art in Architecture." />
            </div>
            <div className={productContainer}>
                <div className="sub-header-container">
                    <div className="header-container-inner-layer">
                        <a href="">
                            <h3>All Categories</h3>
                        </a>
                        <div className="iconBox">
                            <p>/</p>
                        </div>
                        <a href="">
                            <h3>Furniture</h3>
                        </a>
                    </div>
                </div>
                <div className="sub-category-content-container">
                    <div className="content-container-inner-layer">
                        <div className="category-selection-container">
                            <div className="selection-container-inner-layer">
                                {returnAllCategoryData()}
                                <div className={categoryContent}>
                                    <div className="all-categories-inner-layer">
                                        {
                                            categorydata.length !== 0 
                                            
                                            ?
                                            <a href="">
                                                <p>All Categories</p>
                                            </a> 
                                            :
                                            <div></div>
                                        }
                                        {returnAllCategories()}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="sub-category-products-container">
                            <div className="sub-category-products-inner-layer">
                                <div className="product-header">
                                    <h3>Furniture</h3>
                                    <div className="dscription-container">
                                        <p>
                                            When choosing furniture, it is necessary to
                                           take into consideration the style that you wish
                                           to use in your own spaces. An interior design project 
                                           includes a variety of products, articles and models 
                                           in different shapes and materials, from leather and 
                                           wood to metal and velvet finishes. From iconic pieces 
                                           of classical inspiration to contemporary metal solutions, 
                                           the composition of the furniture can involve the use of
                                            elements with common or contrasting characteristics, 
                                            preferring an impressive . For this reason,
                                            it is essential to evaluate both aesthetics and functionality,
                                            to be sure of designing an environment that is both beautiful 
                                            and comfortable.
                                        </p>
                                    </div>
                                </div>
                                <div className="product-outer-layer">
                                    <div className="product-inner-layer">
                                        {returnSubCategoryData()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <NewFooter />
        </div>
    )
}

export default CategoryProductsPage