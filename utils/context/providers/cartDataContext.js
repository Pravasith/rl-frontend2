import { useReducer } from 'react';

import { CartDataContext } from '../context';

// import { createContext } from 'react';

// const CartDataContext = createContext();

import { hooksCartData } from '../../../src/actions/userActions';
import { getHooksCartData } from '../../../src/reducers/userReducers';

const CartDataContextProvider = (props) => {
    const [ valueGlobal, dispatchActionsGlobal] = useReducer(getHooksCartData, {});

    return (
        <CartDataContext.Provider
            value={{
                valeGlobalState: valueGlobal,
                cartData: (data) => dispatchActionsGlobal(hooksCartData(data))
            }}
        >
            {props.children}
        </CartDataContext.Provider>
    )
}

export default CartDataContextProvider