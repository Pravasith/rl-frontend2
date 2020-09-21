import React from "react"
import { Image } from 'cloudinary-react'

import "../../assets/css/html_slider.css"

import PublicId from '../../factories/cloudinaryFactory'
import LogoAnimation from "../animations/logoAnimation"
import { WhiteArrowLeft, WhiteArrowRight, TinyCloseButton, TinyEditButton } from "../../assets/images"
import { TimelineLite } from "gsap";



// Use component like this 

// <HtmlSlider
//     categoryData = { item } // format of Item 
//     numberOfSlides = { 4 } // Change the css grid properties for responsiveness
//     textOnRibbon = { "TRENDING NOW" } // All caps
//     runFunction={(data) => ///} // onClick function
// />

// Format of Item

// { 
//     categoryName : "Water bodies",
//     imagesInCategory : [
//         {
//             itemCode : "WB12",
//             textOnRibbonSatisfied : true,
//             imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSXk1JV3DCwbJU_lNhIur-A3jZD8NnU89SN8WY_7h5B0zdqRbYceg",
//             title : "Monitor picture" //- optional
//         },
//         {
//             itemCode : "WB13",
//             textOnRibbonSatisfied : false,
//             imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRlNZc4WlFWnRym1Gpz9mzE8T-VpG_SqrKI2Ju1Ej6b0bmzjYrww",
//             title : "Monitor picture" //- optional
//         },
//         {
//             itemCode : "WB14",
//             textOnRibbonSatisfied : false,
//             imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTnFm-l4w9PMzZ_m-o60l7aL0YSb-xcs_xRh74aaVU_avdYgc0s7g",
//             title : "Monitor picture" //- optional
//         },
//         {
//             itemCode : "WB15",
//             textOnRibbonSatisfied : false,
//             imageURL : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLJk1dKAanCmnxn8w5mEsGWKgFRUwP1rXQNtiaJLe4-AjLM7OEYQ",
//             title : "Monitor picture" //- optional
//         },
//     ]
// }, 


export default class HtmlSlider extends React.Component {

    constructor(props, context) {
        super(props, context)

        this.state = {
            loadingClass: 'loadingAnim hide',
            mainClass: 'mainClass ',
            firstName: null,

            imageNumberCount: 0,

            rightArrowClass: "rightArrowButton",
            leftArrowClass: "leftArrowButton",

            imageCountFromProps: this.props.numberOfSlides,

            scrollDistance: 0,

            randomClassName: this.props.uniqueClassName,
            arrowClassName: this.props.uniqueClassName + "X"
        }
    }

    componentDidMount = () => {
        // window.addEventListener('scroll', this.handleScroll);
            let tl = new TimelineLite()

            tl.set(".lA" + this.state.arrowClassName, {
            display: "none",
            // width : "0"
            // background: "yellow"
        })
    }

    scrollForward = async () => {
        let
            // UNCOMMENT
            // d = document,
            // imageWrapper = d.getElementsByClassName(this.state.randomClassName)[0],
            // innerImageContainer = d.getElementsByClassName('image-grid-container')[0],
            // individualBox = d.getElementsByClassName('dummy-elements-wrap')[0]
            // UNCOMMENT

            // COMMENT
            imageWrapper = this.refs.imageWrapper,
            innerImageContainer = this.refs.innerImageContainer,
            individualBox = this.refs.individualBox
        // COMMENT


        let individualBoxWidth = individualBox.offsetWidth + 8
        // let totalNumberOfItems =  innerImageContainer.offsetWidth / individualBoxWidth
        let actualScreenWidthExcludingArrows = imageWrapper.offsetWidth - 50
        let numberOfItemsVisibleOnScreen = actualScreenWidthExcludingArrows / individualBoxWidth
        let lengthToScroll = Math.floor(numberOfItemsVisibleOnScreen) * individualBoxWidth


        if (this.state.scrollDistance < innerImageContainer.offsetWidth - lengthToScroll) {
            let tl = new TimelineLite()

            tl.to(".lA" + this.state.arrowClassName, 0.2, {
                display: "block",
                // width : "100%"
                // background: "yellow"
            })
            await this.setState({
                scrollDistance: this.state.scrollDistance + lengthToScroll
            })
        }

        if (this.state.scrollDistance >= innerImageContainer.offsetWidth - lengthToScroll) {
            let tl = new TimelineLite()

            tl.to(".rA" + this.state.arrowClassName, 0.2, {
                display: "none",
                // background: "yellow"
            })
        }

        imageWrapper.scrollTo(
            this.state.scrollDistance,
            0
        )

        // console.log("Srolled to " + this.state.scrollDistance)
    }

    scrollBackward = async () => {

        let
            // UNCOMMENT
            // d = document,
            // imageWrapper = d.getElementsByClassName(this.state.randomClassName)[0],
            // innerImageContainer = d.getElementsByClassName('image-grid-container')[0],
            // individualBox = d.getElementsByClassName('dummy-elements-wrap')[0]
            // UNCOMMENT

            // COMMENT
            imageWrapper = this.refs.imageWrapper,
            innerImageContainer = this.refs.innerImageContainer,
            individualBox = this.refs.individualBox
        // COMMENT

        let individualBoxWidth = individualBox.offsetWidth + 8
        // let totalNumberOfItems =  innerImageContainer.offsetWidth / individualBoxWidth
        let actualScreenWidthExcludingArrows = imageWrapper.offsetWidth - 50
        let numberOfItemsVisibleOnScreen = actualScreenWidthExcludingArrows / individualBoxWidth
        let lengthToScroll = Math.floor(numberOfItemsVisibleOnScreen) * individualBoxWidth

        if (this.state.scrollDistance > 0) {
            let tl = new TimelineLite()

            tl.to(".rA" + this.state.arrowClassName, 0.2, {
                display: "block",
                // background: "yellow"
            })
            await this.setState({
                scrollDistance: this.state.scrollDistance - lengthToScroll
            })
        }

        if (this.state.scrollDistance < lengthToScroll) {

            let tl = new TimelineLite()

            tl.to(".lA" + this.state.arrowClassName, 0.2, {
                display: "none",
                // background: "yellow"
            })
        }

        imageWrapper.scrollTo(
            this.state.scrollDistance,
            0
        )
    }

    returnPrice = (image) => {
      
        if(image.discountPercentage){
            if(Number(image.discountPercentage.split("%")[0]) > 0)
            {
                return (
                    <div className="cost-container-slider">
                        <div className="real-cost">
                            <h1>{image.strikeThroughText}</h1>
                        </div>
                        {
                            image.mainText
                            ?
                            <div className="offer-cost">
                                <h1>{image.mainText}</h1>
                            </div>
                            :
                            null
                        }
                    </div>
                )
            }
        }
        

        else{
            return (
                <div className="cost-container-slider">
                   <div className="offer-cost">
                        <h1>{image.strikeThroughText}</h1>
                    </div>
                </div>
            )
        }
    }

    showItems = (productDetailObject) => {

        return productDetailObject.imagesInCategory.map((image, i) => {

            let imageTitleTrimmed, imageSubTitleTrimmed

            if (image.title) {
                imageTitleTrimmed = image.title
                if (image.title.length >= 55)
                    imageTitleTrimmed = image.title.split("").filter((char, j) => j <= 55).join("") + "..."
            }

            if (image.subTitle) {
                imageSubTitleTrimmed = image.subTitle
                if (image.subTitle.length >= 55)
                    imageSubTitleTrimmed = image.subTitle.split("").filter((char, j) => j <= 55).join("") + "..."
            }

            return (
                <a 
                    href = { image.hrefLink ? image.hrefLink : null }
                    key={i}
                    // COMMENT
                    ref="individualBox"
                    // COMMENT
                >
                <div
                    className="dummy-elements-wrap"
                    
                    onClick={() => {
                        if(this.props.runFunction) 
                        this.props.runFunction(image)
                    }}
                    >
                        <div className="elements-in-slider-wrapper">
                            <div
                                className="slider-image"
                                style={
                                    {
                                        // background: "yellow",
                                        minWidth: this.props.imageWidth ? Number(this.props.imageWidth) : 250,
                                        minHeight: this.props.imageWidth ? Math.floor(Number(Number(this.props.imageWidth) * 1 / 1.618)) : 180
                                    }
                                }
                                >
                                <Image
                                    cloudName="rolling-logs"
                                    alt={image.itemCode}
                                    publicId={PublicId(image.imageURL)}
                                    // transformations
                                    // width="250" 
                                    // height= "180"
                                    width={this.props.imageWidth ? Number(this.props.imageWidth) : "250"}
                                    height={this.props.imageWidth ? Math.floor(Number(Number(this.props.imageWidth) * 1 / 1.618)) : "180"}
                                    crop="limit"
                                    secure="true"
                                />
                            </div>

                            {
                                image.title
                                    ?
                                    <div className="image-title-container">
                                        <h1>
                                            {imageTitleTrimmed}
                                        </h1>
                                    </div>
                                    :
                                    <div></div>
                            }

                            {
                                image.subTitle
                                    ?
                                    <div className="image-sub-title-container">
                                        <p>
                                            {imageSubTitleTrimmed}
                                        </p>
                                    </div>
                                    :
                                    <div></div>
                            }

                            {
                                image.strikeThroughText
                                ?
                                <div className="discount-container">
                                
                                    { this.returnPrice(image) }
                                    {
                                        image.discountPercentage
                                        ?
                                        <div className="discount-offer-wrap">
                                            <div className="discount-percent-wrap">
                                                <h3>{image.discountPercentage}</h3>
                                            </div>
                                            {
                                                image.priceOff
                                                ?
                                                <p className="you-save-wrap">
                                                    {image.priceOff }
                                                </p>
                                                :
                                                null
                                            }
                                        </div>
                                        :
                                        <div></div>
                                    }
                                </div>
                                :
                                null
                            }


                        </div>

                        <div className={image.textOnRibbonSatisfied ? "tagContainer" : "hide"}   >
                            <div className="textOnRibbon">
                                <p>{this.props.textOnRibbon}</p>
                            </div>

                            <div className="leftTriangle"></div>

                            <div className="rightTriangle">
                                <div className="topTriangle"></div>
                                <div className="botTriangle"></div>
                            </div>
                        </div>

                    </div>
                </a>
                
            )
        })
    }

    render() {

        return (


            <div className="productView">
                <div className="innerViewProductLayer">
                    <div
                        // UNCOMMENT
                        // className = {"slider-main-images-container " + this.state.randomClassName}
                        // UNCOMMENT

                        // COMMENT
                        className={"slider-main-images-container"}
                        ref="imageWrapper"
                    // COMMENT

                    >
                        <div
                            className="inner-wrap-image-slider"

                        >

                            <div
                                // UNCOMMENT
                                className="image-grid-container"
                                // UNCOMMENT

                                // COMMENT
                                ref="innerImageContainer"
                            // COMMENT

                            >
                                {
                                    this.showItems(this.props.categoryData)
                                }
                            </div>
                        </div>


                    </div>

                    <div className={"arrowButtonContainer leftArrowWrap" + " lA" + this.state.arrowClassName}>
                        <div
                            className={this.state.leftArrowClass}
                            onClick={() => {
                                this.scrollBackward()
                            }}
                        >
                            <WhiteArrowLeft />
                        </div>
                    </div>


                    <div className={"arrowButtonContainer rightArrowWrap" + " rA" + this.state.arrowClassName}>
                        <div
                            className={this.state.rightArrowClass}
                            onClick={() => {
                                this.scrollForward()
                            }}
                        >
                            <WhiteArrowRight />
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}