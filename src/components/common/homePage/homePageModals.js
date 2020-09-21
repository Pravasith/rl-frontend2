import React, { Component } from 'react';
import { connect } from "react-redux";

import { reCustomizeProduct } from '../../../actions/productCustomizationActions';

import PaidAdModal from '../../adComponent/paidAdModal';
import AskForProductModal from "../../project-designs/askForProduct";
import SuccessScreenModal from '../screenModals/successScreenModal';
import ErrorScreenModal from '../screenModals/errorScreenModal';

class HomePageModals extends Component {

    returnModals = () => {
        const { dropdownModal, modalType, reqFrom } = this.props.openOrCloseModal;

        if (dropdownModal === "dropdownInModal") {
            if (modalType === "paidAd") return <PaidAdModal />;
            else if (modalType === "askForProduct") return <AskForProductModal />;
            else if (modalType === "askForProduct") return <AskForProductModal />;
            else if (modalType === "successScreen") 
            return <SuccessScreenModal 
               successMsg="We have recieved your onboard request. We will call you back in 6 hours."             
             />
            ;
            else if (modalType === "errorScreen") return <ErrorScreenModal reqFrom={reqFrom} />;
        }
    };

    render() {
        return (
            <div>
                {this.returnModals()}
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        openOrCloseModal: state.openOrCloseModal
    }
};

export default connect(mapStateToProps, { reCustomizeProduct })(HomePageModals);