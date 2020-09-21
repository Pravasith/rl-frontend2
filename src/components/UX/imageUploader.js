import React from "react"

import { connect } from "react-redux"
import { bindActionCreators } from "redux"

import axios from "axios"

import { getUserData } from "../../actions/userActions"
import { hitApi, navBarLoadingAnimationShowHide } from "../../actions/generalActions";

import { UploadImageIcon } from '../../assets/images';
import "../../assets/css/image_uploader.css"
import { decryptData } from "../../factories/encryptDecrypt";
import { api } from "../../actions/apiLinks";
import { TimelineLite } from "gsap";


// use this component like this
//
// <ImageUploader
//     imageType = "regularImage" // regularImage || profileImage
//     resultData = {(data) => console.log(data)}
//     showInitialImage = "" // image src link // optional
//     imageClassName = "companyProfilePictureClass" // unique name for each instance
// />

class ImageUploader extends React.Component {

    constructor(props, context) {
        super(props, context)

        this.state = {
            pictureClass: "pictureContainer",
            smallLoader: "smallLoader hide",

            message: "Click here to upload an image.Formats allowed are.jpeg,.jpg,.png (Max. 1 MB)",

            uploadIconClass: "uploadIconWrap",
            imageClass: "imageCover hide",

            imageURL: ""

        }
    }

    // componentDidMount = () => {
    //     this
    //         .props
    //         .getUserData()
    //         .then(() => {
    //             let { userData } = this.props

    //             //
    //             // DECRYPT REQUEST DATA
    //             //
    //             let decryptedData = decryptData(userData.responseData)
    //             //
    //             // DECRYPT REQUEST DATA
    //             //

    //             this.setState({
    //                 userData : decryptedData
    //             })

    //             if(this.props.showInitialImage){
    //                 this.setState({
    //                     // image : res.data.imageURL,
    //                     pictureClass : "pictureContainer",
    //                     smallLoader: "smallLoader hide",
    //                     message: "Click to upload another image.",

    //                     uploadIconClass: "uploadIconWrap hide",
    //                     imageClass: "imageCover",
        
    //                     imageURL: this.props.showInitialImage
    //                 })
    //             }

                
    //         })

    //         .catch((err) => {
    //             if (err.response) {
    //                 if (err.response.status === 401)
    //                     window.open('/log-in', "_self")
    //             }

    //             else
    //                 console.error(err)
    //         })

    // }

    pictureUploader = (e) => {
        if (e.target.files[0])
            this.uploadHandler(e.target.files[0])
    }

    uploadHandler = (theFile) => {
        if (theFile) {

            // check for size
            if (theFile.size > 1 * 1024 * 1024) {
                this.setState({
                    // image : res.data.imageURL,
                    pictureClass: "pictureContainer",
                    smallLoader: "smallLoader hide",
                    message: "The image you are trying to upload exceeds 1 MB in size. Click here again to upload a new one.",

                    uploadIconClass: "uploadIconWrap hide",
                    imageClass: "imageCover",

                    imageURL: "https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/imageTooBig-01.png"
                })
            }

            else {

                this.setState({
                    pictureClass: "pictureContainer hide",
                    smallLoader: "smallLoader",
                })

                const reader = new FileReader()

                reader.onloadend = () => {
                    const fd = new FormData()

                    const getExtensionOfFile = () => {
                        const fileExtention = '.' + theFile.type.split('/')[1]
                        return fileExtention
                    }

                    const generateRandomString = () => {

                        let text = ""
                        let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

                        for (var i = 0; i < 10; i++)
                            text += possible.charAt(Math.floor(Math.random() * possible.length))
    
                        const randomString = this.props.imageType 
                            + "-" + "ARC-123"
                            + "-" + text  + "-" + Date.now() 
                        return randomString
                    }

                    const newName = generateRandomString() + getExtensionOfFile()

                    fd.append('toxicData', theFile, newName)
                    this.uploadImageToBackend(fd)
                }

                reader.readAsDataURL(theFile)
            }


        }

    }

    progressTrack = (progressEvent) => {
        const tl = new TimelineLite()
        let progress = (progressEvent.loaded / progressEvent.total * 100)
        tl.to('.innerLoadingBar', 0.2, {
            width: progress + "%"
        })
    }


    uploadImageToBackend = (imageData) => {

        // uploads image to backend. From there 
        // the image is written to an s3 bucket


        axios.post(api.UPLOAD_IMAGE, imageData,
            {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    'Content-Type': 'image/png' || 'image/jpg' || 'image/jpeg' || 'image/gif'
                },

                withCredentials: true,

                onUploadProgress: this.progressTrack
            })

            .then(res => {
                // console.log(res.data)
                this.setState({
                    // image : res.data.imageURL,
                    pictureClass: "pictureContainer",
                    smallLoader: "smallLoader hide",
                    message: "You have uploaded this one. Click to change.",

                    uploadIconClass: "uploadIconWrap hide",
                    imageClass: "imageCover",

                    imageURL: res.data.imageURL
                })

                const tl = new TimelineLite()
                tl.set('.innerLoadingBar', {
                    width: 0 + "%"
                })

                // console.log(res)

                this.props.resultData(res.data)

            })
            .catch(err => {
                console.error(err)
                throw err
            })
    }

    render() {
        return (
            <div className={"imageUploaderWrap " + this.props.imageClassName}>
                <div className="pictureUpload">

                    <div className="inputContainer">
                        <input
                            onInput={(e) => this.pictureUploader(e)}
                            onClick={(event) => {
                                event.target.value = null
                            }}
                            ref="uploadLabel"
                            style={{ display: "none" }}
                            type="file"
                            name="uploadImage"
                            id={"uploadImageInput" + this.props.imageClassName}
                            accept="image/*"
                        />

                        <label
                            htmlFor={"uploadImageInput" + this.props.imageClassName}
                            className={this.state.pictureClass}
                        >

                            <div className="uploadContainer" >
                                <div className={this.state.uploadIconClass}>
                                    <UploadImageIcon />
                                </div>

                                <div className={this.state.imageClass}>
                                    <img src={this.state.imageURL} alt="" />
                                </div>

                                <h3>
                                    {this.state.message}
                                </h3>
                            </div>

                        </label>

                        <div className={this.state.smallLoader}>
                            <div className="outerLoadingBar">
                                <div className="innerLoadingBar">
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
    return { userData: state.userData, responseData: state.responseDataFromAPI }
}

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        getUserData,
        hitApi,
        navBarLoadingAnimationShowHide
    }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(ImageUploader)