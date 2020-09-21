import { createStore, applyMiddleware, compose } from 'redux';

import thunk from 'redux-thunk';
import { logger } from 'redux-logger';

import allReducers from '../reducers';

const makeStore = compose
    (applyMiddleware(
        thunk,
        // logger
    ))
    (createStore)
    (allReducers);

export default makeStore;