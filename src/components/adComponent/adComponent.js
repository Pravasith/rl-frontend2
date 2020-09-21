import React, { Component } from "react";
import { connect } from "react-redux";

import { reCustomizeProduct } from '../../actions/productCustomizationActions';

import '../../assets/css/new_ad_component.css'

class AdComponent extends Component {

    state = {
        modalType: null,
    };

    render() {
        return (
            <div className="ad-component-outer-layer">
                <div className="ad-component-inner-layer">

                    <a
                        className={this.props.imageLink ? "a" : ""}
                        href={this.props.imageLink}
                    >
                        <img
                            className="desktop-class"
                            src={this.props.imageSrc[0]}
                            alt={this.props.imageAlt}
                        />
                        <img
                            className="tab-class"
                            src={this.props.imageSrc[1]}
                            alt={this.props.imageAlt}
                        />
                        <img
                            className="tab-pro-class"
                            src={this.props.imageSrc[2]}
                            alt={this.props.imageAlt}
                        />
                        <img
                            className="mobile-class"
                            src={this.props.imageSrc[3]}
                            alt={this.props.imageAlt}
                        />
                        <img
                            className="full-hd-class"
                            src={this.props.imageSrc[4]}
                            alt={this.props.imageAlt}
                        />
                    </a>

                    <div className={this.props.profileImage ? "profile-container" : "hide"}>
                        <div className="profile-container-inner-layer">
                            <a href={this.props.profileLink}>
                                <div className="profile-picture">
                                    <div className="profile-pic-inner-wrap">
                                        <img src={this.props.profileImage} alt="" />
                                    </div>
                                </div>
                                <div className="profile-details">
                                    <h3 className="boldText">{this.props.header}</h3>
                                    <h3>{this.props.stateCity}</h3>
                                </div>
                            </a>
                        </div>
                    </div>

                    <div className={this.props.promoteAd ? "ad-container" : "hide"}>
                        <div className="ad-container-inner-layer">
                            <h3>{this.props.promoteAd}</h3>
                            <p>
                                <span
                                    onClick={() => {
                                        this.props.reCustomizeProduct(
                                            "open",
                                            {
                                                dropdownModal: "dropdownInModal",
                                                modalType: "paidAd",
                                                requestFrom: "homePage"
                                            }
                                        )
                                    }}
                                >
                                    Click here
                                </span>
                                {this.props.weeklyCost}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
};


export default connect(null, { reCustomizeProduct })(AdComponent);