import React, { Component } from 'react';
import Axios from "axios";

import { connect } from "react-redux";
import { api } from '../../../actions/apiLinks';
import { modalLoading } from "../../../actions/modalActions";
import { reCustomizeProduct } from '../../../actions/productCustomizationActions';

import { encryptData, decryptData } from "../../../factories/encryptDecrypt";

import { WhiteButton } from '../../UX/uxComponents';

import { GoogleIcon, LinkedInIcon } from "../../../assets/images/socialNetworkIcons";
import "../../../assets/css/login_signup.css";

class Login extends Component {

    state = {
        userEmailText: null,
        userEmailClass: 'emailText hide',
        userEmailIsValid: false,

        passwordText: null,
        passwordClass: 'passwordText hide',
        passwordIsValid: false,

        dropModalInnerLayer: "dropModalInnerLayer",

        checkingForTheFirstTime: false,
        loadingClass: 'loadingAnim hide',
        mainClass: 'mainClass',

        redirect: false
    };

    componentDidMount = () => {
        const tl = new TimelineMax()

        tl.set(".modalOuterWrapper", {
            perspective: 1000
        })

        tl
            .set(
                ".dropModalInnerLayer",
                {
                    opacity: 0,
                    transformOrigin: "0% 0%",
                    rotationX: 50,
                    background: "white",
                }
            )
            .to(
                ".dropModalInnerLayer",
                0.3,
                {
                    opacity: 1,
                    transformOrigin: "0% 0%",
                    rotationX: 0,
                    ease: "easeIn",
                    background: "none",
                }
            )
    };

    validateEmail(e) {
        let theInput = e.target.value
        let nameRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        let validEmail = nameRegex.test(theInput)
        if (!validEmail) {
            this.setState({
                userEmailText: "Please keep in mind, the email address has to be valid",
                userEmailClass: 'emailText',
                userEmailIsValid: false
            })
        }

        else if (validEmail && theInput.includes('.')) {
            this.setState({
                userEmailText: null,
                userEmailClass: 'emailText hide',
                userEmailIsValid: true
            })
        }

        else {
            this.setState({
                userEmailText: "Please keep in mind, the email address has to be valid",
                userEmailClass: 'emailText',
                userEmailIsValid: false
            })
        }
    };

    validatePassword(e) {
        const { key } = e
        let theInput;

        if (key !== 'Enter') theInput = e.target.value + key

        else theInput = e.target.value

        if (theInput.length < 6) {
            this.setState({
                passwordText: "Please keep in mind, the password has to be atleast 6 characters long.",
                passwordClass: 'passwordText',
                passwordIsValid: false
            })
        }
        else {
            this.setState({
                passwordText: null,
                passwordClass: 'passwordText hide',
                passwordIsValid: true
            })
        }

        if (key === "Enter") {
            this.validateAndSubmit()
        }

    };

    validateAndSubmit = () => {

        if ((this.state.userEmailIsValid && this.state.passwordIsValid)) {
            this.setState({
                loadingClass: 'loadingAnim',
                mainClass: 'mainClass hide',
            })

            this.props.modalLoading(true)

            let rawData = {
                emailId: this.refs.emailAddress.value,
                password: this.refs.pWord.value,
            }

            //
            // Encrypt data
            //
            const encryptedData = encryptData(rawData)
            //
            // Encrypt data
            //

            const requestData = {
                requestData: encryptedData,
                message: "User trying to log in"
            }

            Axios.post(api.USER_LOGIN, requestData,
                {
                    headers: {
                        'accept': 'application/json',
                        'Accept-Language': 'en-US,en;q=0.8',
                        "Content-Type": "application/json",
                    },
                    withCredentials: true
                })

                .then(res => {

                    //
                    // DECRYPT REQUEST DATA
                    // 
                    let decryptedData = decryptData(
                        res.data.responseData
                    )
                    //
                    // DECRYPT REQUEST DATA
                    //


                    if (!decryptedData.registered) {
                        this.props.modalLoading(false)
                        this.setState({
                            passwordText: "Sorry, you have not yet registered with us. Please sign-up",
                            passwordClass: 'passwordText',
                            passwordIsValid: true,
                            loadingClass: 'loadingAnim hide',
                            mainClass: 'mainClass',
                        })
                    }


                    if (!decryptedData.passwordRight) {
                        this.props.modalLoading(false)
                        this.setState({
                            passwordText: "Your password doesnot match the one in our records. Try logging in through google or linkedIn.",
                            passwordClass: 'passwordText',
                            passwordIsValid: true,
                            loadingClass: 'loadingAnim hide',
                            mainClass: 'mainClass',
                        })
                    }


                    if (decryptedData.passwordRight && decryptedData.registered) {
                        localStorage.setItem('loginThrough', 'form')
                        this.props.modalLoading(false)

                        if (decryptedData.userType === "commonUser") {

                            this.setState({
                                loadingClass: 'loadingAnim',
                                mainClass: 'mainClass hide',
                            })

                            this.props.modalLoading(false)
                            if(this.props.modalFlipper) this.props.functionToRunAfterLogInSuccessful()
                            else location.reload()
                        }

                        else {
                            // this.setState({
                            //     loadingClass: 'loadingAnim',
                            //     mainClass: 'mainClass hide',
                            // })

                            this.props.modalLoading(false)

                            this.setState({
                                passwordText: "Sorry, you have not yet registered with us. Please sign-up",
                                passwordClass: 'passwordText',
                                passwordIsValid: true,
                                loadingClass: 'loadingAnim hide',
                                mainClass: 'mainClass',
                            })

                            // window.open('/register')
                        }

                        // if(res.data.userType === "faculty")
                        //     window.open('/faculty/profile-details', '_self')

                        // if (res.data.userType === "architect")
                        //     window.open('/architect/profile-details', '_self')
                    }

                })
                .catch(err => {
                    console.error('bad', err)
                    throw err
                })
        }

        else {
            if (this.refs.emailAddress.value === '')
                this.setState({
                    userEmailText: "You have to provide an email. It cannot be empty.",
                    userEmailClass: 'emailText',
                    userEmailIsValid: false,
                })

            if (this.refs.pWord.value === '')
                this.setState({
                    passwordText: "You have to give a password. It cannot be empty.",
                    passwordClass: 'passwordText',
                    passwordIsValid: false,
                })
        }
    };

    changeToDifferentModal = () => {
        const tl = new TimelineMax()

        tl.set(".modalOuterWrapper", {
            perspective: 1000
        })

        tl
            .set(
                ".dropModalInnerLayer",
                {
                    transformOrigin: "0% 0%",
                    rotationX: 0,
                    opacity: 1,
                    background: "white",
                }
            )
            .to(
                ".dropModalInnerLayer",
                0.25,
                {
                    opacity: 0,
                    transformOrigin: "0% 0%",
                    rotationX: 50,
                    ease: "easeIn",
                    background: "none",
                    onComplete: () => {
                        this.props.modalFlipper("flipToSignUp")
                    }
                }
            )
    };

    render() {
        return (
            <div className="modalOuterWrapper">
                <div className={this.state.dropModalInnerLayer}>
                    <div className="loginModalContainerOne">
                        <div className="loginModalContainerInnerLayer">
                            <div className="formComponent">
                                <div className="forminputSection">
                                    <div className="inputWrapper">
                                        <input
                                            ref="emailAddress"
                                            type="email"
                                            placeholder="Type your email address here"


                                            onChange={(e) => this.validateEmail(e)}
                                        />
                                        <span className="InputSeparatorLine"> </span>
                                        <p className={this.state.userEmailClass}> {this.state.userEmailText} </p>
                                    </div>

                                    <div className="inputWrapper">
                                        <input
                                            ref="pWord"
                                            type="password"
                                            placeholder="Type your password here"
                                            onKeyPress={(e) => this.validatePassword(e)}
                                        />
                                        <span className="InputSeparatorLine"> </span>
                                        <p className={this.state.passwordClass}> {this.state.passwordText} </p>
                                    </div>
                                </div>

                                <div className="buttonContainer">
                                    <a>
                                        <div
                                            className="letsGoButton"
                                            onClick={() => {
                                                this.validateAndSubmit()
                                            }}
                                        >
                                            <WhiteButton
                                            >
                                                Get in!
                                            </WhiteButton>
                                        </div>
                                    </a>
                                    <p className={this.props.modalFlipper ? "show" : "hide"}>If you don’t have an account, register
                                        <span
                                            onClick={() => {
                                                this.changeToDifferentModal()
                                            }}
                                        > here </span>
                                    </p>
                                </div>
                            </div>

                            <h2>OR</h2>

                            <div className="socialNetworksForm">
                                <div
                                    className="socialConnectBtn"
                                    onClick={() => {
                                        localStorage.setItem("loginThrough", 'google')
                                        window.open(api.KNOCK_GOOGLE_COMMON_USER, '_self')
                                    }}
                                >
                                    <div className="iconBtn flexRowDiv">
                                        <GoogleIcon />
                                        <p>Connect with Google</p>
                                    </div>
                                </div>

                                <div
                                    className="socialConnectBtn"
                                    onClick={() => {
                                        localStorage.setItem("loginThrough", 'linkedin')
                                        window.open(api.KNOCK_LINKEDIN_COMMON_USER, '_self')

                                    }}
                                >
                                    <div className="iconBtn flexRowDiv">
                                        <LinkedInIcon />
                                        <p>Connect with LinkedIn</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className={this.props.modalFlipper ? "sign-up-option" : "hide"}>
                            <p>Don't have an account yet?</p>

                            <WhiteButton
                                runFunction={() => {
                                    this.changeToDifferentModal()
                                }}
                            >
                                Sign Up
                            </WhiteButton>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
};

export default connect(null, { modalLoading, reCustomizeProduct })(Login);