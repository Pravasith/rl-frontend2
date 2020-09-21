import {api} from './apiLinks'
import axios from 'axios'
import { decryptData } from '../factories/encryptDecrypt';
import Axios from 'axios';

export function getUserData() {
    return (dispatch) => {

        return Axios.get(api.GET_USER_DATA, {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                "Content-Type": "application/json"
            },

            withCredentials: true
        })
        
        .then(res => {
            // console.log("response", res)
            dispatch({type: "GET_USER_DATA", payload: res.data})
        })
        
        .catch(err => {
            console.error('bad', err)
            throw err
        })
    }
};

export function checkForAuth() {
    return (dispatch) => {
        return (
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

                if(responseData.isAuthenticated){
                    dispatch({type: "USER_AUTH_TEST", payload: responseData})
                }

                else {
                    dispatch({type: "USER_AUTH_TEST", payload: responseData})
                }
                
            })
            .catch(e => console.error(e))
        )
    }
}

export function addToCartClicked() {
    return (dispatch) => {
        return Axios.get(api.GET_COOKIE_DATA,
            {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    "Content-Type": "application/json"
                },

                    withCredentials: true
            })
            .then(res => {
                dispatch({
                    type: "ADD_TO_CART_CLICKED",
                    payload: res.data
                })
            })
            .catch(err => {
                console.error('bad', err)
                throw err
            })        
    }
}

export const hooksCartData = (data) => {
    return {
        type: "ALL_CART_DATA",
        payload: data
    }
}   