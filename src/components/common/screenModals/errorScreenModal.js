import React, { Component } from 'react';
import { connect } from 'react-redux';

import { reCustomizeProduct } from '../../../actions/productCustomizationActions';

import GenericModal from './../../UX/genericModal';

class ErrorScreenModal extends Component {

    screenWidthImages = () => {

        const custWidth=screen.width;

        if (custWidth<1920) {
            return(
                "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/Error-modal-background.png"
            )
    
        }
    }

    handleClick = () => {
        const { reqFrom } = this.props;

        if (reqFrom === "paidAd") {
            this.props.reCustomizeProduct(
                "open",
                {
                    dropdownModal: "dropdownInModal",
                    modalType: "paidAd"
                }
            )
        }

        else if (reqFrom === "askForProduct") {
            this.props.reCustomizeProduct(
                "open",
                {
                    dropdownModal: "dropdownInModal",
                    modalType: "askForProduct"
                }
            )
        }

        else if (reqFrom === "requestQuote") {
            this.props.reCustomizeProduct(
                "open",
                {
                    dropdownModal: "dropdownInModal",
                    modalType: "requestQuote"
                }
            )
        }

        else if (reqFrom === "designerForm") {
            this.props.reCustomizeProduct(
                "open",
                {
                    dropdownModal: "dropdownInModal",
                    modalType: "designerForm"
                }
            )
        }
    }

    closeTheModal = () => {
        this.props.reCustomizeProduct("close");
    }

    render() {
        return (
            <div>
                <GenericModal
                    headerBigText=""
                    backgroundImage={this.screenWidthImages()}
                    closeTheModal={this.closeTheModal}
                >
                    <div className="loadingWrapperRequests">
                        <div className="loadingWrapperRequestsInnerLayer">
                            <h1 className="errorHeader">Apologies :(</h1>
                            <h3 className="loadingHeader">Something din’t go well on our part.</h3>
                            <h3>
                                <span
                                    onClick={() => this.handleClick()}
                                >
                                click here</span> to try again
                            </h3>
                        </div>
                    </div>
                </GenericModal>
            </div>
        )
    }
};

export default connect(null, { reCustomizeProduct })(ErrorScreenModal);