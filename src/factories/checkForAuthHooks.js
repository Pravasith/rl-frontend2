import { useContext, useEffect } from 'react';
import Axios from 'axios';

import { api } from '../actions/apiLinks';
import { ModalContext } from '../../utils/context/context';
import { decryptData } from "./encryptDecrypt";

// use this in the required component
// const checkForAuth = useCheckForAuth(props);

const useCheckForAuth = (props) => {

    const context = useContext(ModalContext);
    
    useEffect(() => {
        checkForAuthAPI()
    }, [props]);

    let checkForAuthAPI = () => {
        Axios.get(
            api.CHECK_FOR_AUTH,
            {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    "Content-Type": "application/json"
                },
    
                withCredentials: true
            }
        )
        .then(res => {
    
            let responseData = decryptData(res.data.responseData)
    
            if(responseData.isAuthenticated === false) {
                context.loginSignUpOrPaymentModal("open", "logIn")
            }
            
        })
        .catch(e => console.error(e))
    }
};

export default useCheckForAuth;