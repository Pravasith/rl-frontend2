import React from 'react'
import { HeartIcon, IndiaIcon } from '../../assets/images';
import '../../assets/css/footer.css'

export const Footer = () => {
    return (
        <footer className="footerWrapper">
           <article className="leftSideTermsETC">
                <div className="termsAndConditionsButton">
                    <a
                        href="https://s3.amazonaws.com/xi-upload/terms-conditions/TscaleHub+Copyright+Policy+version+1.0.pdf"
                        target="_blank"
                    >
                        <p>Copyright policy</p>
                    </a>
                </div>

                <div className="termsAndConditionsButton">
                    <a
                        href="https://s3.amazonaws.com/xi-upload/terms-conditions/Tscalehub+-+Privacy+Policy+version+1.0.pdf"
                        target="_blank"
                    >
                        <p>Privacy policy</p>
                    </a>
                </div>

                <div className="termsAndConditionsButton">
                    <a
                        href="https://s3.amazonaws.com/xi-upload/terms-conditions/Tscalehub+Community+Guidelines+1.0.pdf"
                        target="_blank"
                    >
                        <p>Community Guidelines</p>
                    </a>
                </div>

                <div className="termsAndConditionsButton">
                    <a
                        href="https://s3.amazonaws.com/xi-upload/terms-conditions/Tscalehub-+Terms+and+Conditions+version+1.0.pdf"
                        target="_blank"
                    >
                        <p>Terms and conditions</p>
                    </a>
                </div>
            </article>

            <article className="madeWithLoveByArchitectsOfIndia">
                <p>Made with</p>
                <div className="iconWrap">
                    <HeartIcon/>
                </div>
                <p>in</p>
                <div className="iconWrap">
                    <IndiaIcon/>
                </div>

            </article>
        </footer>
    )
};