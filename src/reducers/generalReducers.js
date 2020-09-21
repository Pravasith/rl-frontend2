export function navBarLoadingClass(state = {
    loadingAnimationClass: "loadingAnimation hide",
    uploadClass: "upload"
}, action) {

    switch (action.type) {
        case "LOADING_INITIATED":
            return {
                ...state,
                ...action.payload
            }
    }
    return state
}

export function responseDataFromAPI(state = {}, action) {

    switch (action.type) {
        case "API_DELIVERED_RESPONSE":
            return {
                ...state,
                ...action.payload
            }

        case "API_THREW_ERROR":
            return {
                ...state,
                ...action.payload
            }
    }
    return state
}