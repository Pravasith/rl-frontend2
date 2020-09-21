import { combineReducers } from 'redux';

import { userData, isAuthed, cartData, getHooksCartData } from './userReducers';
import { navBarLoadingClass, responseDataFromAPI } from './generalReducers';

import { resultAfterLoadingStopsInModal } from './modalReducers';

import { newCustomOptionData, openOrCloseModal } from './productCustomizationReducers';

const allReducers = combineReducers({
    userData,
    cartData,
    getHooksCartData,
    navBarLoadingClass,
    responseDataFromAPI,
    newCustomOptionData,
    openOrCloseModal,
    resultAfterLoadingStopsInModal,
    isAuthed
});

export default allReducers;