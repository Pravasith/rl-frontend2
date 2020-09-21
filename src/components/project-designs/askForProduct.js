import React, { Component } from 'react';
import { connect } from "react-redux";

import { api } from "../../actions/apiLinks";
import { hitApi } from "../../actions/generalActions";
import { reCustomizeProduct } from '../../actions/productCustomizationActions';

import GenericModal from "../UX/genericModal";
import ImageUploader from "../UX/imageUploader";
import HtmlSlider from "../UX/htmlSlider";
import { WhiteButton } from '../UX/uxComponents';

import { ModalTransitionLoader } from '../common/loaders/modalTransitionLoader';

import "../../assets/css/custom_design.css";

class AdRequest extends Component {

    state = {
        designerName: "",
        productName: "",
        designerMobileNo: null,
        designImage: "",
        designImagesObject: {
            categoryName: "",
            imagesInCategory: []
        },

        dummyToggle: "x",

        displayMobileValueValidationError: "displayMobileValueValidationError hide",

        nameRequired: "hide",
        productNameRequired: "hide",
        mobileNoRequired: "hide",
        imageRequired: "hide",
        dropdownModal: "dropdownInModal hide"
    };

    proceedHandler = () => {
        const { designImagesObject, designerName, productName, designerMobileNo } = this.state;

        if (designerName !== "" && productName !== "" && designerMobileNo !== null) {
            this.setState({
                finalProceed: "sendRequest"
            });

            const dataToBackend = {
                name: designerName,
                productName: productName,
                mobileNo: designerMobileNo,
                referenceImages: designImagesObject.imagesInCategory
            };

            this.props.hitApi(api.ASK_FOR_PRODUCTS, "POST", {
                requestData: dataToBackend,
                message: "Requesting for product, Villain"
            })

                .then((data) => {
                    let { responseCode } = data.payload;

                    if (responseCode === 200) {
                        this.props.reCustomizeProduct(
                            "open",
                            {
                                dropdownModal: "dropdownInModal",
                                modalType: "successScreen",
                                reqFrom: "askForProduct"
                            }
                        )
                    }

                    else {
                        this.props.reCustomizeProduct(
                            "open",
                            {
                                dropdownModal: "dropdownInModal",
                                modalType: "errorScreen",
                                reqFrom: "askForProduct"
                            }
                        )
                    }
                })

                .catch(err => {
                    this.props.reCustomizeProduct(
                        "open",
                        {
                            dropdownModal: "dropdownInModal",
                            modalType: "errorScreen",
                            reqFrom: "askForProduct"
                        }
                    )
                })

        }

        if (designerName === "") this.setState({ nameRequired: "show" });
        if (productName === "") this.setState({ productNameRequired: "show" });
        if (designerMobileNo === null) this.setState({ mobileNoRequired: "show" });
        // if (designImagesObject.imagesInCategory.length === 0) this.setState({ imageRequired: "show" });
    };

    returnMyModal = () => {
        const { finalProceed } = this.state;

        let showModalContent = () => {
            return (
                <div>
                    <div className="returnModalContent">
                        {this.returnDesignerDetailsForm()}
                    </div>
                    <div className="proceedButtonContainer">
                        <WhiteButton
                            runFunction={() => this.proceedHandler()}
                        >
                            Proceed
                        </WhiteButton>
                    </div>
                </div>
            )
        }

        return (
            <GenericModal
                heading="Ask for the products you need for your design,help us build a better India"
                backgroundImage="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/askForProductsBackground.png"
                closeTheModal={this.closeTheModal}
            >
                {finalProceed !== "sendRequest" ? showModalContent() : <ModalTransitionLoader />}
            </GenericModal>
        )
    };

    closeTheModal = () => {
        this.props.reCustomizeProduct("close");

        this.setState({
            designImagesObject: {
                imageCode: "",
                imagesInCategory: []
            },

            imageRequired: "hide",
            nameRequired: "hide",
            productNameRequired: "hide",
            mobileNoRequired: "hide",
        })
    };

    checkTypeNumber = (e, type) => {
        const regEx = /^[0-9]{10}$/, val = e.target.value;

        if (val !== null) {
            if (regEx.test(val) === true) {
                if (type === "mobile") {
                    this.setState({
                        designerMobileNo: Number(val),
                        displayMobileValueValidationError: "displayMobileValueValidationError hide"
                    });
                }
            }

            else if (regEx.test(val) === false) {
                if (type === "mobile") {
                    this.setState({
                        designerMobileNo: null,
                        displayMobileValueValidationError: "displayMobileValueValidationError"
                    });
                }
            }
        }

        else if (val === null) {
            this.setState({ displayMobileValueValidationError: "displayMobileValueValidationError hide" })
        }
    };

    toggleClassDummy = () => {
        if (this.state.dummyToggle === "x") {
            this.setState({
                dummyToggle: "y"
            });
        } else if (this.state.dummyToggle === "y") {
            this.setState({
                dummyToggle: "x"
            });
        }
    };

    addDesignImage = () => {
        let { designImage, designImagesObject, designerName } = this.state;

        let temp = {
            imageCode: `designerForm-${designerName}-${Math.random().toString(36).replace('0.', '')}`,
            imageURL: designImage
        };

        let dummyArray = designImagesObject.imagesInCategory
            ? designImagesObject.imagesInCategory
            : [];

        dummyArray.push(temp);

        this.toggleClassDummy();

        this.setState({
            designImagesObject: {
                categoryName: "",
                imagesInCategory: [...dummyArray]
            },
            designImage: ""
        });
    };

    returnHtmlSliderforDesignImagesObject = () => {
        const { dummyToggle, designImagesObject } = this.state;

        if (designImagesObject.imagesInCategory.length !== 0) {
            if (dummyToggle === "x") {
                return (
                    <div className="imageSliderParentWrap">
                        <div className={"downSectionInnerLayer "}>
                            <HtmlSlider
                                imageWidth={100}
                                categoryData={designImagesObject} // format of Item
                            // numberOfSlides={2} // Change the css grid properties for responsiveness
                            // textOnRibbon={"TRENDING NOW"} // All caps
                            // runFunction={data => {
                            //     this.modalClassToggle("show");
                            //     this.setState({ modalType: "imagePreview" });
                            // }}
                            />
                        </div>
                    </div>
                );
            } else if (dummyToggle === "y") {
                return (
                    <div className="imageSliderWrap2">
                        <div className="imageSliderParentWrap">
                            <div className={"downSectionInnerLayer "}>
                                <HtmlSlider
                                    imageWidth={100}
                                    categoryData={designImagesObject} // format of Item
                                // numberOfSlides={2} // Change the css grid properties for responsiveness
                                // textOnRibbon={"TRENDING NOW"} // All caps
                                // runFunction={data => {
                                //     this.modalClassToggle("show");
                                //     this.setState({ modalType: "imagePreview" });
                                // }}
                                />
                            </div>
                        </div>
                    </div>
                );
            }
        }
    };

    returnDesignerDetailsForm = () => {
        const { designImage, designImagesObject, displayMobileValueValidationError, nameRequired, productNameRequired, imageRequired, mobileNoRequired } = this.state;

        return (
            <div className="getDesigncontainer">
                <div className="inputFieldWrapper">
                    <div className="inputWrap">
                        <input
                            type="text"
                            name="designerName"
                            placeholder="Your name here"
                            onChange={(e) => this.setState({ designerName: e.target.value, nameRequired: "hide" })}
                            maxLength="100"
                            ref="designerName"
                        />
                        <span className="InputSeparatorLine"></span>
                        <p className={nameRequired}>please enter your name.</p>
                    </div>

                    <div className="inputWrap">
                        <input
                            type="text"
                            name="mobileNo"
                            placeholder="Your 10 digit mobile no. here"
                            onChange={(e) => {
                                this.checkTypeNumber(e, "mobile")
                                this.setState({ mobileNoRequired: "hide" })
                            }}
                            maxLength="10"
                            ref="mobileNo"
                        />
                        <span className="InputSeparatorLine"></span>
                        <p className={mobileNoRequired}>please enter your mobile number.</p>
                        <p className={displayMobileValueValidationError}>Please keep in mind, number should be valid.</p>
                    </div>
                    <div className="inputWrap">
                        <input
                            type="text"
                            name="productName"
                            placeholder="Product name"
                            onChange={(e) => this.setState({ productName: e.target.value, productNameRequired: "hide" })}
                            maxLength="300"
                            ref="productName"
                        />
                        <span className="InputSeparatorLine"></span>
                        <p className={productNameRequired}>please enter product name.</p>
                    </div>
                </div>

                <div className="imageFieldWrapper">
                    <h3>A sample image of the product (if any)</h3>
                    <div className="imageFieldInnerLayer">
                        <section className="imageUploadreWrapper">
                            <div className="designImageUploaderRender">
                                {
                                    designImage === "" 
                                    ?
                                    (
                                    <div className="designImageUploaderClass">
                                        <ImageUploader
                                            imageType="regularImage" // regularImage || profileImage
                                            resultData={data => {
                                                this.setState({
                                                    designImage: data.imageURL,
                                                    imageRequired: "hide"
                                                });
                                                this.addDesignImage();
                                            }}
                                            showInitialImage={designImage !== "" ? designImage : ""}
                                            imageClassName="designImageClass2"
                                        />
                                    </div>
                                    )
                                    :
                                    (
                                        <div className="designImageUploaderClass" />
                                    )}
                            </div>
                        </section>
                        <section className="imageSliderWrapper">
                            <h3 className={designImagesObject.imagesInCategory.length !== 0 ? "" : "hide"}>Preview</h3>
                            {this.returnHtmlSliderforDesignImagesObject()}
                        </section>
                        {/* <p className={imageRequired}>please check and upload your project images.</p> */}
                    </div>
                    <p className={imageRequired}>please check and upload your project images.</p>
                </div>
            </div>
        )
    };

    render() {
        return (
            <div>
                {this.returnMyModal()}
            </div>
        );
    };
};

export default connect(null, { hitApi, reCustomizeProduct })(AdRequest);