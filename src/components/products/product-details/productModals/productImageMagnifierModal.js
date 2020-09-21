import React, { Component } from 'react';
import { connect } from "react-redux";

import { productImageMagnifier } from "../../../../actions/productCustomizationActions";

import HtmlSlider from '../../../UX/htmlSlider';
import ImageMagnifierModal from "../../../UX/imageViewModal";

import { ModalCloseButton } from "../../../../assets/images";

class ProductImageMagnifier extends Component {

    state = {
        hovertext: "block",
        isModalOpen: true,
        magnifier: {
            backgroundImage: "",
            backgroundPosition: "0% 0%"
        },
        showImage: this.props.productData.productImages[0].imageURL,
    };

    handleMouseMove = e => {
        const { productImage } = this.props.openOrCloseModal;
        const { showImage } = this.state;
        // console.log(this.props.productData)

        let x, y;

        const { left, top, width, height } = e.target.getBoundingClientRect();

        const imageWidth = this.refs.actualImageFullscreen.naturalWidth,
            imageHeight = this.refs.actualImageFullscreen.naturalHeight;


        const containerWidth = this.refs.imageContainerFullScreen.offsetWidth,
            containerHeight = this.refs.imageContainerFullScreen.offsetHeight;

        if (imageWidth >= containerWidth && imageHeight >= containerHeight) {
            x = (e.pageX - left) / width * 100;
            y = (e.pageY - top) / height * 100;
        }

        else {
            if (imageWidth < containerWidth && imageHeight < containerHeight) {
                x = 50;
                y = 50;
            }

            else {
                if (imageWidth < containerWidth) {
                    x = 50;
                    y = (e.pageY - top) / height * 100;
                }

                if (imageHeight < containerHeight) {
                    x = (e.pageX - left) / width * 100;
                    y = 50
                }
            }
        }

        // console.log(showImage)

        this.setState({
            magnifier: {
                ...this.state.magnifier,
                backgroundImage: `url(${showImage})`,
                transformOrigin: "50% 50%",
                backgroundPosition: `${x}% ${y}%`
            }
        })
    };

    populateDataForSlider = () => {
        const { productData } = this.props;

        let imagesObj;

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

        return imagesObj;
    };

    imageSlider = () => {
        return (
            <HtmlSlider
                imageWidth={100}
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
    };

    closeTheModal = () => {
        this.props.productImageMagnifier("close", { isModalOpen: false });
    };

    render() {
        return (
            <div className="returnModal-image-Content">
                <ImageMagnifierModal
                    isModalOpen={this.state.isModalOpen}
                    >
                    <div className={this.state.hovertext}>
                        <p>Hover mouse pointer on this image to zoom</p>
                    </div>
                    <figure
                        ref="imageContainerFullScreen"
                        onMouseMove={this.handleMouseMove}
                        // onMouseEnter = {() => {
                        //     this.setState({
                        //         hovertext: "hideText"
                        //     })
                        // }}
                        onMouseLeave={() => {
                            this.setState({
                                magnifier: {
                                    ...this.state.magnifier,
                                    backgroundImage: "none"
                                },
                                hovertext: "block"
                            })
                        }}
                        style={{
                            ...this.state.magnifier,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                        <img
                            ref="actualImageFullscreen"
                            style={{ borderRadius: 3 }}
                            // src={this.props.openOrCloseModal.productImage}
                            src={this.state.showImage ? this.state.showImage : this.props.showImage}
                            alt="unsplash"
                        />
                    </figure>
                    <div
                        className="img-button-container"
                        onClick={() => this.closeTheModal()}
                    >
                        <ModalCloseButton />
                    </div>
                </ImageMagnifierModal>
                <div className="sliderContainerForModal">
                    <div className="sliderContainerForModalOuterLayer">
                        {this.imageSlider()}
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        openOrCloseModal: state.openOrCloseModal
    }
};

export default connect(mapStateToProps, { productImageMagnifier })(ProductImageMagnifier);