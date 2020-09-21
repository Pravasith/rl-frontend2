import React, { Component } from 'react';
import { connect } from "react-redux";

import { api } from "../../actions/apiLinks";
import { hitApi } from "../../actions/generalActions";
import { reCustomizeProduct } from '../../actions/productCustomizationActions';

import { WhiteButton } from '../UX/uxComponents';
import GenericModal from '../UX/genericModal';

import { ModalTransitionLoader } from '../common/loaders/modalTransitionLoader';

class PaidAdModal extends Component {

    state = {
        paidAdClientName: "",
        paidAdClientEmail: "",
        paidAdClientMobileNo: null,

        nameRequired: "hide",
        emailRequired: "hide",
        mobileNoRequired: "hide",
        callTimeRequired: "hide",

        displayMobileValueValidationError: "displayMobileValueValidationError hide",
        displayEmailValueValidationError: "displayEmailValueValidationError hide",
    };

    checkType = (e, type) => {
        const val = e.target.value,
            regExNumber = /^[0-9]{10}$/,
            regExEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (val !== null) {
            if (type === "number") {
                if (regExNumber.test(val) === true) {
                    this.setState({
                        paidAdClientMobileNo: Number(val),
                        displayMobileValueValidationError: "displayMobileValueValidationError hide"
                    });
                }

                else if (regExNumber.test(val) === false) {
                    this.setState({
                        paidAdClientMobileNo: null,
                        displayMobileValueValidationError: "displayMobileValueValidationError"
                    });
                }
            }

            else if (type === "email") {
                if (regExEmail.test(String(val).toLowerCase())) {
                    this.setState({
                        paidAdClientEmail: val,
                        displayEmailValueValidationError: "displayEmailValueValidationError hide"
                    })
                }

                else if (regExEmail.test(String(val).toLowerCase()) === false) {
                    this.setState({
                        paidAdClientEmail: "",
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

    closeTheModal = () => {
        this.props.reCustomizeProduct("close");
    };

    proceedHandler = async () => {
        const { paidAdClientName, paidAdClientEmail, paidAdClientMobileNo } = this.state;

        if (paidAdClientName !== "" && paidAdClientEmail !== "" && paidAdClientMobileNo !== null) {
            this.setState({
                finalProceed: "sendRequest"
            });

            const dataToBackend = {
                name: paidAdClientName,
                emailId: paidAdClientEmail,
                mobileNo: paidAdClientMobileNo
            };

            this.props.hitApi(api.VENDOR_AD_REQUEST, "POST", {
                requestData: dataToBackend,
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
                                reqFrom: "paidAd"
                            }
                        )
                    }

                    else {
                        this.props.reCustomizeProduct(
                            "open",
                            {
                                dropdownModal: "dropdownInModal",
                                modalType: "errorScreen",
                                reqFrom: "paidAd"
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
                            reqFrom: "paidAd"
                        }
                    )
                })
        }

        else {
            if (paidAdClientName === "") this.setState({ nameRequired: "show" });
            if (paidAdClientEmail === "") this.setState({ emailRequired: "show" });
            if (paidAdClientMobileNo === null) this.setState({ mobileNoRequired: "show" });
        }
    };

    returnPaidAdForm = () => {
        const { displayMobileValueValidationError, displayEmailValueValidationError, nameRequired, emailRequired, mobileNoRequired } = this.state;

        return (
            <div className="adRequestQuote">
                <div className="adRequestQuoteInnerLayer">
                    <div className="inputAreaSection">
                        <div className="inputSectionContainer">
                            <div className="dataInput">
                                <input
                                    type="text"
                                    name="designerName"
                                    placeholder="Your name here"
                                    onChange={(e) => this.setState({ paidAdClientName: e.target.value, nameRequired: "hide" })}
                                    maxLength="100"
                                    ref="paidAdClientName"
                                />
                                <span className="InputSeparatorLine"></span>
                                <p className={nameRequired}>please enter your name.</p>
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
                                <p className={displayMobileValueValidationError}>Please keep in mind, number should be valid.</p>
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
                                <p className={displayEmailValueValidationError}>Please keep in mind, email should be valid.</p>
                            </div>
                        </div>
                        <div className="callback">
                            <h3>You can expect the call from our executive in 6 hours</h3>
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
    };

    returnPaidAdModal = () => {
        const { finalProceed } = this.state;

        return (
            <GenericModal
                heading="Ad display request"
                backgroundImage="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/bgd-ad-display-request.png"
                closeTheModal={this.closeTheModal}
            >
                {finalProceed !== "sendRequest" ? this.returnPaidAdForm() : <ModalTransitionLoader />}
            </GenericModal>
        )
    };

    render() {
        return (
            <div>
                {this.returnPaidAdModal()}
            </div>
        );
    };
};

export default connect(null, { hitApi, reCustomizeProduct })(PaidAdModal);