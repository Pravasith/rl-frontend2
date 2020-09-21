import React, { Component } from 'react';
import { connect } from "react-redux";

import { api } from '../../actions/apiLinks';
import { hitApi } from '../../actions/generalActions';
import { reCustomizeProduct } from '../../actions/productCustomizationActions';

import GenericModal from "../UX/genericModal";
import ImageUploader from "../UX/imageUploader";
import HtmlSlider from "../UX/htmlSlider";
import { WhiteButton } from '../UX/uxComponents';

import {ModalTransitionLoader} from './../common/loaders/modalTransitionLoader';

import "../../assets/css/custom_design.css";

class DesignerFormModal extends Component {

    state = {
        designerName: "",
        designerMobileNo: null,
        designerEmail: "",
        designImage: "",
        designImagesObject: {
            categoryName: "",
            imagesInCategory: []
        },

        dummyToggle: "x",

        displayMobileValueValidationError: "displayMobileValueValidationError hide",

        nameRequired: "hide",
        mobileNoRequired: "hide",
        emailRequired: "hide",
        imageRequired: "hide",
        dropdownModal: "dropdownInModal hide"
    };

    returnDesignerDetailsForm = () => {
        const { designImage, designImagesObject, displayMobileValueValidationError, nameRequired, imageRequired, emailRequired, mobileNoRequired } = this.state;

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
                        <p className={mobileNoRequired}>please check and enter your valid mobile number.</p>
                        <p className={displayMobileValueValidationError}>Numbers Only</p>
                    </div>

                    <div className="inputWrap">
                        <input
                            type="email"
                            name="email"
                            placeholder="Your email address here"
                            onChange={(e) => this.checkTypeEmail(e)}
                            ref="email"
                        />
                        <span className="InputSeparatorLine"></span>
                        <p className={emailRequired}>please enter your valid email address.</p>
                    </div>
                </div>

                <div className="imageFieldWrapper">
                    <h3>Upload detailed measurement drawings (3D renders would help a lot) of your design to be executed</h3>
                    <div className="imageFieldInnerLayer">
                        <section className="imageUploadreWrapper">
                            <div className="designImageUploaderRender">
                                {designImage === "" ?
                                    (<div className="designImageUploaderClass">
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
                                    </div>)
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
                    </div>
                    <p className={imageRequired}>please check and upload your project images.</p>
                </div>
            </div>
        )
    };

    proceedHandler = () => {
        const { designImagesObject, designerName, designerMobileNo, designerEmail } = this.state;

        if (designerName !== "" && designerMobileNo !== null && designerEmail !== "" && designImagesObject.imagesInCategory.length !== 0) {
            this.setState({
                finalProceed: "sendRequest"
            });

            const dataToSendBackend = {
                name: designerName,
                mobileNo: designerMobileNo,
                emailId: designerEmail,
                referenceImages: designImagesObject.imagesInCategory
            }

            this.props.hitApi(api.CUSTOM_DESIGN_ENQUIRY, "POST", {
                requestData: dataToSendBackend,
                message: "Requesting for advertisement, The Rock"
            })
                .then((data) => {
                    let { responseCode } = data.payload;

                    if (responseCode === 200) {
                        this.props.reCustomizeProduct(
                            "open",
                            {
                                dropdownModal: "dropdownInModal",
                                modalType: "successScreen",
                                reqFrom: "designerForm"
                            }
                        )
                    }

                    else {
                        this.props.reCustomizeProduct(
                            "open",
                            {
                                dropdownModal: "dropdownInModal",
                                modalType: "errorScreen",
                                reqFrom: "designerForm"
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
                            reqFrom: "designerForm"
                        }
                    )
                })

        }

        if (designerName === "") this.setState({ nameRequired: "show" });
        if (designerMobileNo === null) this.setState({ mobileNoRequired: "show" });
        if (designerEmail === "") this.setState({ emailRequired: "show" });
        if (designImagesObject.imagesInCategory.length === 0) this.setState({ imageRequired: "show" });
    };

    returnDesignerFormModal = () => {
        const { finalProceed } = this.state;

        return (
            <GenericModal
                heading="Give us your design and let us execute your design for you"
                backgroundImage="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/askForProductsBackground.png"
                closeTheModal={this.closeTheModal}
            >
                <div>
                    <div className="returnModalContent">
                        {finalProceed !== "sendRequest" ? this.returnDesignerDetailsForm() : <ModalTransitionLoader />}
                    </div>
                    <div className="proceedButtonContainer">
                        <WhiteButton
                            runFunction={() => this.proceedHandler()}
                        >
                            Proceed
                        </WhiteButton>
                    </div>
                </div>
            </GenericModal>
        )
    };

    closeTheModal = () => {
        this.props.reCustomizeProduct("close");

        this.setState({
            designImagesObject: {
                categoryName: "",
                imagesInCategory: []
            },

            imageRequired: "hide",
            nameRequired: "hide",
            mobileNoRequired: "hide",
            emailRequired: "hide"
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

    checkTypeEmail = (e) => {
        const val = e.target.value,
            regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (regEx.test(String(val).toLowerCase()) !== false) this.setState({ designerEmail: val, emailRequired: "hide" });
        else this.setState({ designerEmail: "", emailRequired: "show" })
    }

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
                                textOnRibbon={"TRENDING NOW"} // All caps
                                runFunction={data => {
                                    this.modalClassToggle("show");
                                    this.setState({ preview: "imagePreview" });
                                }}
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
                                    textOnRibbon={"TRENDING NOW"} // All caps
                                    runFunction={data => {
                                        this.modalClassToggle("show");
                                        this.setState({ preview: "imagePreview" });
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                );
            }
        }
    };

    render() {
        return (
            <div>
                {this.returnDesignerFormModal()}
            </div>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        openOrCloseModal: state.openOrCloseModal
    }
};

export default connect(mapStateToProps, { hitApi, reCustomizeProduct })(DesignerFormModal);