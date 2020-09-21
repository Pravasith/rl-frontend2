import React, { Component } from 'react';

import { connect } from "react-redux";
import { reCustomizeProduct } from '../../../../actions/productCustomizationActions';

import Login from '../logIn';
import SignUp from '../signUp';
import SubscribeModal from '../../subscribeModal/subscribe'
import GenericModal from '../../../UX/genericModal';

class LoginOrSignUpModal extends Component {

    modalFlipper = (modalToFlip) => {
        if (modalToFlip === "flipToSignUp") {
            this.props.reCustomizeProduct(
                "open",
                {
                    dropdownModal: "dropdownInModal",
                    modalType: "signUp"
                }
            )
        }

        else if (modalToFlip === "flipToLogIn") {
            this.props.reCustomizeProduct(
                "open",
                {
                    dropdownModal: "dropdownInModal",
                    modalType: "logIn"
                }
            )
        }
    };

    redirectToHomePage = () => {
        location.reload()
    };

    closeTheModal = () => {
        this.props.reCustomizeProduct("close");
    };

    returnLoginOrsignUpModal = () => {
        const { dropdownModal, modalType } = this.props.openOrCloseModal;

        if (dropdownModal === "dropdownInModal") {
            if (modalType === "logIn") {
                return (
                    <GenericModal
                        heading="Come, see whats inside! Do the quick log in!"
                        backgroundImage="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/logInBackground.png"
                        closeTheModal={this.closeTheModal}
                    >
                        <Login
                            functionToRunAfterLogInSuccessful={this.redirectToHomePage}
                            modalFlipper={this.modalFlipper}
                            closeTheModal={this.closeTheModal}
                        />
                    </GenericModal>
                )
            }

            if (modalType === "subscribe") {
                return (
                    <GenericModal
                        // heading="Come, see whats inside! Do the quick log in!"
                        backgroundImage="https://rolling-logs.s3.ap-south-1.amazonaws.com/app-data/backgrounds/ComboOffers.jpg"
                        closeTheModal={this.closeTheModal}
                        backgroundSize="100%"
                        sideText="Subscribe and get a chance to win this combo"
                    >
                        <SubscribeModal/>
                    </GenericModal>
                )
            }

            else if (modalType === "signUp") {
                return (
                    <GenericModal
                        heading="Welcome to the Architectural product jungle!"
                        backgroundImage="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/signUpBackground2.png"
                        closeTheModal={this.closeTheModal}
                    >

                        <SignUp
                            functionToRunAfterSignUpSuccessful={this.redirectToHomePage}
                            modalFlipper={this.modalFlipper}
                            closeTheModal={this.closeTheModal}
                        />
                    </GenericModal>
                )
            }
        }

        else {
            // return <ErrorModal/>
        }
    };

    render() {
        return (
            <div>
                {this.returnLoginOrsignUpModal()}
            </div>
        );
    };
};

const mapStateToProps = (state) => {
    return {
        openOrCloseModal: state.openOrCloseModal
    }
};

export default connect(mapStateToProps, { reCustomizeProduct })(LoginOrSignUpModal);