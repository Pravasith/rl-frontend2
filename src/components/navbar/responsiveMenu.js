import React, { Component } from "react";
import { alterFetchId } from "../../factories/alterFetchId";
import { handleNames } from "../../factories/handleNames";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { api } from "../../actions/apiLinks";
import { reCustomizeProduct } from "../../actions/productCustomizationActions";
import { navBarLoadingAnimationShowHide, hitApi } from "../../actions/generalActions";
import { checkForAuth } from "../../actions/userActions";

import { MinusIcon, PlusIcon } from "../../assets/images/index";
import Searchbar from "./searchbar";
import nameRephraser from "../../factories/nameRephraser";

// import { SmallModalCloseButton } from "../../assets/images/index";

class ReturnMenuModal extends Component {

    state = {
        menuCategoryModal : "menuCategoryModal",
        subCategoryHeader : "subCategoryHeader",
        sCatsCollapseExpand: [],
        navBarWholeCategoryData: [],
    };

    componentDidMount = async () => {
        let theResponseDataObj = {}

        let dummyArray = [];

        await Promise.all([
            // this.props.checkForAuth(),
            this.props.hitApi(api.GET_ALL_PRODUCTS_DATA, "GET")
        ])
            .then(data => {
                let { isAuthed } = this.props;

                theResponseDataObj = data.reduce((all, item) => {
                    if (item) {
                        all = {
                            ...all,
                            ...item.payload.responsePayload
                        }
                    }

                    return all
                }, {})


                if (isAuthed.isAuthenticated) {
                    this.setState({
                        userAuthed: true,
                        profilePicture: isAuthed.profilePicture,
                        firstName: isAuthed.firstName,
                        lastName: isAuthed.lastName,
                        showLoading: false

                    })
                }

                else {
                    this.setState({
                        loadingClass: "loadingAnim hide",
                        mainClass: "mainClass",
                        userAuthed: false,
                        showLoading: false
                    })
                }


                this.setState({
                    navBarWholeCategoryData: [...theResponseDataObj.allCategories],
                });
            })
            .catch(err => {
                console.error(err);
            });

        // window.addEventListener('resize', this.displayBar);
    }

    categoryDataAllProducts = () => {
        const { categories, navBarWholeCategoryData } = this.state

        if (categories) {
            if (categories.length !== 0) {
                if (navBarWholeCategoryData.length !== 0) {
                    return navBarWholeCategoryData;
                }
            }
        }
    };

    hideSubCategory = (index) => {
        const tl = new TimelineMax()

        tl
            .to(".sCat" + index, 0.1, { opacity: 0 })
            .set(".sCat" + index, { display: "none" })

        let dummyArray = [...this.state.sCatsCollapseExpand]

        if (!dummyArray.includes("sCat" + index)) {
            dummyArray.push("sCat" + index)
        }

        this.setState({
            sCatsCollapseExpand: dummyArray
        })
    };

    showSubCategory = (index) => {
        const tl = new TimelineMax()

        tl
            .set(".sCat" + index, { display: "flex" })
            .to(".sCat" + index, 0.1, { opacity: 1 })

        let dummyArray = [...this.state.sCatsCollapseExpand]

        dummyArray.splice(dummyArray.indexOf("sCat" + index), 1)

        this.setState({
            sCatsCollapseExpand: dummyArray
        })
    };

    returnRelevantIconBox = (index) => {
        let collapseOrExpandIcon = "collapseActive"

        this.state.sCatsCollapseExpand.map((item, i) => {
            if ("sCat" + index === item) {
                collapseOrExpandIcon = "expandActive"
            }
        })

        if (collapseOrExpandIcon === "collapseActive")
            return (
                <div
                    className="iconBox"
                    onClick={() => {
                        this.hideSubCategory(index)
                    }}
                >
                    <MinusIcon />
                </div>
            )

        else if (collapseOrExpandIcon === "expandActive")
            return (
                <div
                    className="iconBox"
                    onClick={() => {
                        this.showSubCategory(index)
                    }}
                >
                    <PlusIcon />
                </div>
            )
    };
   
    categoryData = () => {
        const { navBarWholeCategoryData } = this.props;

        const returnSubCategory = (item) => {
            return item.subCategories.map((subCat, k)=>{
                const fetchId = subCat.subCategoryId
                return(
                    <a 
                        key={k}
                        href={
                            "/products/" +
                            handleNames(item, 1) + "/" +
                            handleNames(subCat, 2) + "/" +
                            handleNames(subCat.productTypes[0], 3) + "/" +
                            alterFetchId(fetchId)
                        }
                        >                    
                        <div
                            className="subCategoryHeaderContainer"
                            >
                            <p>{subCat.subCategoryName}</p>
                        </div>
                    </a>
                    
                )
            })
        }

        if (navBarWholeCategoryData.length !== 0) {
            return navBarWholeCategoryData.map ((item,i) => {
                // console.log(item)
                return(
                    <div
                        key={i}
                        className="categoryHeaderContainer">  
                        <div className="expansionButtonContainer">
                            <h3>{nameRephraser(item.categoryName)}</h3>
                            {this.returnRelevantIconBox(i)}
                        </div> 
                        <div className={this.state.subCategoryHeader + " sCat" + i}>
                            {returnSubCategory(item)}
                        </div>
                        {/* <div className="subCategoryHeader">
                            {returnSubCategory(item)}
                        </div> */}
                        <div className="line"></div>
                    </div>
                )
            })
        }
    }

    render() {
        return(
            <div className={this.props.menuCategoryModal}>
                <div className="responsive-category-data-container"> 
                    <div className="searchContainer">
                        {/* <Searchbar /> */}
                        {this.state.navBarWholeCategoryData.length === 33 ?
                                <Searchbar allCategoriesData={this.state.navBarWholeCategoryData} />
                            :
                                <h3>Loading ...</h3>
                            }
                    </div>
                    {this.categoryData()}
                </div>
            </div>
        )
    }
};

const mapStateToProps = (state) => {
    return {
        responseData: state.responseDataFromAPI,
        userData: state.userData,
        isAuthed: state.isAuthed,
    }
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        navBarLoadingAnimationShowHide,
        hitApi,
        checkForAuth,
        reCustomizeProduct
    }, dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(ReturnMenuModal);
// export default ReturnMenuModal;