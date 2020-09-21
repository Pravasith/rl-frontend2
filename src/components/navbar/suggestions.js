import React, {useEffect, useState } from "react";
import { handleCategoryName, convertToKebabCase } from "../../factories/handleNames";
import { alterFetchId } from "../../factories/alterFetchId";

const Suggestions = (props) => {

    const [cursor, setCursor] = useState(null);

    useEffect(() => {
        setCursor(props.cursor)
    }, [props.cursor, props.results, props.redirectURL]);

    const returnPlaceOfItem = (searchId) => {
       if (searchId.length > 7 && searchId.length <= 21) {
            let searchPlaceId;
            let lastIndex = searchId.lastIndexOf("-");
            
            searchPlaceId = searchId.substring(0, lastIndex);

            return props.overallData.map(item => {
                if (searchPlaceId === item.id) return (item.name);
            })
        }

        else if (searchId.length <= 7) return "Categories";

        else if (searchId.length === 27) return "Products";
    }

    const handleURLs = (searchId) => {
        if (searchId) {
            let categoryName, subCategoryName, productTypeName;
            let searchIdLength = searchId.length;
            let lastIndex = searchId.lastIndexOf("-");

            // console.log(lastIndex);

            if (searchIdLength > 7) {
                categoryName = convertToKebabCase(handleCategoryName(searchId.split('-')[0]).categoryName);

                if (searchIdLength === 14) {
                    let prodTypeNamesOfSearchId = props.prodTypeData.filter((item) => (item.id.substring(0, item.id.lastIndexOf("-")) === searchId));

                    props.overallData.map(item => {
                        if (searchId === item.id) {
                            subCategoryName = convertToKebabCase(item.name)
                            productTypeName = convertToKebabCase(prodTypeNamesOfSearchId[0].name)
                        };
                    });

                    window.open(`/products/${categoryName}/${subCategoryName}/${productTypeName}/${alterFetchId(searchId)}`, '_self')
                } 

                else if (searchIdLength === 21) {
                    let subCatId = searchId.substring(0, lastIndex),
                        prodTypeId = searchId;

                    props.overallData.map(item => {
                        if (subCatId === item.id) subCategoryName = convertToKebabCase(item.name);
                        else if (prodTypeId === item.id) productTypeName = convertToKebabCase(item.name);
                    });

                    window.open(`/products/${categoryName}/${subCategoryName}/${productTypeName}/${alterFetchId(searchId)}`, '_self')
                }
            }

            else if (searchIdLength === 7) {
                categoryName = convertToKebabCase(handleCategoryName(searchId.split('-')[0]).categoryName)
            }
        }
    }

    // console.log(props.redirectURL)


    /// OPENING ON ENTER ///
    /// OPENING ON ENTER ///
    /// OPENING ON ENTER ///
    if(props.redirectURL){
        let itemId
        props.results.map((item, i) => {
            if(props.cursor === i){
                itemId = item.id
            }
        })

        handleURLs(itemId)
    }
    /// OPENING ON ENTER ///
    /// OPENING ON ENTER ///
    /// OPENING ON ENTER ///

    if (props.results.length !== 0) {
        const suggestions = props.results.map((item, i) => {
            if(cursor === i){
                props.selectedQuery(item)
            }

            return (
                <li
                    key={`item.id ${i}`}
                    className={cursor === i ? 'active' : null}
                >
                    <h3
                        onClick={() => {
                            console.log("s")
                            handleURLs(item.id)
                        }}
                        
                        onMouseOver={() => {
                            setCursor(i)
                        }}
                    >
                        {item.name} <span>in {returnPlaceOfItem(item.id)}</span>
                    </h3>
                </li>
            )
        }
    )
        return <ul>{suggestions}</ul>
    }

    else {
        return <p className="defaultSearchText">Search amongst 7000+ products</p>
    }
}

export default Suggestions;