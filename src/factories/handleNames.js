import ProductCategory from "../lib/productsCategory";

export const convertToKebabCase = (theString) => {
    return theString.split("").reduce((all, char, i) => {
        if (char !== " ") {
            if (char === char.toUpperCase() && i > 0 && all.split("")[all.split("").length - 1] !== "-") {
                return all + "-" + char.toLowerCase()
            }

            else {
                return all + char.toLowerCase()
            }
        }

        else {
            return all + "-"
        }
    }, "")
}


export const handleNames = (theData, differentiationNumber) => {

    if (differentiationNumber === 1)
        return convertToKebabCase(theData.categoryName)

    else if (differentiationNumber === 2)
        return convertToKebabCase(theData.subCategoryName)

    else if (differentiationNumber === 3)
        return convertToKebabCase(theData.productTypeName)
}


export const handleCategoryName = (categoryId) => {
    return ProductCategory.filter(product => categoryId === product.categoryId)[0]
}

export const handleProdTypeName = (categorisedData, subCategoryId) => {
    let defaultProdTypeName = "";

    if (categorisedData) {
        categorisedData.map((item, i) => {
            if (item.subCategoryId === subCategoryId) {
                return defaultProdTypeName = convertToKebabCase(item.productTypes[0].productTypeName);
            }
        })
    }

    return defaultProdTypeName;
}