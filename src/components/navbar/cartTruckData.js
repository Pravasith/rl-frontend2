import React, { Component } from 'react';
import { connect } from 'react-redux';

import { addToCartClicked } from '../../actions/userActions';

import { decryptData } from '../../factories/encryptDecrypt';
import { CartTruck } from '../../assets/images/index';

import "../../assets/css/navbar.css";

class CartTruckData extends Component {

    state = {
        cartTruckData: []
    }

    getCartDataLength = () => {
        const { cartData, savedCartData } = this.props;

        let decryptedData = decryptData(cartData.responseData);

        if (decryptedData.authData) {
            let decryptedCartData = decryptedData.authData.cartData, newArr;

            if (decryptedCartData) {
                if (savedCartData) {
                    let arr1 = decryptedCartData,
                        arr2 = savedCartData;

                    newArr = arr2.reduce((acc, eachArr2Elem) => {
                        if (arr1.findIndex((eachArr1Elem) => eachArr1Elem.productId === eachArr2Elem.productId)  === -1) {
                            acc.push(eachArr2Elem)
                        }
                        return acc
                    }, [...arr1])
                }

                else {
                    newArr = decryptedCartData;
                }
            }

            else if (savedCartData) {
                newArr = savedCartData;
            }

            return <p>{newArr ? newArr.length : 0}</p>
        }

        else {
            return null;
        }

    };
    
    render() {
        return(
            // <a>
                <div className="add-to-cart-truck">
                    <div className="cart-info-container">
                        <div className="svg-container">
                            <CartTruck/>
                        </div>
                        <div className="cart-length-container">
                            {this.getCartDataLength()}
                        </div>
                    </div>
                    <div className="cart-menu-wrap">
                        <div className="dummy-cart-wrap"></div>
                        <div className="cart-item-container-outer-layer">
                            <div className="cart-item-content-container"></div>
                        </div>
                    </div>
                </div>
            // </a>
        )
    }

};

const mapStateToProps = (state) => {
    return {
        cartData: state.cartData
    }
};

export default connect(mapStateToProps, { addToCartClicked })(CartTruckData);