import React, { Component } from "react";
import { connect } from "react-redux";

import { api } from "../../actions/apiLinks";
import { hitApi } from "../../actions/generalActions";

import { ModalTransitionLoader } from "../common/loaders/modalTransitionLoader";

import { BehanceSmallIcon, FacebookSmallIcon, InstagramSmallIcon, LinkedinSmallIcon, PinterestSmallIcon, TumblrSmallIcon, TwitterSmallIcon } from '../../assets/images/socialNetworkIcons';
import { WhiteButton } from "../UX/uxComponents";
import { Footer } from './footer';

import '../../assets/css/new_footer.css';

class NewFooter extends Component {

    state = {

        userName: "",
        userMobileNo: null,
        userEmail: "",

        displayMobileValueValidationError: "displayMobileValueValidationError hide",

        userEmail: "",
        nameRequired: "hide",
        mobileNoRequired: "hide",
        emailRequired: "hide",

        screen: "vendorForm"
    };


    returnSocialIcons = () => {
        return (
            <div className="social-network-icon-container">
                <a href="">
                    <div className="icon-container">
                        <BehanceSmallIcon />
                    </div>
                </a>
                <a href="https://www.facebook.com/rollinglogs">
                    <div className="icon-container">
                        <FacebookSmallIcon />
                    </div>
                </a>
                <a href="https://www.instagram.com/rolling_logs/">
                    <div className="icon-container">
                        <InstagramSmallIcon />
                    </div>
                </a>
                <a href="https://linkedin.com/showcase/rolling-logs">
                    <div className="icon-container">
                        <LinkedinSmallIcon />
                    </div>
                </a>
                <a href="https://in.pinterest.com/rollinglogs/">
                    <div className="icon-container">
                        <PinterestSmallIcon />
                    </div>
                </a>
                <a href="">
                    <div className="icon-container">
                        <TumblrSmallIcon />
                    </div>
                </a>
                <a href="https://twitter.com/Rollinglogs">
                    <div className="icon-container">
                        <TwitterSmallIcon />
                    </div>
                </a>
            </div>
        )
    }

    proceedHandler = () => {
        const { userName, userMobileNo, userEmail } = this.state;

        if (userName !== "" && userMobileNo !== null && userEmail !== "") {
            this.setState({
                screen: "sendRequest"
            });

            // console.log("sending data to backend ...")

            const dataToSendBackend = {
                name: userName,
                mobileNo: userMobileNo,
                emailId: userEmail,
            }

            this.props.hitApi(api.VENDOR_ONBOARD_REQUEST, "POST", {
                requestData: dataToSendBackend,
                message: "Requesting for advertisement, The Rock"
            })
                .then((data) => {
                    let { responseCode } = data.payload;

                    if (responseCode === 200) this.setState({ screen: "success" })
                    else this.setState({ screen: "error" })
                })

                .catch(err => {
                    this.setState({ screen: "error" })
                })

        }

        if (userName === "") this.setState({ nameRequired: "show" });
        if (userMobileNo === null) this.setState({ mobileNoRequired: "show" });
        if (userEmail === "") this.setState({ emailRequired: "show" });
    };

    checkTypeNumber = (e, type) => {
        const regEx = /^[0-9]{10}$/, val = e.target.value;

        if (val !== null) {
            if (regEx.test(val) === true) {
                if (type === "mobile") {
                    this.setState({
                        userMobileNo: Number(val),
                        displayMobileValueValidationError: "displayMobileValueValidationError hide"
                    });
                }
            }

            else if (regEx.test(val) === false) {
                if (type === "mobile") {
                    this.setState({
                        userMobileNo: null,
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

        if (regEx.test(String(val).toLowerCase()) !== false) this.setState({ userEmail: val, emailRequired: "hide" });
        else this.setState({ userEmail: "", emailRequired: "show" })
    }

    returnVendorFormErrorOrSuccessScreen = () => {
        const { screen } = this.state;

        if (screen === "vendorForm") {
            return this.vendorOnboardRequestForm();
        }

        else if (screen === "success") {
            setTimeout(() => {
                this.setState({ screen: "vendorForm" })
            }, 10000);

            return(
                <div className="suceessMsgScreen">
                    <div className="suceessMsgScreenInnerLayer">
                        <h1>We have recieved your response, we will contact you in 6 hours</h1>
                    </div>
               </div>
            ) 
        }

        else if (screen === "error") {
            return (
                <div className="suceessMsgScreen">
                    <div className="suceessMsgScreenInnerLayer">
                        <h1>
                            Oops, something went wrong  <span onClick={() => this.setState({ screen: "vendorForm" })}>clickHere</span> ...
                        </h1>
                    </div>
               </div>
            )
        }
    }

    returnLoader = () => {
        return(
            <div className="suceessMsgScreen">
                <div className="suceessMsgScreenInnerLayer">
                    <ModalTransitionLoader />
                </div>
            </div>
        )
    }

    vendorOnboardRequestForm = () => {
        const { displayMobileValueValidationError, nameRequired, emailRequired, mobileNoRequired } = this.state;

        return (
            <div>
                <div className="form-group-section">
                    <div className="input-wrapper">
                        <input
                            type="text"
                            name="userName"
                            placeholder="Your name here"
                            onChange={(e) => this.setState({ userName: e.target.value, nameRequired: "hide" })}
                            ref="userName"
                            maxLength="100"
                        />
                        <span className="InputSeparatorLine"> </span>
                        <p className={nameRequired}>please enter your name.</p>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="email"
                            name="email"
                            placeholder="Email address here"
                            onChange={(e) => this.checkTypeEmail(e)}
                            ref="email"
                        />
                        <span className="InputSeparatorLine"> </span>
                        <p className={emailRequired}>please enter your valid email address.</p>
                    </div>
                    <div className="input-wrapper">
                        <input
                            type="text"
                            name="mobileNo"
                            placeholder="Mobile number here"
                            onChange={(e) => {
                                this.checkTypeNumber(e, "mobile")
                                this.setState({ mobileNoRequired: "hide" })
                            }}
                            maxLength="10"
                            ref="mobileNo"
                        />
                        <span className="InputSeparatorLine"> </span>
                        <p className={mobileNoRequired}>please enter your mobile number.</p>
                        <p className={displayMobileValueValidationError}>Please keep in mind, number should be valid.</p>
                    </div>
                </div>
                <div className="sign-up-button-container">
                    <WhiteButton
                        runFunction={() => this.proceedHandler()}
                    >
                        I wanna be a partner, sign me up!
                    </WhiteButton>
                </div>
            </div>
        )
    }

    render() {
        return (

            <div className="footer-main-outer-wrapper">
                <div className="footer-main-inner-wrapper">
                    <div className="inner-wrap-upper-section">
                        <div className="upper-wrap-inner-layer">
                            <div className="image-category-section">
                                <img src="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/footer-image.png" alt="" />
                            </div>
                            <div className="product-info-section">
                                <header className="header-section">
                                    <h1>Sell your architectural products here.</h1>
                                </header>
                                <footer className="footerSection">
                                    <p>
                                        Product vendors, product manufacturers, product designers and
                                        distributors, sell your products to Rolling Logs’ architectural
                                        community. Register using the form on the right.
                                        </p>
                                </footer>
                            </div>
                            <div className="custom-form-section">
                                <div className="form-inner-section">
                                    {this.state.screen !== "sendRequest" ? this.returnVendorFormErrorOrSuccessScreen() : this.returnLoader()}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="inner-wrap-lower-section">
                        <div className="lower-wrap-inner-layer">
                            <div className="lower-section-left-wrap">
                                <div className="left-wrap-inner-layer">
                                    <div className="left-header-column">
                                        <h1>Join our community of architects at TScaleHub</h1>
                                        <div className="line"></div>
                                    </div>
                                    <div className="left-wrap-info-column">
                                        <p>If you are an architect or an interior designer looking for clients,
                                            register yourself on tscalehub.com. Upload your projects and get
                                            leads on clients for free. Be a part of our architectural community,
                                                come now!</p>
                                    </div>
                                    {/* <a href="https://tscalehub.com/welcome">
                                        <div className="left-wrap-button-container">
                                            <WhiteButton>
                                                Alright, take me to TScaleHub
                                            </WhiteButton>
                                        </div>
                                    </a> */}
                                </div>
                            </div>
                            <div className="lower-section-right-wrap">
                                <div className="right-wrap-inner-layer">
                                    {/* <div className="right-wrap-header-section">
                                        <h3>Follow us on social media</h3>
                                    </div> */}
                                    <div className="right-wrap-footer-section">
                                        {this.returnSocialIcons()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>

        )
    }
};

export default connect(null, { hitApi })(NewFooter);

