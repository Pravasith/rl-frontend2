export function resultAfterLoadingStopsInModal(
        state = {
            loadingClass: "loadingAnim hide",
            modalClass: "modalClass"
        }, 
        action
    ){
        switch (action.type) {
            case "START_LOADING_AND_RUN_FUNCTION":
                return {
                    ...state,
                    ...action.payload
                }
        }
        return state
    }

export const openOrCloseModalHook = (state = {}, action) => {

    // console.log("Wrks reducer");

    switch (action.type) {
        case "LOGIN_SIGNUP_MODAL_STATUS":
            return {
                ...state,
                ...action.payload
            }
    }
    return state
} 
