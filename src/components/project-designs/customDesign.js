import React, { Component } from 'react'
import Head from 'next/head';

import { connect } from "react-redux";
import { reCustomizeProduct } from '../../actions/productCustomizationActions';

import DesignerFormModal from "./designerFormModal";
import ErrorScreenModal from './../common/screenModals/errorScreenModal';
import SuccessScreenModal from './../common/screenModals/successScreenModal';

import NewFooter from '../footer/newFooter';
import { GradientButton } from '../UX/uxComponents';

import { StarIcon } from '../../assets/images';

import "../../assets/css/custom_design.css";

class CustomDesign extends Component {

    state = {
        dropdownModal: "dropdownInModal hide",
    }

    returnSEOcontent = () => {
        return (
            <Head>
                <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
                <link rel="canonical" href={`https://www.rollinglogs.com/submit-design`} />

                <title>Product procurement, Interior, architectural project execution | RollingLogs</title>
                <meta name="description" content="You design, we execute. Get assistance in procuring all products with installation services for your interior requirements through Rollinglogs by sharing your designs." />
                <meta
                    name="keywords"
                    content="Interior design execution, architectural design execution, product procurement, architectural products procurement, interior project execution, kitchen design services"
                />

                <meta property="og:type" content="website" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:title" content="Product procurement, Interior, architectural project execution | RollingLogs" />
                <meta property="og:site_name" content="RollingLogs" />
                <meta property="og:url" content={`https://www.rollinglogs.com/submit-design`} />
                <meta property="og:image:type" content="image/jpeg" />
                <meta property="og:image" content="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/rollinglogs-discover-architectural-products.png" />
                <meta property="og:image:alt" content={`Find Livingroom, Bathroom, Kitchen , Finishes , Outdoor and building products in India with installation services.`} />
                <meta property="og:description" content={`You design, we execute. Get assistance in procuring all products with installation services for your interior requirements through Rollinglogs by sharing your designs.`} />

                <meta name="twitter:title" content="Product procurement, Interior, architectural project execution | RollingLogs" />
                <meta name="twitter:url" content={`https://www.rollinglogs.com/submit-design`} />
                <meta name="twitter:site" content="@Rollinglogs" />
                <meta name="twitter:description" content={`You design, we execute. Get assistance in procuring all products with installation services for your interior requirements through Rollinglogs by sharing your designs.`} />
                <meta name="twitter:image" content="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/rollinglogs-discover-architectural-products.png" />
                <meta name="twitter:image:alt" content={`Find Livingroom, Bathroom, Kitchen , Finishes , Outdoor and building products in India with installation services.`} />
                <meta name="twitter:card" content="CARD_TYPE" />

            </Head>
        )
    }

    returnModals = () => {
        const { dropdownModal, modalType, reqFrom } = this.props.openOrCloseModal

        if (dropdownModal === "dropdownInModal") {
            if (modalType === "designerForm") return <DesignerFormModal />;
            else if (modalType === "successScreen") 
            return <SuccessScreenModal 
               successMsg="We have recieved your onboard request. We will call you back in 5 hours."             
             />;
            else if (modalType === "errorScreen") return <ErrorScreenModal reqFrom={reqFrom} />;
        }
    }

    render() {
        return (
            <div className="submitDesginContainer">
                {this.returnSEOcontent()}
                <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5cbaabb8590da7f1"></script>
                <div className="submitDesignContainerInnerLayer">
                    <div className="headerContainer">
                        <div className="submitButtonHeaderContainer">
                            <div className="headerTextContainer">
                                <h2>Submit your custom architectural or product design</h2>
                                <p className="boldText">You can submit your design (in AutoCAD / Sketch Up) for any custom product or custom plans (kitchen
                                    plan/ living room plan or entire home design etc.) and we will get back to you with BOQ and vendors who
                                    can execute/build your design elements.</p>
                            </div>
                            <div className="buttonContainer">
                                <GradientButton
                                    runFunction={() => {
                                        this.props.reCustomizeProduct(
                                            "open",
                                            {
                                                dropdownModal: "dropdownInModal",
                                                modalType: "designerForm"
                                            }
                                        )
                                    }}
                                >
                                    Submit your design here
                                </GradientButton>
                            </div>
                        </div>
                        <div className="iconBoxContainer">
                            <div className="icon">
                                <StarIcon />
                            </div>
                            <p>Design courtesy : <span> Ar. Aneesh </span>  from  <span> Anil Dube Architects </span></p>
                        </div>
                    </div>
                    <div className="formInfoContaier">
                        <div className="formInfoContainerInnerLayer">
                            {/* <div className="line"></div> */}
                            <div className="stepInfoContainer">
                                <div className="customInfoStepsContainer">
                                    <div className="imgContainer">
                                        <img src="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/customDesignSubmit_drawing-01.png" alt="" />
                                    </div>
                                    <div className="processInfoContainer">
                                        <div className="processInfoContainerInnerLayer">
                                            <div className="pointIdentityContainer">
                                                <h2>1</h2>
                                            </div>
                                            <div className="pointInfoContainer">
                                                <h3>You submit your design (100% confidential between you and us)</h3>
                                                <p>You can submit your design, be it a product or a custom plan of a kitchen,
                                                   entire house, living area,bathroom etc. You can submit some 3Ds, plans and
                                                   drawings in image format which should have detailed measurements of the
                                                   components you want us to procure for you.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="customInfoStepsContainer">
                                    <div className="imgContainer">
                                        <img src="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/customDesignSubmit_requirement_list-01.png" alt="" />
                                    </div>
                                    <div className="processInfoContainer">
                                        <div className="processInfoContainerInnerLayer">
                                            <div className="pointIdentityContainer">
                                                <h2>2</h2>
                                            </div>
                                            <div className="pointInfoContainer">
                                                <h3>Our expert architects draft a requirement sheet</h3>
                                                <p>We create a requirements sheet where we will identify and list out all the elements you need for your
                                                   architectural design or a product design.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="customInfoStepsContainer">
                                    <div className="imgContainer">
                                        <img src="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/customDesignSubmit_element_segregation-01.png" alt="" />
                                    </div>
                                    <div className="processInfoContainer">
                                        <div className="processInfoContainerInnerLayer">
                                            <div className="pointIdentityContainer">
                                                <h2>3</h2>
                                            </div>
                                            <div className="pointInfoContainer">
                                                <h3>You can select from different options for an elememt</h3>
                                                <p>Rolling logs will provide you with different options for a single product
                                                   where you can select one based on parameters like cost / brand / specifications
                                                   etc. and we will finalise it.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="customInfoStepsContainer">
                                    <div className="imgContainer">
                                        <img src=" https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/customDesignSubmit_cost_breakdown-01.png" alt="" />
                                    </div>
                                    <div className="processInfoContainer">
                                        <div className="processInfoContainerInnerLayer">
                                            <div className="pointIdentityContainer">
                                                <h2>4</h2>
                                            </div>
                                            <div className="pointInfoContainer">
                                                <h3>We create a BOQ of products, materials and services</h3>
                                                <p>We make a BOQ of the required products, materials and services
                                                   calculated according to your design and give it to you. We include
                                                   services like carpentry, plumbing, painting etc.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="customInfoStepsContainer">
                                    <div className="imgContainer">
                                        <img src="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/customDesignSubmit_installer-01.png" alt="" />
                                    </div>
                                    <div className="processInfoContainer">
                                        <div className="processInfoContainerInnerLayer">
                                            <div className="pointIdentityContainer">
                                                <h2>5</h2>
                                            </div>
                                            <div className="pointInfoContainer">
                                                <h3>Our installers install the products on your site</h3>
                                                <p>After you are okay with the BOQ, our installers come to your
                                                   site on the date and time scheduled by you and install the products
                                                   under our collaborative supervision.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="buttonContainer">
                                <GradientButton
                                    runFunction={() => {
                                        this.props.reCustomizeProduct(
                                            "open",
                                            {
                                                dropdownModal: "dropdownInModal",
                                                modalType: "designerForm"
                                            }
                                        )
                                    }}
                                >
                                    What are you waiting for? Submit your design here
                                </GradientButton>
                            </div>
                        </div>
                    </div>
                </div>
                <NewFooter />
                <div className="modalContainer">
                    {this.returnModals()}
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state) => {
    return {
        openOrCloseModal: state.openOrCloseModal
    }
};

export default connect(mapStateToProps, { reCustomizeProduct })(CustomDesign);