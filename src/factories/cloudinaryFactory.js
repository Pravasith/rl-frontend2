export default function(imageURL){
    let publicId = imageURL !== "" && imageURL !== null ?  imageURL.split("/")[7].split(".")[0] : null
    // console.log(publicId)
    return publicId
}