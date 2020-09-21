import { TimelineMax } from "gsap";

// export function startLoadingAndPerformAction(startLoading, loadingText) {

//     let data

//     if(startLoading){
//         data = {
//             loadingAnimationClass: "loadingAnim hide",
//             modalClass: "modalClass"
//         }
//     }

//     // if(data.loadingText){

//     // }

//     console.log(data)

//     return (dispatch) => {
//         dispatch({type: "START_LOADING_AND_RUN_FUNCTION", payload: data})
//     }
// }

export function modalLoading(showOrNot) {

    let data

    if (showOrNot) {
        data = {
            loadingClass: "loadingAnim",
            modalClass: "modalClass hide"
        }
    }

    else {
        data = {
            loadingClass: "loadingAnim hide",
            modalClass: "modalClass"
        }
    }

    return (dispatch) => {
        dispatch({
            type: "START_LOADING_AND_RUN_FUNCTION",
            payload: data
        })
    }
}


export const openOrCloseLoginSignupPaymentModal = (openOrCloseModal, modalType, miscData) => {
    let data;

    if (openOrCloseModal === "open") data = { modal: "show", modalType, address: miscData };
    else data = { modal: "hide" };

    return {
        type: "LOGIN_SIGNUP_MODAL_STATUS",
        payload: data
    }
}
