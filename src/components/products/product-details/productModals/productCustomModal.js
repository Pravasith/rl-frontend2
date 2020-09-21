import React, { Component } from 'react';

import { connect } from "react-redux";
import { customizeProduct, reCustomizeProduct } from '../../../../actions/productCustomizationActions';
import GenericModal from './../../../UX/genericModal';
import { WhiteButton } from '../../../UX/uxComponents';

class ProductCustomModal extends Component {

    state = {
        colorSelectedOnModal: "",
        finishSelectedOnModal: "",
        materialSelectedOnModal: "",
        sizeSelectedOnModal: ""
    };

    handleClassName = (item, type) => {
        const { colorOrFinishSelected, materialSelected, sizeSelected } = this.props.newCustomOptionData;
        const { colorSelectedOnModal, finishSelectedOnModal, materialSelectedOnModal, sizeSelectedOnModal } = this.state;

        if (type === "color") {
            if (colorSelectedOnModal !== "") {
                if (colorSelectedOnModal.colorCode === item.colorCode) {
                    return "colorSelect border"
                }
                else return "colorSelect";
            }

            else {
                if (colorOrFinishSelected.colorCode === item.colorCode) {
                    return "colorSelect border"
                }
                else return "colorSelect";
            }
        }

        else if (type === "finish") {
            if (finishSelectedOnModal !== "") {
                if (finishSelectedOnModal.finishName === item.finishName) return "finishSelect border";
                else return "finishSelect";
            }

            else {
                if (colorOrFinishSelected.finishName === item.finishName) return "finishSelect border";
                else return "finishSelect";
            }
        }

        else if (type === "material") {
            if (materialSelectedOnModal !== "") {
                if (materialSelectedOnModal.materialName === item.materialName) return "materialSelect border";
                else return "materialSelect";
            }

            else {
                if (materialSelected.materialName === item.materialName) return "materialSelect border";
                else return "materialSelect";
            }
        }

        else if (type === "size") {
            if (sizeSelectedOnModal !== "") {
                if (sizeSelectedOnModal.sizeName === item.sizeName) return "sizeSelect border";
                else return "sizeSelect";
            }

            else {
                if (sizeSelected.sizeName === item.sizeName) return "sizeSelect border";
                else return "sizeSelect";
            }
        }
    };

    handleColorOrFinishOptions = (choice) => {
        const { productData } = this.props;

        if (choice === "color") {
            return productData.colorOptions.map((color, i) => {
                return (
                    <div key={i} className="contentColorContainer">
                        <div
                            className={this.handleClassName(color, "color")}
                            onClick={() => {
                                this.setState({
                                    colorSelectedOnModal: {
                                        colorCode: color.colorCode,
                                        colorName: color.colorName,
                                        colorCost: Number(color.colorCost)
                                    },
                                    finishSelectedOnModal: ""
                                });

                                this.props.customizeProduct({
                                    colorOrFinishSelected: {
                                        colorCode: color.colorCode,
                                        colorName: color.colorName,
                                        colorCost: Number(color.colorCost)
                                    }
                                }, "colorOrFinish")
                            }}
                        >
                            <div
                                className="colorContainer"
                                style={{ background: color.colorCode }}
                            >
                            </div>
                            <div className="columnContainer">
                                <p>{color.colorName}</p>
                                <p>{color.colorCode}</p>
                            </div>
                        </div>
                    </div>
                )
            })
        }

        else if (choice === "finish") {
            return productData.finishingOptions.map((finish, i) => {
                return (
                    <div key={i} className="contentFinishContainer">
                        <div
                            className="finishDetails"
                            onClick={() => {
                                this.setState({
                                    finishSelectedOnModal: {
                                        finishName: finish.finishName,
                                        finishImage: finish.finishImage,
                                        finishCode: finish.finishCode,
                                        finishCost: Number(finish.finishCost)
                                    },
                                    colorSelectedOnModal: ""
                                });

                                this.props.customizeProduct({
                                    colorOrFinishSelected: {
                                        finishName: finish.finishName,
                                        finishImage: finish.finishImage,
                                        finishCode: finish.finishCode,
                                        finishCost: Number(finish.finishCost)
                                    }
                                }, "colorOrFinish")
                            }
                            }
                        >
                            <div className={this.handleClassName(finish, "finish")}>
                                <img
                                    src={finish.finishImage}
                                    alt=""
                                />
                                <div className="columnContainer">
                                    <p>{finish.finishName}</p>
                                    <p>{finish.finishCode}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })
        };
    };

    returnCustomProductOptions = () => {
        const { productData, openOrCloseModal } = this.props;
        const { modalType, miscellaneousData } = openOrCloseModal;

        if (modalType === "material") {
            return productData.productMaterials.map((material, i) => {
                return (
                    <div className="returnModalContent">
                        <div key={i} className="contentmaterialContainer">
                        <div
                            className="materialDetails"
                            onClick={() => {
                                this.setState({
                                    materialSelectedOnModal: {
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
                            }}
                        >

                            <div className={this.handleClassName(material, "material")}>
                                <p className="boldParagraph">{material.materialName}</p>
                                <p>{material.materialGrade}</p>
                            </div>
                        </div>
                    </div>
                    </div>
                )
            })
        }

        else if (modalType === "size") {
            return productData.sizesAvailable.map((size, i) => {
                return (
                    <div className="returnModalContent">
                        <div key={i} className="contentSizeContainer">
                        <div
                            className="sizeDetails"
                            onClick={() => {
                                this.setState({
                                    sizeSelectedOnModal: {
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
                    </div>
                )
            })
        }

        else if (modalType === "finish" || modalType === "color") {
            return (
                <div className="returnModalContent">
                    <div className="modalWrapper">
                        <div className="modalWrapperInnerLayer">
                            <section className={productData.colorOptions.length !== 0 ? "colorContainerWrapper" : "colorContainerWrapper hide"}>
                                <div className="headerContainer">
                                    <h1>Colors available</h1>
                                    <div className="line"></div>
                                </div>
                                <div className="colorContentContainer">
                                    {this.handleColorOrFinishOptions("color")}
                                </div>
                            </section>

                            <section className={productData.finishingOptions.length !== 0 ? "finishContainerWrapper" : "finishContainerWrapper hide"}>
                            <div className="headerContainer">
                                <h1>Finishes available</h1>
                                <div className="line"></div>
                            </div>
                            <div className="finishContentContainer">
                                {this.handleColorOrFinishOptions("finish")}
                            </div>
                        </section>
                        </div>
                    </div>
                </div>
            )
        }
    };

    returnHeading = () => {
        const { modalType } = this.props.openOrCloseModal;

        if (modalType === "finish" || modalType === "color") return "Choose a color/finish of your choice";
        else if (modalType === "size") return "Choose a size of your choice";
        else if (modalType === "material") return "Choose a material of your choice";
    };

    closeTheModal = () => {
        this.props.reCustomizeProduct("close")
    };

    render() {
        return (

            <GenericModal
                heading={this.returnHeading()}
                backgroundImage=""
                closeTheModal={this.closeTheModal}
            >
                {this.returnCustomProductOptions()}
                <div className="proceedButtonContainer">
                    <WhiteButton
                        runFunction={() => this.props.reCustomizeProduct("close")}
                    >
                        Proceed
                    </WhiteButton>
                </div>
            </GenericModal>

        );
    };
};

const mapStateToProps = (state) => {
    return {
        newCustomOptionData: state.newCustomOptionData,
        openOrCloseModal: state.openOrCloseModal
    }
};

export default connect(mapStateToProps, { customizeProduct, reCustomizeProduct })(ProductCustomModal);