import React from 'react'
import { TimelineLite } from 'gsap'

import { LogoLoadingAnimation } from "../../assets/images"
import "../../assets/css/animations.css"

export default class LogoAnimation extends React.Component{

    componentDidMount() {
        const runAnimation = () => {

            let tl = new TimelineLite({
                onComplete: function () {
                    tl.restart();
                }
            })

            tl
                .set(".loadingArchitectureInnerWrap", {
                    "opacity": 1,
                })

                .to("#window", 0.25, {
                    "strokeDashoffset": 0,
                    ease: Power3.easeIn
                })

                .to("#buildingOuterCoverLine", 0.5, {
                    "strokeDashoffset" : 0,
                    ease: Power3.easeIn
                } , "-=0.1")

                .to("#backgroundLand", 0.25, {
                    "strokeDashoffset": 0,
                    ease: Power3.easeIn
                },"-=0.2")

                .to("#treeSculpture", 0.25, {
                    "strokeDashoffset": 0,
                    ease: Power3.easeIn
                }, "-=0.2")

                .to("#treeBush", 0.25, {
                    "strokeDashoffset": 0,
                    
                }, "-=0.1")

                .to("#treeBushTwo", 0.5, {
                    "strokeDashoffset": 0,
                    ease : Power3.easeIn
                }, "-=0.1")

                .to("#buildingInnerStrokeLines", 0.5, {
                    "strokeDashoffset": 0,
                    ease: Power3.easeIn
                })

                .to("#window", 0.5, {
                    "fill": "#29ABE2",
                    ease: Power3.easeIn
                })

                .to(".aestheticArchitectureBuildingAnimation", 0.25, {
                    "opacity": 1,
                    ease : Power3.easeIn
                } )

                .to(".aestheticArchitectureBuildingAnimation", 2, {
                    "opacity": 1,
                    ease: Power3.easeIn
                })

                .to(".loadingArchitectureInnerWrap", 0.25, {
                    "opacity": 0,
                    ease: Power3.easeIn,
                })
        }

        runAnimation()
    }

    render() {
        return (
            <div
                className="architectureBuildingAnimationWrapper"
            >
                <article
                    className="loadingArchitectureInnerWrap"
                    title="Bringing back the art in Architecture"
                >
                    <section
                        className="rollingLogsAnimation"
                    >
                        <LogoLoadingAnimation />
                    </section>

                    <section
                        className="aestheticArchitectureBuildingAnimation"
                        style = {{opacity : 0}}
                    >
                        <h4>{this.props.text}</h4>
                    </section>

                </article>


            </div>

        )
    }

    
}