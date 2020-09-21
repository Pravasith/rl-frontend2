export const customizeProduct = (data, typeOfCustomizationOption) => {

    let actionDispatchedMessage 

    if (typeOfCustomizationOption === "colorOrFinish") {
        actionDispatchedMessage = "NEW_COLOR_FINISH_SELECTED"
    }

    else if (typeOfCustomizationOption === "material") {
        actionDispatchedMessage = "NEW_MATERIAL_SELECTED"
    }

    else if (typeOfCustomizationOption === "size") {
        actionDispatchedMessage = "NEW_SIZE_SELECTED"
    }
    
    return (dispatch) => {
        dispatch({
            type: actionDispatchedMessage,
            payload: data
        })
    }
};

export const reCustomizeProduct = ( openOrCloseModal, materialSizeColorFinishObj) => {

    let data

    if(openOrCloseModal === "open"){
        data = materialSizeColorFinishObj
    }

    else if(openOrCloseModal === "close"){
        data = {
            ...materialSizeColorFinishObj,
            dropdownModal : "dropdownInModal hide"
        }
    }

    return (dispatch) => {
        dispatch({
            type: "RE_CUSTOMIZE_PRODUCT",
            payload: data
        })
    }
}

export const productImageMagnifier = (openOrCloseModal, imageObj) => {

    let data

    if (openOrCloseModal === "open") {
        data = imageObj
    }

    else if (openOrCloseModal === "close") {
        data = {
            ...imageObj,
            dropdownModal: "dropdownInModal hide"
        }
    }

    return (dispatch) => {
        dispatch({
            type: "PRODUCT_IMAGE_MAGNIFIER",
            payload: data
        })
    }
}