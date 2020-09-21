import React, { Component } from 'react';
import { connect } from 'react-redux';

import { reCustomizeProduct } from '../../../actions/productCustomizationActions';
import { ModalTransitionLoader } from '../../common/loaders/modalTransitionLoader';
import { WhiteButton } from '../../UX/uxComponents';
import GenericModal from '../../UX/genericModal';

import { Image } from "cloudinary-react";
import PublicId from "../../../factories/cloudinaryFactory";
import Axios from 'axios';
import { api } from '../../../actions/apiLinks';
import { encryptData, decryptData } from '../../../factories/encryptDecrypt';
import { OTP_API_KEY } from '../../../config/otp';


class SubscribeModal extends Component {

    state = {
        subscribeClientName: "",
        subscribeClientEmail: "",
        subscribeClientMobileNo: null,

        nameRequired: "hide",
        emailRequired: "hide",
        mobileNoRequired: "hide",
        callTimeRequired: "hide",

        otpButton: "hide",
        // "dataInput otp-input"{ otpInput }
        otpInput: "hide",

        mobileExist: "hide",
        emailExist: "hide",
        finalProceed: "sendRequest",
        proceedButton: "hide",

        displayMobileValueValidationError: "displayMobileValueValidationError hide",
        displayEmailValueValidationError: "displayEmailValueValidationError hide",

        isLoading: false,
        otpError: false
    };

    checkType = (e, type) => {
        const val = e.target.value,
            regExNumber = /^[0-9]{10}$/,
            regExEmail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if (val !== null) {
            if (type === "number") {
                if (regExNumber.test(val) === true) {
                    this.setState({
                        subscribeClientMobileNo: Number(val),
                        displayMobileValueValidationError: "displayMobileValueValidationError hide"
                    });
                }

                else if (regExNumber.test(val) === false) {
                    this.setState({
                        subscribeClientMobileNo: null,
                        displayMobileValueValidationError: "displayMobileValueValidationError"
                    });
                }
            }

            else if (type === "email") {
                if (regExEmail.test(String(val).toLowerCase())) {
                    this.setState({
                        subscribeClientEmail: val,
                        displayEmailValueValidationError: "displayEmailValueValidationError hide"
                    })
                }

                else if (regExEmail.test(String(val).toLowerCase()) === false) {
                    this.setState({
                        subscribeClientEmail: "",
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

    proceedHandler = () => {
        const { subscribeClientName, subscribeClientEmail, subscribeClientMobileNo } = this.state;

        if (subscribeClientName !== "" && subscribeClientEmail !== "" && subscribeClientMobileNo !== null) {
            this.handleSendOTP()
        }

        else {
            if (subscribeClientName === "") this.setState({ nameRequired: "show" });
            if (subscribeClientEmail === "") this.setState({ emailRequired: "show" });
            if (subscribeClientMobileNo === null) this.setState({ mobileNoRequired: "show" });
        }
    };

    handleSendOTP = async () => {

        await Axios.get(`https://2factor.in/API/V1/${OTP_API_KEY}/SMS/${this.state.subscribeClientMobileNo}/AUTOGEN/ROLLINGLOGS`)
        .then(res => {
            this.setState({
                sessionId: res.data.Details
            })
        })
        .catch(err => console.log(err))
    };

    handleVerifyOTP = (OTP) => {
       Axios.get(`https://2factor.in/API/V1/${OTP_API_KEY}/SMS/VERIFY/${this.state.sessionId}/${OTP}`)
        .then(res => {

            if (res.data.Details === "OTP Matched") {
                this.setState({ 
                    proceedButton: "proceedButtonContainer",
                    otpButton: "hide"
                })
            }

            else this.setState({ 
                otpError: true ,
                correctOtp: "otp-error"
            });
        })
        .catch(err => console.log(err))
    };

    dataToSend = async () => {
        const { subscribeClientName, subscribeClientEmail, subscribeClientMobileNo, proceedButton } = this.state;
        this.setState({
            isLoading: true
        })

        let dataToBackend = {
            name: subscribeClientName,
            emailId: subscribeClientEmail,
            mobile: subscribeClientMobileNo
        };

        let encryptedData = encryptData(dataToBackend);

        dataToBackend = { requestData: encryptedData }

        await Axios.post(api.CREATE_NEWSLETTER_SUBSCRIBER, dataToBackend)
            .then(res => {
                let decryptedData = decryptData(res.data.responseData);

                if (decryptedData.itsTaken) this.setState({ isLoading: false, emailExist: "show" })
                else this.setState({ finalProceed: "requestSubmitted" })
            })
            .catch(err => console.log(err))

        this.props.reCustomizeProduct("close")
    }
  
    checkNumber = (e) => {
        if(e.target.value.length === 10){
            this.setState({
                otpButton: "button-container"
            })
        }
        else{
            this.setState({
                otpButton: "hide"
            }) 
        }
    }

    returnSubscriptionForm = () => {
        const { 
            displayMobileValueValidationError, 
            displayEmailValueValidationError, 
            emailExist, 
            nameRequired, 
            emailRequired, 
            mobileNoRequired,
            subscribeClientName,
            subscribeClientEmail,
            subscribeClientMobileNo,
            otpButton,
            otpInput,
            proceedButton,
        } = this.state;
        
        return(
            <div>
                <div className="input-section-container">
                    <div className="dataInput">
                        <input
                            type="text"
                            name="ClientName"
                            placeholder="Full name here"
                            onChange={(e) => {
                                this.setState({ 
                                    subscribeClientName: e.target.value, 
                                    nameRequired: "hide" 
                                })
                            }}
                            maxLength="100"
                            ref="subscribeClientName"
                            value={subscribeClientName ? subscribeClientName : ""}
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
                            defaultValue={subscribeClientEmail ? subscribeClientEmail : ""}
                        />
                        <span className="InputSeparatorLine"></span>
                        <p className={displayEmailValueValidationError !== "displayEmailValueValidationError" ? emailRequired : "hide"}>please enter your email address.</p>
                        <p className={displayEmailValueValidationError}>Please keep in mind, email should be valid.</p>
                        <p className={emailExist}>This email is already subscribed, please enter different email.</p>
                    </div>
                    <div className="dataInput">
                        <div className="otp-generate-input">
                            <div className="input-container">
                                <input
                                    type="text"
                                    name="mobileNo"
                                    id="mobileNoColumn"
                                    placeholder="Your 10 digit mobile no. here"
                                    onChange={(e) => {
                                        this.checkType(e, "number")
                                        this.setState({ mobileNoRequired: "hide" })
                                        this.checkNumber(e)
                                    }}
                                    maxLength="10"
                                    ref="mobileNo"
                                    defaultValue={subscribeClientMobileNo ? subscribeClientMobileNo : ""}
                                />
                                <span className="InputSeparatorLine"></span>
                                <p className={displayMobileValueValidationError !== "displayMobileValueValidationError" ? mobileNoRequired : "hide"}>please enter your mobile number.</p>
                                <p className={displayMobileValueValidationError}>Please keep in mind, number should be valid.</p>
                                {/* <p className={mobileExist}>This mobile number is already subscribed, please enter different mobile number.</p> */}
                            </div>
                            <div 
                                className={otpButton}
                                onClick={() => {
                                        this.proceedHandler()
                                        document.getElementById("mobileNoColumn").setAttribute("readonly", true);
                                        this.setState({
                                            otpInput: "dataInput otp-input"
                                        })
                                    }
                                }
                                >
                                <WhiteButton>
                                    Send OTP
                                </WhiteButton>
                            </div>
                        </div>
                    </div>
                    <div 
                        className={otpInput}
                    >
                        <input
                            type="text"
                            placeholder="Enter OTP here"
                            onChange={(e) => {
                                let otpInput = e.target.value;

                                if (otpInput.length === 6) this.handleVerifyOTP(otpInput)
                            }}
                            maxLength="6"
                            ref="otpNumber"
                        />
                        <span className="InputSeparatorLine"></span>
                    </div>
                </div>
                <div className={proceedButton}>
                    <WhiteButton
                        runFunction={() =>
                            //  this.props.reCustomizeProduct("close")
                            this.dataToSend()
                        }
                    >
                        Verify and proceed
                    </WhiteButton>
                </div>
            </div>
        )
    };

    returnSubscriptionModal = () => {

        const { finalProceed, isLoading } = this.state;
        
        if (finalProceed === "sendRequest") {
            if (isLoading) {
                return(
                    <div>
                        <ModalTransitionLoader />
                        <p>Thanks for subscribing to our newsletter.</p>
                    </div>
                ) 
            }

            else {
                return this.returnSubscriptionForm()
            }
        }

        else if (finalProceed === "requestSubmitted") {
            return <p>Thanks for subscribing to our newsletter.</p>
        }
    };

    render() {
        return (
            <div className="subscribe-form-outer-layer">
                <div className="image-wrapper">
                    <div className="winner-text">
                        <p>Previous winner : Rahul Joshi</p>
                    </div>
                </div>
                <div
                    ref="cloudinaryImage" 
                    className="subscription-form-innner-layer">
                    {this.returnSubscriptionModal()}
                </div>
            </div>
        )
    }
}

export default connect(null, { reCustomizeProduct })(SubscribeModal);
