import React, {Component} from 'react';

import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import { modalLoading } from "../../actions/modalActions"

import "../../assets/css/generic_modal.css";

import LogoAnimation from "../animations/logoAnimation";
import { ModalCloseButton } from "../../assets/images/index";


// How to use this component -

//  Step 1 : Copy and paste this code below in the render function or any custom return function

// {
//     this.returnMyModal()
// }

// Step 2 : Copy and paste this function in your react component class

// returnMyModal = () => {

//     if(this.state.dropdownModal === "dropdownInModal"){
//         return (
//             <div className = "dropdownInModal">
//                 <GenericModal
//                     backgroundImage = "https:// ..."
//                     closeTheModal = {
//                         this.closeTheModal
//                     }
//                     >
//                     <YourComponent/> or <yourHTML></yourHTML>
//                 </GenericModal>
//             </div>
//         )
//     }
// 
//     else {
//         return ""
//     }
// }

// Step 3 : Copy and paste this function too in your react component class

// closeTheModal = () => {
//    
//     this.setState({
//         dropdownModal : "dropDownInModal hide"
//     })
// }

// Step 4 - final step : If you want the modal to be open initially, paste this in state

// this.state = {
//     dropdownModal: "dropdownInModal",
// }

// OR if you want the modal to be closed initially, paste the following,

// this.state = {
//     dropdownModal: "dropdownInModal hide",
// }

class GenericModal extends Component {

    constructor(props){
        super(props)
        this.props = props

        this.state = {
            loadingClass: 'loadingAnim hide',
            modalClass: 'modalClass',
        }
    }

    componentDidMount = () => {

        const tl = new TimelineMax()

        tl.set(".modal-inner-wrap", {
            perspective: 2500
        })

        tl
            .set(
                ".modal-inner-wrap-2",
                {rotationY: -90}
            )
            .to(
                ".modal-inner-wrap-2",
                0.3,
                {
                    tranformOrigin: "50% 50%",
                    rotationY: 0,
                    ease: "easeIn",
                }
            )
    }

    closeWholeModal = () => {
        const tl = new TimelineMax()

        tl.set(".modal-inner-wrap", {
            perspective: 2500,
        })

        tl.to(
            ".modal-inner-wrap-2",
            0.2,
            {
                tranformOrigin: "50% 50%",
                rotationY: 90,
                ease : "easeOut",
                onComplete : () => {
                    if(this.props.closeTheModal) this.props.closeTheModal()
                    else this.props.closeTheCheckoutModal()
                }
            }
        )
    }

    render() {

        return (
            <div 
                className = "generic-modal-outer-wrapper"
                >
                <div className="generic-modal-inner-wrapper">
                    <div className="modal-inner-wrap">
                        <div className="modal-wrap-inner-style">
                            <div className="modal-inner-wrap-2">
                                <div 
                                    className= { this.props.resultAfterLoadingStopsInModal.loadingClass }>
                                    <LogoAnimation
                                        text={"We're gonna be right there..."}
                                    />
                                </div>

                                <div 
                                    className = { this.props.resultAfterLoadingStopsInModal.modalClass }
                                    style = {
                                        {
                                            backgroundImage : `url(${this.props.backgroundImage})`,
                                            backgroundSize: this.props.backgroundSize
                                        }
                                    }
                                    >
                                    <div
                                        className="modal-content-outer-wrapper"
                                        >
                                        <div className="modal-content">
                                        <header>
                                            <h3 className={this.props.heading ? "main-modal-title" : "hide"}>
                                                {this.props.heading}
                                            </h3>
                                            <h1 className={this.props.headerBigText ? "headerBigText" : "hide"}>
                                                {this.props.headerBigText}
                                            </h1>
                                            <p
                                                className={this.props.sideText ? "side-text-title" : "hide"}
                                            >
                                                {this.props.sideText}
                                            </p>
                                            <div 
                                                className="close-modal-button"
                                                onClick = {() => {
                                                    this.closeWholeModal()
                                                }}
                                                >
                                                <div className="icon-wrap">
                                                    <ModalCloseButton/>
                                                </div>
                                            </div>
                                        </header>

                                        <div className="separation-content"></div>

                                        <article className="main-modal-body">
                                            <div className="main-body-content">
                                                {this.props.children}
                                            </div>
                                        </article>

                                        <footer></footer>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        resultAfterLoadingStopsInModal : state.resultAfterLoadingStopsInModal,
    }
}

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        modalLoading,
        // closeWholeModal
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(GenericModal)