import { useReducer } from 'react';

import { ModalContext } from '../context';

import { openOrCloseLoginSignupPaymentModal  } from '../../../src/actions/modalActions';
import { openOrCloseModalHook } from '../../../src/reducers/modalReducers';

const ModalContextProvider = (props) => {

    const [ valueGlobal, dispatchActionsGlobal] = useReducer(openOrCloseModalHook, {});
  
    const openOrCloseModal = (openOrClose, modalType, miscData) => {
        if (openOrClose === "open") {
            if (modalType === "logIn") {
                dispatchActionsGlobal(
                    openOrCloseLoginSignupPaymentModal( openOrClose, "logIn" )
                )
            }

            if (modalType === "subscribe") {
                dispatchActionsGlobal(
                    openOrCloseLoginSignupModal(openOrClose, "subscribe")
                )
            }
    
            else if (modalType === "signUp") {
                dispatchActionsGlobal(
                    openOrCloseLoginSignupPaymentModal( openOrClose, "signUp" )
                )
            }

            else if (modalType === "payment" && miscData) {
                dispatchActionsGlobal(
                    openOrCloseLoginSignupPaymentModal( openOrClose, "payment", miscData )
                )
            }
        }

        else if (openOrClose === "close") {
            dispatchActionsGlobal(
                openOrCloseLoginSignupPaymentModal( openOrClose )
            )
        }
    };

    return (
        <ModalContext.Provider
            value={{
                valueGlobalState: valueGlobal,
                loginSignUpOrPaymentModal: (openOrClose, modalType, miscData) => openOrCloseModal(openOrClose, modalType, miscData)
            }}>
            {props.children}
        </ModalContext.Provider>
    )
};

export default ModalContextProvider;