import Axios from 'axios';
import { decryptData, encryptData } from '../factories/encryptDecrypt'

export function navBarLoadingAnimationShowHide(showOrNot) {

    let data

    if (showOrNot) {
        data = {
            loadingAnimationClass: "loadingAnimation",
            uploadClass: "upload hide"
        }
    } else {
        data = {
            loadingAnimationClass: "loadingAnimation hide",
            uploadClass: "upload"
        }
    }

    return (dispatch) => {
        dispatch({type: "LOADING_INITIATED", payload: data})
    }
}

export function hitApi(apiURL, typeOfRequest, requestPayload) {

    // returns the response and the code from the backend
    // |||||||||||||||||||||||||||||||||||||||||||||||||

    const requestData = {
        headers: {
            'accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.8',
            "Content-Type": "application/json"
        },

        withCredentials: true
    }

   

    // console.log(requestPayload) send requests and get deliveries
    // |||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||||

    if (typeOfRequest === "GET") {
        return dispatch => {
            return Axios
                .get(apiURL, requestData)
                .then(responsePayload => {

                    let decryptedResponseData;

                    decryptedResponseData = {
                        ...decryptData (responsePayload.data.responseData)
                    };

                    return dispatch({
                        type: "API_DELIVERED_RESPONSE",
                        payload: {
                            responsePayload: decryptedResponseData,
                            responseCode: responsePayload.status,
                            isError: false
                        }
                    })
                })
                .catch(error => {
                    // console.log( error)
                    return dispatch({
                        type: "API_THREW_ERROR",
                        payload: {
                            responsePayload: error.response,
                            responseCode: error.response.status,
                            isError: true
                        }
                    })
                })
        }
    }
    
    else if (typeOfRequest === "POST") {

        let encryptedRequestPayload = {
            requestData: encryptData(requestPayload.requestData),
            message: requestPayload.message
        }

        return dispatch => {
            return Axios
                .post(apiURL, encryptedRequestPayload, requestData)
                .then(responsePayload => {

                    let decryptedResponseData;

                    decryptedResponseData = {
                        ...decryptData (responsePayload.data.responseData)
                    };

                    return dispatch({
                        type: "API_DELIVERED_RESPONSE",
                        payload: {
                            responsePayload: decryptedResponseData,
                            responseCode: responsePayload.status,
                            isError: false
                        }
                    })
                })
                .catch(error => {
                    return dispatch({
                        type: "API_THREW_ERROR",
                        payload: {
                            responsePayload: error.response,
                            responseCode: error.response.status,
                            isError: true
                        }
                    })
                })
        }
    }
    
    else if (typeOfRequest === "PUT") {

        let encryptedRequestPayload = {
            requestData: encryptData(requestPayload.requestData),
            message: requestPayload.message
        }

        return dispatch => {
            return Axios
                .put(apiURL, encryptedRequestPayload, requestData)
                .then(responsePayload => {

                    let decryptedResponseData;

                    decryptedResponseData = {
                        ...decryptData(responsePayload.data.responseData)
                    };

                    return dispatch({
                        type: "API_DELIVERED_RESPONSE",
                        payload: {
                            responsePayload: decryptedResponseData,
                            responseCode: responsePayload.status,
                            isError: false
                        }
                    })
                })
                .catch(error => {
                    return dispatch({
                        type: "API_THREW_ERROR",
                        payload: {
                            responsePayload: error.response,
                            responseCode: error.response.status,
                            isError: true
                        }
                    })
                })
        }
    } 
    
    else if (typeOfRequest === "DELETE") {

        let encryptedRequestPayload = {
            requestData: encryptData(requestPayload.requestData),
            message: requestPayload.message
        }

        return dispatch => {
            return Axios
                .delete(apiURL,
            // encryptedRequestPayload,
            requestData)
                .then(responsePayload => {

                    let decryptedResponseData;

                    decryptedResponseData = {
                        ...decryptData (responsePayload.data.responseData)
                    };

                    return dispatch({
                        type: "API_DELIVERED_RESPONSE",
                        payload: {
                            responsePayload: decryptedResponseData,
                            responseCode: responsePayload.status,
                            isError: false
                        }
                    })
                })
                .catch(error => {
                    return dispatch({
                        type: "API_THREW_ERROR",
                        payload: {
                            responsePayload: error.response,
                            responseCode: error.response.status,
                            isError: true
                        }
                    })
                })
        }
    }
}
