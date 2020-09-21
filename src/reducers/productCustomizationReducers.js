export function newCustomOptionData(state = {}, action) {

    switch (action.type) {
        case "NEW_COLOR_FINISH_SELECTED":
            return {
                ...state,
                ...action.payload
            }

        case "NEW_MATERIAL_SELECTED":
            return {
                ...state,
                ...action.payload
            }

        case "NEW_SIZE_SELECTED":
            return {
                ...state,
                ...action.payload
            }
    }
    return state
}

export function openOrCloseModal (state = {}, action) {
    switch (action.type) {
        case "RE_CUSTOMIZE_PRODUCT":
            return {
                ...state,
                ...action.payload
            }

        case "PRODUCT_IMAGE_MAGNIFIER":
            return {
                ...state,
                ...action.payload
            }
    }
    return state
};
