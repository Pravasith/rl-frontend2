import React, { useContext } from 'react';

import Login from '../logIn';
import SignUp from '../signUp';
import GenericModal from '../../../UX/genericModal';
import { ModalContext } from '../../../../../utils/context/context';
import Payment from '../../../checkout/payment';

const HooksLoginOrSignupModal = (props) => {

    const context = useContext(ModalContext);

    let modalFlipper = (modalToFlip) => {
        if (modalToFlip === "flipToSignUp") context.loginSignUpOrPaymentModal("open", "signUp")
        else if (modalToFlip === "flipToLogIn") context.loginSignUpOrPaymentModal("open", "logIn")
    }

    let closeTheCheckoutModal = () => {
        context.loginSignUpOrPaymentModal("close")
    }

    let redirectToHomePage = () => {
        location.reload()
    };

    let returnModal = () => {
        const { modal, modalType } = context.valueGlobalState;

        // console.log(modal, modalType);
        // console.log(context.valueGlobalState);

        if (modal === "show") {
            if (modalType === "logIn") {
                return (
                    <GenericModal
                        heading="Do the quick log in!"
                        backgroundImage="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/logInBackground.png"
                        closeTheCheckoutModal={closeTheCheckoutModal}
                    >
                        <Login
                            functionToRunAfterLogInSuccessful={redirectToHomePage}
                            modalFlipper={modalFlipper}
                            closeTheCheckoutModal={closeTheCheckoutModal}
                        />
                    </GenericModal>
                    )
                }

            else if (modalType === "signUp") {
                return (
                    <GenericModal
                        heading="Welcome to the Architectural product jungle!"
                        backgroundImage="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/signUpBackground2.png"
                        closeTheCheckoutModal={closeTheCheckoutModal}
                    >
                        <SignUp
                            functionToRunAfterLogInSuccessful={redirectToHomePage}
                            modalFlipper={modalFlipper}
                            closeTheCheckoutModal={closeTheCheckoutModal}
                        />
                    </GenericModal>
                )
            }

            else if (modalType === "payment") {
                // debugger 
                return <Payment />};
        }
    }

    return (
        <div >
            {returnModal()}
        </div>
    )
}

export default HooksLoginOrSignupModal;