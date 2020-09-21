import React, { Component } from 'react';

import { connect } from "react-redux";
import { productImageMagnifier, reCustomizeProduct } from '../../../actions/productCustomizationActions';

import HtmlSlider from '../../UX/htmlSlider';

class ProductImages extends Component {
    
    state = {
        showImage: ""
    };

    populateDataForSlider = () => {
        const { productData } = this.props
        let imagesObj

        if(productData)
        if (productData.length !== 0) {
            imagesObj = {
                categoryName: "productImages",
                imagesInCategory: [...productData.productImages.map((productInfo, k) => {
                    return {
                        itemCode: productInfo.itemCode,
                        textOnRibbonSatisfied: false,
                        imageURL: productInfo.imageURL
                    }
                })]
            }
        }

        return imagesObj
    };

    returnProductImages = () => {
        const { showImage } = this.state
        const { productData } = this.props

        let imageSliderData = this.populateDataForSlider();

        const displayImage = () => {
            if (showImage !== "") {
                return (
                    <div 
                        className="productImages"
                        onClick={() => {
                            this.props.productImageMagnifier(
                                "open",
                                {
                                    dropdownModal: "dropdownInModal",
                                    modalType: "imageMagnifier",
                                    isModalOpen: true,
                                    productImage: showImage
                                }
                            )
                        }}
                        >
                        <img src={showImage} alt="" />
                    </div>
                );
            }

            else {
                if (productData.length !== 0) {
                    let showProdImage = productData.productImages[0].imageURL;

                    return (
                        <div 
                            className="productImages"
                            onClick={() => {
                                this.props.productImageMagnifier(
                                    "open",
                                    {
                                        dropdownModal: "dropdownInModal",
                                        modalType: "imageMagnifier",
                                        isModalOpen: true,
                                        productImage: showProdImage
                                    }
                                )
                            }}
                            >
                            <img src={showProdImage} alt="" />
                        </div>
                    );
                }
            }
        }

        const imageSlider = () => {
            if (imageSliderData !== undefined) {
                return (
                    <HtmlSlider
                        imageWidth = {100}
                        categoryData={this.populateDataForSlider()} // format of Item
                        // numberOfSlides={3} // Change the css grid properties for responsiveness
                        textOnRibbon={""} // All caps
                        runFunction={(data) => {
                            this.setState({
                                showImage: data.imageURL,
                                // modalClass: 'modalClass',
                                // productManagerWrapperClass: "productManagerWrapperClass blurClass",
                                // activeModalType: "subCategoryDetailedPreview",
                                // itemCode: data.itemCode
                            })
                        }}
                    />
                )
            }
        }

        return (
            <div className="imagesContainer">
                <div className="imagesInnerContainer">
                    {displayImage()}
                </div>

                <div className="sliderContainer">
                    {imageSlider()}
                   
                </div>
            </div>
        )
    };

    render() {
        return (
            <div className="returnProductImagesOuterLayer">
                {this.returnProductImages()}
            </div>
        )
    }
}

export default connect(null, { productImageMagnifier, reCustomizeProduct })(ProductImages)