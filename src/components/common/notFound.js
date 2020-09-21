import React, { Component } from 'react';
import Head from "next/head";
import { NewBigLogoIcon } from "../../assets/images/index";
import { WhiteButton } from "../UX/uxComponents";
import "../../assets/css/navbar.css";

class NotFound extends Component{

    returnMetaTags = () => {
        return(
            <Head>
                <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
                <meta name="robots" content="noindex" />
            </Head>
        )
    }

    render(){
        return (
            <div className="page-error-container">
                {this.returnMetaTags()}
                <div className="page-error-inner-container">
                    <div className="error-page-header-container">
                        <NewBigLogoIcon/>
                    </div>
                    <div className="error-page-info-container">
                        <div className="error-page-inner-container">
                            <div className="error-img">
                                <img src="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/footer-image.png" alt="" />
                            </div>
                            <div className="error-text-container">
                                <h3>Oops! the page you are looking for has been moved or deleted.</h3>
                            </div>
                            <a href="/">
                                <div className="error-button-container">
                                    <WhiteButton>
                                        GO TO HOMPAGE
                                </WhiteButton>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default (NotFound);