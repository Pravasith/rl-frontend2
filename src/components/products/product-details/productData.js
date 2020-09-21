import React, { Component } from 'react';

import { connect } from "react-redux";
import { customizeProduct } from '../../../actions/productCustomizationActions';

import { Image } from 'cloudinary-react';
import PublicId from '../../../factories/cloudinaryFactory'

// import YouTube from "../../UX/youTubeUploader";

class ProductData extends Component {
    
    state = {
        colorSelectedOnData: "",
        finishSelectedOnData: "",
        materialSelectedOnData: "",
        sizeSelectedOnData: ""
    };

    componentDidMount() {
        this.handleDefaultValues();
    };

    handleDefaultValues = () => {
        const { productData } = this.props;
        // console.log(productData)

        let color, finish, material, size;

        if(productData !== {}) {
            color = productData.colorOptions[0],
            finish = productData.finishingOptions[0],
            material = productData.productMaterials[0],
            size = productData.sizesAvailable[0];
        }

        if (productData.colorOptions.length !== 0) {
            this.props.customizeProduct({
                colorOrFinishSelected: {
                    colorCode: color.colorCode,
                    colorName: color.colorName,
                    colorCost: Number(color.colorCost)
                }
            }, "colorOrFinish");
        }

        else if (productData.finishingOptions.length !== 0) {
            this.props.customizeProduct({
                colorOrFinishSelected: {
                    finishName: finish.finishName,
                    finishImage: finish.finishImage,
                    finishCode: finish.finishCode,
                    finishCost: Number(finish.finishCost)
                }
            }, "colorOrFinish");
        }

        if (productData.productMaterials.length !== 0) {
            this.props.customizeProduct({
                materialSelected: {
                    materialName: material.materialName,
                    materialGrade: material.materialGrade,
                    materialCost: Number(material.materialCost)
                }
            }, "material");
        }

        if (productData.sizesAvailable.length) {
            this.props.customizeProduct({
                sizeSelected: {
                    sizeName: size.sizeName,
                    sizeCost: Number(size.sizeCost)
                }
            }, "size");
        }
    };

    handleClassName = (item, type) => {
        const { colorOrFinishSelected, materialSelected, sizeSelected } = this.props.newCustomOptionData;
        const { colorSelectedOnData, finishSelectedOnData, materialSelectedOnData, sizeSelectedOnData } = this.state;
        // console.log(this.props.newCustomOptionData)
        if (type === "color") {
            if (colorSelectedOnData !== "") {
                if (colorSelectedOnData.colorName !== colorOrFinishSelected.colorName) {
                    if (colorOrFinishSelected.colorName === item.colorName) return "colorSelected border"
                    else return "colorSelected"
                }
                else {
                    if (colorSelectedOnData.colorName === item.colorName) return "colorSelected border"
                    else return "colorSelected"
                }
            }

            else {
                if (item && colorOrFinishSelected) {
                    if (colorOrFinishSelected.colorName === item.colorName) return "colorSelected border"
                    else return "colorSelected"
                }
            }
        }

        else if (type === "finish") {
            if (finishSelectedOnData !== "") {
                if (finishSelectedOnData.finishName !== colorOrFinishSelected.finishName) {
                    if (colorOrFinishSelected.finishName === item.finishName) return "finishSelected border"
                    else return "finishSelected"
                }
                else {
                    if (finishSelectedOnData.finishName === item.finishName) return "finishSelected border"
                    else return "finishSelected"
                }
            }

            else {
                if (item && colorOrFinishSelected) {
                    if (colorOrFinishSelected.finishName === item.finishName) return "finishSelected border"
                    else return "finishSelected"
                }
            }
        }

        else if (type === "material") {
            if (materialSelectedOnData !== "") {
                if (materialSelectedOnData.materialName !== materialSelected.materialName) {
                    if (materialSelected.materialName === item.materialName) return "materialSelected border"
                    else return "materialSelected"
                }
                else {
                    if (materialSelectedOnData.materialName === item.materialName) return "materialSelected border"
                    else return "materialSelected"
                }
            }

            else {
                if (item && materialSelected) {
                    if (materialSelected.materialName === item.materialName) return "materialSelected border"
                    else return "materialSelected"
                }
            }
        }

        else if (type === "size") {
            if (sizeSelectedOnData !== "") {
                if (sizeSelectedOnData.sizeName !== sizeSelected.sizeName) {
                    if (sizeSelected.sizeName === item.sizeName) return "sizeSelected border"
                    else return "sizeSelected"
                }
                else {
                    if (sizeSelectedOnData.sizeName === item.sizeName) return "sizeSelected border"
                    else return "sizeSelected"
                }
            }

            else {
                if (item && sizeSelected) {
                    if (sizeSelected.sizeName === item.sizeName) return "sizeSelected border"
                    else return "sizeSelected"
                }
            }
        }
    };

    returnProductColors = (productData) => {
        const { colorSelected } = this.state;

        return productData.colorOptions.map((color, i) => {
            return (
                <div key={i} className="contentColorContainer">
                    <div
                        className={this.handleClassName(color, "color")}
                        style={{ background: color.colorCode }}
                        onClick={() => {
                            this.setState({
                                colorSelectedOnData: {
                                    colorCode: color.colorCode,
                                    colorName: color.colorName,
                                    colorCost: Number(color.colorCost)
                                },
                                finishSelected: ""
                            });

                            this.props.customizeProduct({
                                colorOrFinishSelected: {
                                    colorCode: color.colorCode,
                                    colorName: color.colorName,
                                    colorCost: Number(color.colorCost)
                                }
                            }, "colorOrFinish")
                        }}
                    />
                </div>
            )
        })
    };

    returnProductFinishes = (productData) => {
        return productData.finishingOptions.map((finish, i) => {
            return (
                <div key={i} className="contentFinishContainer">
                    <div
                        className="finishDetails"
                        onClick={() => {
                            this.setState({
                                finishSelectedOnData: {
                                    finishName: finish.finishName,
                                    finishImage: finish.finishImage,
                                    finishCode: finish.finishCode,
                                    finishCost: Number(finish.finishCost)
                                },
                                colorSelected: ""
                            });

                            this.props.customizeProduct({
                                colorOrFinishSelected: {
                                    finishName: finish.finishName,
                                    finishImage: finish.finishImage,
                                    finishCode: finish.finishCode,
                                    finishCost: Number(finish.finishCost)
                                }
                            }, "colorOrFinish")}
                        }
                    >
                        <img 
                            className={this.handleClassName(finish, "finish")}
                            src={finish.finishImage} 
                            alt=""
                        />
                    </div>
                </div>
            )
        })
    };

    returnProductMaterials = (productData) => {
        return productData.productMaterials.map((material, i) => {
            return (
                <div key={i} className="contentmaterialContainer">
                    <div
                        className="materialDetails"
                        onClick={() => {
                            this.setState({
                                materialSelectedOnData: {
                                    materialName: material.materialName,
                                    materialGrade: material.materialGrade,
                                    materialCost: Number(material.materialCost)
                                }
                            });

                            this.props.customizeProduct({
                                materialSelected: {
                                    materialName: material.materialName,
                                    materialGrade: material.materialGrade,
                                    materialCost: Number(material.materialCost)
                                }
                            }, "material");
                        }
                        }>

                        <div className={this.handleClassName(material, "material")}>
                            <p className="boldParagraph">{material.materialName}</p>
                            <p>{material.materialGrade}</p>
                        </div>
                    </div>
                </div>
            )
        })
    };

    returnProductSizes = (productData) => {
        return productData.sizesAvailable.map((size, i) => {
            return (
                <div key={i} className="contentSizeContainer">
                    <div 
                        className="sizeDetails"
                        onClick={() => {
                            this.setState({ 
                                sizeSelectedOnData: {
                                    sizeName: size.sizeName,
                                    sizeCost: Number(size.sizeCost)
                                } 
                            });

                            this.props.customizeProduct({
                                sizeSelected: {
                                    sizeName: size.sizeName,
                                    sizeCost: Number(size.sizeCost)
                                }
                            }, "size");
                        }}
                    >
                        <p className={this.handleClassName(size, "size")}>{size.sizeName}</p>
                    </div>
                </div>
            )
        })
    };

    returnProductFeatures = (productData) => {
        return productData.features.map((feature, i) => {
            return (
                <div key={i} className="contentFeatureContainer">
                    <div className="featureDetails">
                        <div className="squareBullets"></div>
                        <p>{feature}</p>
                    </div>
                </div>
            )
        })
    };

    returnProductDesignStyle = (productData) => {
        return productData.designStyles.map((design, i) => {
            return (
                <div key={i} className="contentDesignStyleContainer">
                    <p>{design.styleName}</p>
                </div>
            )
        })
    };

    returnProductTags = (productData) => {
        return productData.tags.map((tag, i) => {
            return (
                <div key={i} className="contentTagsContainer">
                        <p>{tag}</p>
                </div>
            )
        })
    };

    returnProductVideo = (productData) => {
        if (productData.youTubeAdVideos.length !== 0) {
            return productData.youTubeAdVideos.map((video, i) => {
                return (
                    <div key={i} className="contentvideosContainer">
                        <div className="videosDetails">
                            <YouTube
                                video={video}
                                autoplay="0"
                                rel="0"
                                modest="1" 
                            />
                        </div>
                    </div>
                )
            })
        }
    };

    returnProductDetailedData = () => {
        const { productData } = this.props;

        return (
            <div className="productDetailDataContainer">
                
                <div className="productHeadingWrapperContainer">
                    <h1>{productData.productName}</h1>
                    <p className="productCodeheader">{productData.productCode}</p>
                </div>

                <div className="productDescriptionContainer">
                    <p>{productData.productDescription}</p>
                </div>

                <div className="productBrandLogoContainer">
                    <h3>Brand</h3>
                    <div className="productBrandLogoOuterLayer">
                        {productData.brandName !== null ? 
                            (<div>
                                <Image 
                                    cloudName="rolling-logs" 
                                    alt = {""}
                                    publicId={PublicId(productData.brandImage)}
                                    // transformations
                                    // width="250" 
                                    // height= "180"
                                    // crop="scale"
                                    width= {100}
                                    height= {70}
                                    crop="lpad"
                                    secure="true"
                                />
                                {/* <img src={productData.brandImage} alt="" /> */}
                                <p>{productData.brandName}</p>
                            </div>) 
                            :
                            <p>Brand not specified</p>
                        }
                    </div>
                </div>
                
                <div className={productData.discount !== 0 ? "productCodeWrapperContainer" : "hide"}>
                    <h3>Offer</h3>
                    <div className="productDiscountOuterLayer">
                        <h1>{productData.discount}% <span>off</span></h1>
                    </div>
                </div>

                <div className={productData.colorOptions.length !== 0 ? "productColorsContainer" : "hide"}>
                    <h3>Colors available (choose one)</h3>
                    <div className="productColorsOuterLayer">
                        {this.returnProductColors(productData)}
                    </div>
                </div>

                <div className={productData.finishingOptions.length !== 0 ? "productFinishesContainer" : "hide"}>
                    <h3>Finishes available (choose one)</h3>
                    <div className="productFinishesOuterLayer">
                        {this.returnProductFinishes(productData)}
                    </div>
                </div>

                <div className="productMaterialsContainer">
                    <h3>Materials available (choose one)</h3>
                    <div className="productMaterialsOuterLayer">
                        {this.returnProductMaterials(productData)}
                    </div>
                </div>

                <div className={productData.sizesAvailable.length !== 0 ? "productSizesContainer" : "hide"}>
                    <h3>Sizes available (choose one)</h3>
                    <div className="productSizesOuterLayer">
                        {this.returnProductSizes(productData)}
                    </div>
                </div>

                <div className="productFeaturesContainer">
                    <h3>Features / specifications</h3>
                    <div className="productFeaturesOuterLayer">
                        {this.returnProductFeatures(productData)}
                    </div>
                </div>

                <div className="productDesignStyleContainer">
                    <h3>Design style</h3>
                    <div className="productDesignStyleOuterLayer">
                        {this.returnProductDesignStyle(productData)}
                    </div>
                </div>

                <div className="productTagsContainer">
                    <h3>Tags</h3>
                    <div className="productTagsOuterLayer">
                        {this.returnProductTags(productData)}
                    </div>
                </div>

                {/* <div className={productData.youTubeAdVideos.length !== 0 ? "productVideoContainer" : "productVideoContainer hide"}>
                    <h3>Product Video</h3>

                    <div className="productVideoOuterLayer">
                        {this.returnProductVideo(productData)}
                    </div>
                </div> */}
            </div>
        )
    };

    render() {
        return (
            <div className="returnProductDetailedDataOuterLayer">
                {this.returnProductDetailedData()}
            </div>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        newCustomOptionData: state.newCustomOptionData
    }
};

export default connect(mapStateToProps, { customizeProduct })(ProductData);