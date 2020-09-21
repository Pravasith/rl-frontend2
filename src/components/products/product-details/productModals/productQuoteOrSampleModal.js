import React, { Component } from 'react';
import { connect } from "react-redux";

import { api } from '../../../../actions/apiLinks';
import { hitApi } from '../../../../actions/generalActions';
import { reCustomizeProduct } from '../../../../actions/productCustomizationActions';

import { WhiteButton } from '../../../UX/uxComponents';
import GenericModal from './../../../UX/genericModal';

import { ModalTransitionLoader } from '../../../common/loaders/modalTransitionLoader';

class ProductQuoteOrSampleModal extends Component {

    state = {
        clientName: "",
        clientEmail: "",
        clientMobileNo: null,
        clientCallTime: "",

        color: "",
        finish: "",
        material: "",
        size: "",

        radioButton1: "checkBox",
        radioButton2: "checkBox",

        nameRequired: "hide",
        emailRequired: "hide",
        mobileNoRequired: "hide",
        callTimeRequired: "hide",

        displayMobileValueValidationError: "displayMobileValueValidationError hide",
        displayEmailValueValidationError: "displayEmailValueValidationError hide",
    };

    // componentDidMount() {
    //     this.handleValues();
    // }

    checkType = (e, type) => {
        const val = e.target.value,
            regExNumber = /^[0-9]{10}$/,
            regExEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (val !== null) {
            if (type === "number") {
                if (regExNumber.test(val) === true) {
                    this.setState({
                        clientMobileNo: Number(val),
                        displayMobileValueValidationError: "displayMobileValueValidationError hide"
                    });
                }

                else if (regExNumber.test(val) === false) {
                    this.setState({
                        clientMobileNo: null,
                        displayMobileValueValidationError: "displayMobileValueValidationError"
                    });
                }
            }

            else if (type === "email") {
                if (regExEmail.test(String(val).toLowerCase())) {
                    this.setState({
                        clientEmail: val,
                        displayEmailValueValidationError: "displayEmailValueValidationError hide"
                    })
                }

                else if (regExEmail.test(String(val).toLowerCase()) === false) {
                    this.setState({
                        clientEmail: "",
                        displayEmailValueValidationError: "displayEmailValueValidationError"
                    });
                }
            }
        }

        else if (val === null) {
            this.setState({
                displayMobileValueValidationError: "displayMobileValueValidationError hide",
                displayEmailValueValidationError: "displayEmailValueValidationError hide"
            })
        }
    };

    // handleValues = () => {
    //     const { colorOrFinishSelected, materialSelected, sizeSelected, quantityRequired } = this.props.newCustomOptionData;

    //     if (colorOrFinishSelected) {
    //         if (colorOrFinishSelected.colorName) {
    //             this.setState({
    //                 color: {
    //                     colorName: colorOrFinishSelected.colorName,
    //                     colorCode: colorOrFinishSelected.colorCode,
    //                     colorCost: Number(colorOrFinishSelected.colorCost)
    //                 }
    //             })
    //         }

    //         else if (colorOrFinishSelected.finishName) {
    //             this.setState({
    //                 finish: {
    //                     finishImage: colorOrFinishSelected.finishImage,
    //                     finishCode: colorOrFinishSelected.finishCode,
    //                     finishCost: Number(colorOrFinishSelected.finishCost)
    //                 }
    //             })
    //         }
    //     }

    //     if (materialSelected) {
    //         if (materialSelected.materialName) {
    //             this.setState({
    //                 material: {
    //                     materialName: materialSelected.materialName,
    //                     materialGrade: materialSelected.materialGrade,
    //                     materialCost: Number(materialSelected.materialCost)
    //                 }
    //             })
    //         }
    //     }

    //     if (sizeSelected) {
    //         if (sizeSelected.sizeName) {
    //             this.setState({
    //                 size: {
    //                     sizeName: sizeSelected.sizeName,
    //                     sizeCost: Number(sizeSelected.sizeCost)
    //                 }
    //             })
    //         }
    //     }
    // }

    proceedHandler = async () => {
        const { clientName, clientEmail, clientMobileNo, clientCallTime, color, finish, material, size } = this.state;
        const { productData, productLink } = this.props.miscellaneousData;

        if (clientName !== "" && clientEmail !== "" && clientMobileNo !== null && clientCallTime !== "") {
            this.setState({
                finalProceed: "sendRequest"
            });

            const dataToBackend = {
                name: clientName,
                emailId: clientEmail,
                mobileNo: clientMobileNo,
                callTimings: clientCallTime,
                productLink,
                productData
            }
            // console.log(dataToBackend)

            this.props.hitApi(api.PRODUCT_QUOTE_REQUEST, "POST", {
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
                                reqFrom: "requestQuote"
                            }
                        )
                    }

                    else {
                        this.props.reCustomizeProduct(
                            "open",
                            {
                                dropdownModal: "dropdownInModal",
                                modalType: "errorScreen",
                                reqFrom: "requestQuote"
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
                            reqFrom: "requestQuote"
                        }
                    )
                })
        }

        else {
            if (clientName === "") this.setState({ nameRequired: "show" });
            if (clientEmail === "") this.setState({ emailRequired: "show" });
            if (clientMobileNo === null) this.setState({ mobileNoRequired: "show" });
            if (clientCallTime === "") this.setState({ callTimeRequired: "show" });
        }
    };

    closeTheModal = () => {
        this.props.reCustomizeProduct("close")
    };

    returnRequestModal = () => {
        const { modalType } = this.props,
            { displayMobileValueValidationError, displayEmailValueValidationError, nameRequired, emailRequired, mobileNoRequired, callTimeRequired, finalProceed } = this.state;

        if (modalType === "requestQuote") {
            return (
                <div className="materialReuestQuote">
                    <div className="materialReuestQuoteInnerLayer">
                        <div className="inputSectionContainer">
                            <div className="dataInput">
                                <input
                                    type="text"
                                    name="designerName"
                                    placeholder="Your name here"
                                    onChange={(e) => this.setState({ clientName: e.target.value, nameRequired: "hide" })}
                                    maxLength="100"
                                    ref="clientName"
                                />
                                <span className="InputSeparatorLine"></span>
                                <p className={nameRequired}>please enter your name.</p>
                            </div>

                            <div className="dataInput">
                                <input
                                    type="email"
                                    name="email"
                                    placeholder="Your email here"
                                    onChange={(e) => {
                                        this.checkType(e, "email")
                                        this.setState({ emailRequired: "hide" })
                                    }}
                                    ref="email"
                                />
                                <span className="InputSeparatorLine"></span>
                                <p className={displayEmailValueValidationError !== "displayEmailValueValidationError" ? emailRequired : "hide"}>please enter your email address.</p>
                                <p className={displayEmailValueValidationError}>please check and enter your valid email address.</p>
                            </div>

                            <div className="dataInput">
                                <input
                                    type="text"
                                    name="mobileNo"
                                    placeholder="Your 10 digit mobile no. here"
                                    onChange={(e) => {
                                        this.checkType(e, "number")
                                        this.setState({ mobileNoRequired: "hide" })
                                    }}
                                    maxLength="10"
                                    ref="mobileNo"
                                />
                                <span className="InputSeparatorLine"></span>
                                <p className={displayMobileValueValidationError !== "displayMobileValueValidationError" ? mobileNoRequired : "hide"}>please enter your mobile number.</p>
                                <p className={displayMobileValueValidationError}>please check and enter your valid mobile number.</p>
                            </div>
                        </div>

                        <div className="callTimingContainer">
                            <div className="callTimingContainerInnerLayer">
                                <div className="timingHeaderContainer">
                                    <h1>Call me during</h1>
                                </div>
                                    <div className="timingContentOuterLayer">
                                        <div
                                            className="timingContent"
                                            onClick={() => this.setState({ clientCallTime: "BH", callTimeRequired: "hide", radioButton1: "checkBoxSelect", radioButton2: "checkBox" })}
                                        >
                                            <div className={this.state.radioButton1}></div>
                                            <p>Business hours (10 a.m. to 5 p.m.)</p>
                                        </div>
                                        <div
                                            className="timingContent"
                                            onClick={() => this.setState({ clientCallTime: "NBH", callTimeRequired: "hide", radioButton2: "checkBoxSelect", radioButton1: "checkBox" })}
                                        >
                                            <div className={this.state.radioButton2}></div>
                                            <p>Non -business hours (8 a.m. to 10 a.m. Or 5 p.m. to 8 p.m.)</p>
                                        </div>
                                    </div>
                                <p className={callTimeRequired !== "show" ? "hide" : "displayCallTimeValueValidationError"}>
                                    please choose your comfortable time to have a word with us.
                                    </p>
                            </div>
                        </div>

                        <div className="proceedButtonContainer">
                            <WhiteButton
                                runFunction={() => this.proceedHandler()}
                            >
                                Proceed
                                </WhiteButton>
                        </div>
                    </div>
                </div>

            )
        }
    };

    render() {
        return (
            <GenericModal
                heading="Ask for a quote, we will contact you in 6 hours with exact prices"
                backgroundImage="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/askForProductsBackground.png"
                closeTheModal={this.closeTheModal}
            >
                {this.state.finalProceed !== "sendRequest" ? this.returnRequestModal() : <ModalTransitionLoader />}
            </GenericModal>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        newCustomOptionData: state.newCustomOptionData,
    }
};

export default connect(mapStateToProps, { hitApi, reCustomizeProduct })(ProductQuoteOrSampleModal);