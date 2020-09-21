import React, { Component } from 'react';
import { connect } from 'react-redux';

import { reCustomizeProduct } from '../../../actions/productCustomizationActions';

import GenericModal from './../../UX/genericModal';

class SuccessScreenModal extends Component {


    screenWidthImages = () => {

        const custWidth=screen.width;

        if (custWidth<1920) {
            return(
                "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/Success-Modal-background.png"
            )
    
        }
    }

    returnSuccessScreenModal = () => {

        const closeTheModal = () => {
            this.props.reCustomizeProduct("close");
        };

        return (
            <GenericModal
                headerBigText="Done !"
                // backgroundImage={
                //     [
                //         "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/askForProductsBackground.png"
                //     ]
                // }
                backgroundImage={this.screenWidthImages()}
                closeTheModal={closeTheModal}
            >
                <div className="loadingWrapperRequests">
                    <h3>{this.props.successMsg}</h3>
                </div>
            </GenericModal>
        );
    };

    render() {
        return (
            <div>
                {this.returnSuccessScreenModal()}
            </div>
        )
    }
};

export default connect(null, { reCustomizeProduct })(SuccessScreenModal);
