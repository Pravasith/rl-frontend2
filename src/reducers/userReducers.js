export function userData(state = {}, action) {

    switch (action.type) {
        case "GET_USER_DATA":
            return {
                ...state,
                ...action.payload
            }
    }

    return state
}


export function isAuthed(state = {
    isAuthenticated : false
}, action) {

    switch (action.type) {
        case "USER_AUTH_TEST":
            return {
                ...state,
                ...action.payload
            }
    }

    return state
}

export function cartData(state = null, action) {

    switch (action.type) {
        case "ADD_TO_CART_CLICKED":
            return {
                ...state,
                ...action.payload
            }
    }

    return state
}

export const getHooksCartData = (state = {}, action) => {

    switch (action.type) {
        case "ALL_CART_DATA":
            return {
                ...state,
                ...action.payload
            }
        }
        
    return state;
}

