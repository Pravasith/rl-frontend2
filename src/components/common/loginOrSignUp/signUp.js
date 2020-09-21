import React, { Component } from 'react';

import Axios from "axios";

import { api } from "../../../actions/apiLinks";

import { encryptData } from '../../../factories/encryptDecrypt';

import { connect } from "react-redux";
import { modalLoading } from "../../../actions/modalActions";

import { WhiteButton } from "../../UX/uxComponents";

import { TimelineMax } from "gsap";

import { GoogleIcon, LinkedInIcon } from "../../../assets/images/socialNetworkIcons";
import "../../../assets/css/login_signup.css";

class SignUp extends Component {

    state = {
        userEmailText: null,
        userEmailClass: 'emailText hide',
        userEmailIsValid: false,

        passwordText: null,
        passwordClass: 'passwordText hide',
        passwordIsValid: false,

        dropModalInnerLayer: "dropModalInnerLayer",

        confirmPasswordText: null,
        confirmPasswordClass: 'confirmPasswordText hide',
        confirmPasswordIsValid: false,

        finalCheckWrapperClass: 'finalCheckWrapper hide',

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
                        this.props.modalFlipper("flipToLogIn")
                    }
                }
            )
    };

    createUserRLId = (userType) => {

        function generateRandomString() {
            var text = ""
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

            for (var i = 0; i < 5; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length))

            return text;
        }

        const prefixCode = generateRandomString()
        const suffixCode = generateRandomString()

        const date = new Date();

        let dateAndTime = {
            "DD": date.getDate(),
            "MM": date.getMonth() + 1,
            "YY": date.getFullYear(),

            "HRS": date.getHours(),
            "MINS": date.getMinutes(),
            "SECS": date.getSeconds(),
            "MILSECS": date.getMilliseconds(),

            "TIME": date.getTime()
        };

        let rLId = prefixCode + dateAndTime.TIME + suffixCode;

        if (userType === "architect") {
            rLId = "ARC-" + rLId
        }

        else if (userType === "vendor") {
            rLId = "VEN-" + rLId
        }

        else if (userType === "student") {
            rLId = "ARCSTU-" + rLId
        }

        else if (userType === "commonUser") {
            rLId = "CLI-" + rLId
        }

        return rLId;

    };

    validateEmail(e) {
        let theInput = e.target.value;

        let nameRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/
        let validEmail = nameRegex.test(theInput)

        if (!validEmail) {
            this.setState({
                userEmailText: "Please keep in mind, the email address has to be valid",
                userEmailClass: 'emailText',
                userEmailIsValid: false
            })
        }

        if (validEmail) {
            if (theInput.includes('.')) {
                this.setState({
                    userEmailText: null,
                    userEmailClass: 'emailText hide',
                    userEmailIsValid: true
                })

            }
        }
    };

    validatePassword(e) {
        let theInput = e.target.value

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
    };

    validateConfirmPassword(e) {
        let theInput = e.target.value

        if (theInput !== this.refs.pWord.value) {
            this.setState({
                confirmPasswordText: "Keep in mind, both passwords should match",
                confirmPasswordClass: 'confirmPasswordText',
                confirmPasswordIsValid: false
            })
        }

        else {
            this.setState({
                confirmPasswordText: null,
                confirmPasswordClass: 'confirmPasswordText hide',
                confirmPasswordIsValid: true
            })
        }
    };

    validateAndSubmit = () => {
        let rawData = {
            emailId: this.refs.emailAddress.value,
            password: this.refs.pWord.value,
            rLId: this.createUserRLId("commonUser")
        };

        // 
        // Encrypt data
        // 
        const encryptedData = encryptData(rawData);
        // 
        // Encrypt data
        // 

        const requestData = {
            requestData: encryptedData,
            message: "create user data"
        };

        if (this.state.userEmailIsValid && this.state.passwordIsValid && this.state.confirmPasswordIsValid) {
            if (this.refs.pWord.value === this.refs.confirmPassword.value) {

                this.props.modalLoading(true);

                this.setState({
                    loadingClass: 'loadingAnim',
                    mainClass: 'mainClass hide',

                    confirmPasswordText: null,
                    confirmPasswordClass: 'confirmPasswordText hide',
                    confirmPasswordIsValid: true,
                })

                Axios.post(api.CREATE_USER,
                    requestData,
                    {
                        headers: {
                            'accept': 'application/json',
                            'Accept-Language': 'en-US,en;q=0.8',
                            "Content-Type": "application/json",
                        },

                        withCredentials: true
                    }
                )
                    .then(res => {
                        if (res.data.itsTaken) {
                            this.props.modalLoading(false)
                            this.setState({
                                userEmailText: `Oops, the email ${this.refs.emailAddress.value.toLowerCase()} is already taken. Please login. Or try again with a different one.`,
                                userEmailClass: 'emailText',
                                // userEmailIsValid : false,
                                loadingClass: 'loadingAnim hide',
                                mainClass: 'mainClass',
                            })
                        }

                        else {
                            this.setState({
                                loadingClass: 'loadingAnim hide',
                                mainClass: 'mainClass',
                            })

                            localStorage.setItem('loginThrough', 'form')

                            this.props.modalLoading(false)
                            console.log(this.props);
                            this.props.functionToRunAfterSignUpSuccessful()
                        }
                    })
                    .catch(err => {
                        console.error('bad', err)
                        throw err
                    })
            }

            else {
                this.setState({
                    confirmPasswordText: "Passwords do not match",
                    confirmPasswordClass: 'confirmPasswordText',
                    confirmPasswordIsValid: false,
                })
            }
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

            if (this.refs.confirmPassword.value === '')
                this.setState({
                    confirmPasswordText: "The above field cannot be empty",
                    confirmPasswordClass: 'confirmPasswordText',
                    confirmPasswordIsValid: false,
                })
        }
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
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {
                                                    if (this.state.userEmailIsValid) {
                                                        this.setState({
                                                            userEmailText: null,
                                                            userEmailClass: 'emailText hide',
                                                            userEmailIsValid: true
                                                        })
                                                        this.validateAndSubmit()
                                                    }

                                                    else {
                                                        this.setState({
                                                            userEmailText: "This is not a valid email id.",
                                                            userEmailClass: 'emailText',
                                                            userEmailIsValid: false
                                                        })
                                                    }
                                                }
                                            }}

                                            onChange={(e) => this.validateEmail(e)}
                                        />
                                        <span className="InputSeparatorLine"> </span>
                                        <p className={this.state.userEmailClass}> {this.state.userEmailText} </p>
                                    </div>
                                    <div className="inputWrapper">
                                        <input
                                            ref="pWord"
                                            type="password"
                                            placeholder="Type a new password here"
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {

                                                    if (this.state.passwordIsValid) {
                                                        this.setState({
                                                            passwordText: null,
                                                            passwordClass: 'passwordText hide',
                                                            passwordIsValid: true
                                                        })

                                                        this.validateAndSubmit()
                                                    }

                                                    else {
                                                        this.setState({
                                                            passwordText: "The password is less than 6 characters.",
                                                            passwordClass: 'passwordText',
                                                            passwordIsValid: false
                                                        })
                                                    }
                                                }
                                            }}

                                            onChange={(e) => this.validatePassword(e)}
                                        />
                                        <span className="InputSeparatorLine"> </span>
                                        <p className={this.state.passwordClass}> {this.state.passwordText} </p>
                                    </div>
                                    <div className="inputWrapper">
                                        <input
                                            ref="confirmPassword"
                                            type="password"
                                            placeholder="Type the password again"
                                            onKeyPress={(e) => {
                                                if (e.key === "Enter") {

                                                    if (this.state.confirmPasswordIsValid) {
                                                        this.setState({
                                                            confirmPasswordText: null,
                                                            confirmPasswordClass: 'confirmPasswordText hide',
                                                            confirmPasswordIsValid: true
                                                        })
                                                        this.validateAndSubmit()
                                                    }

                                                    else {
                                                        this.setState({
                                                            confirmPasswordText: "Passwords do not match!",
                                                            confirmPasswordClass: 'confirmPasswordText',
                                                            confirmPasswordIsValid: false
                                                        })
                                                    }
                                                }
                                            }}

                                            onChange={(e) => this.validateConfirmPassword(e)}
                                        />
                                        <span className="InputSeparatorLine"> </span>
                                        <p className={this.state.confirmPasswordClass}> {this.state.confirmPasswordText} </p>
                                    </div>
                                </div>
                                <div className="buttonContainer">
                                    <a>
                                        <div
                                            className="letsGoButton"
                                            onClick={() => this.validateAndSubmit()}>
                                            <WhiteButton>
                                                Show me whats there!
                                            </WhiteButton>
                                        </div>
                                    </a>
                                    <p className={this.props.modalFlipper ? "show" : "hide"}>
                                        If already have an account, log in
                                        <span
                                            onClick={() => {
                                                this.changeToDifferentModal()
                                            }}
                                        > here
                                        </span>
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
                                        window.open(api.KNOCK_GOOGLE_COMMON_USER, '_self')
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
                            <p className="sg">
                                Do you already have an account?
                            </p>

                            <WhiteButton
                                runFunction={() => {
                                    this.changeToDifferentModal()

                                }}
                            >
                                Log in here
                            </WhiteButton>
                        </div>
                    </div>
                </div>
            </div>
        )
    };
};

export default connect(null, { modalLoading })(SignUp);