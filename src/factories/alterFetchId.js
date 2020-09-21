// export const alterFetchId = (fetchId) => {

//     let subCat = fetchId.split("-")[0].split("CAT")[1],
//         productType = fetchId.split("-")[1].split("SC")[1],
//         productId = fetchId.split("-")[2] ? fetchId.split("-")[2].split("PT")[1] : null

//     if (productId)
//         return productId.toString() + productType.toString() + subCat.toString()

//     else
//         return productType.toString() + subCat.toString()

// }

// export const getBackFetchId = (alteredFetchId) => {

//     let subCat, productType, productId

//     productId = alteredFetchId.split("").filter((theDigit, i) => i < 4).join("")
//     productType = alteredFetchId.split("").filter((theDigit, i) => i >= 4 && i < 8).join("")

//     if (alteredFetchId.length > 8) {
//         subCat = alteredFetchId.split("").filter((theDigit, i) => i >= 8 && i < 12).join("")
//         return `CAT${subCat}-SC${productType}-PT${productId}`
//     }

//     else
//         return `CAT${productType}-SC${productId}`

// }



export const alterFetchId = (fetchId) => {

    let cat = fetchId.split("-")[0].split("CAT")[1],
        subCat = fetchId.split("-")[1].split("SC")[1],
        productType = fetchId.split("-")[2] ? fetchId.split("-")[2].split("PT")[1] : null,
        productId = fetchId.split("-")[3] ? fetchId.split("-")[3] : null

    if (productId) return productType.toString() + subCat.toString() + cat.toString() + productId.toString()

    else if (productType) return productType.toString() + subCat.toString() + cat.toString()

    else return subCat.toString() + cat.toString()

}

export const getBackFetchId = (alteredFetchId) => {

    let cat, subCat, productType, productId;

    productType = alteredFetchId.split("").filter((theDigit, i) => i < 4).join("")
    subCat = alteredFetchId.split("").filter((theDigit, i) => i >= 4 && i < 8).join("")
    cat = alteredFetchId.split("").filter((theDigit, i) => i >= 8 && i < 12).join("")
    productId = alteredFetchId.split("").filter((theDigit, i) => i >= 12 && i <= 16).join("")

    if (alteredFetchId.length > 12) {
        return `CAT${cat}-SC${subCat}-PT${productType}-${productId}`
    }

    else if (alteredFetchId.length > 8 && alteredFetchId.length <= 12) {
        return `CAT${cat}-SC${subCat}-PT${productType}`
    }

    else if (alteredFetchId.length <= 8) {
        cat = alteredFetchId.split("").filter((theDigit, i) => i <= 8 && i >= 4).join("")
        subCat = alteredFetchId.split("").filter((theDigit, i) => i < 4).join("")

        return `CAT${cat}-SC${subCat}`
    }

}

