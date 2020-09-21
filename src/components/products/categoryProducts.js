import React, { useState, useEffect,useRef } from 'react';
import Link from "next/link";
import { api } from "../../actions/apiLinks";
import { decryptData } from "../../factories/encryptDecrypt";
import { handleCategoryName,convertToKebabCase,handleNames } from "../../factories/handleNames";
import { alterFetchId } from '../../factories/alterFetchId';
import "../../assets/css/category-products.css";
import nameRephraser from "../../factories/nameRephraser";
import PublicId from "../../factories/cloudinaryFactory";
import LogoAnimation from "../animations/logoAnimation";
import NewFooter from '../footer/newFooter';
import { Image } from "cloudinary-react";
import Axios from 'axios';

function CategoryProducts(props){

    const[ categorydata , setCategorydata ] = useState([]);
    const[ loadingClass , setLoadingClass ] = useState("loadingAnim");
    const[productContainer , setProductContainer ] = useState("category-products-inner-container hide")

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
                setCategorydata(decryptedData.allCategories)
                setLoadingClass('loadingAnim  hide')
                setProductContainer('category-products-inner-container')
        })
    },[])

    const returnCategryData = () => {

        const returnSubItems = (item) => {
            return item.map((subCat,j) => {
                const fetchId = subCat.subCategoryId
                console.log(subCat);
                return(
                        <div 
                            className="subCat-products"
                            key={j}
                        >
                            <a 
                               href=""
                                >
                                    <p>{subCat.subCategoryName}</p>  
                            </a>
                        </div>
                )
            })
        }

        if(categorydata.length !== 0){
            return categorydata.map((item,i) => {
                return(
                    <div 
                        className="category-container"
                        key={i}
                    >
                        <a href="">
                            <div className="category-content-container">
                                <div 
                                    className="category-image-container"
                                >
                                </div>
                                <div className="category-header-container">
                                    <a href="">
                                        <h3>{nameRephraser(item.categoryName).split("products")[0]}</h3>
                                    </a>
                                </div>
                                <div className="sub-category-container">
                                    {
                                        returnSubItems(item.subCategories)
                                    }
                                    <a href="">
                                        <p>More...</p>
                                    </a>
                                </div>
                            </div>
                        </a>
                    </div>
                )
            })
        }
    }

    return(
        <div className="category-products-main-container">
            <div className={loadingClass}>
                <LogoAnimation text="Bringing back the Art in Architecture." />
            </div>
            <div className={productContainer}>
                <div className="category-products-header">
                    <h3>Product Categories</h3>
                </div>
                <div className="category-products-outer-layer">
                    <div className="category-products-inner-layer">
                        {returnCategryData()}
                    </div>
                </div>
            </div>
            <NewFooter />
        </div>
    )
}

export default CategoryProducts;