import React, { Component } from "react";
import Link from "next/link";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";

import { api } from "../../actions/apiLinks";
import { navBarLoadingAnimationShowHide, hitApi } from "../../actions/generalActions";
import { reCustomizeProduct } from "../../actions/productCustomizationActions";
import { addToCartClicked, checkForAuth } from "../../actions/userActions";

import LoginOrSignUpModal from "../common/loginOrSignUp/modals/loginOrSignUpModal";
import CartTruckData from "./cartTruckData";
import ReturnMenuModal from "./responsiveMenu";
import Searchbar from "./searchbar";

import ProductsDropdownIndex from "../drop-down";

import { WhiteButton } from "../UX/uxComponents";
import { CategoryMenuCloseButton, NewLogoIcon, MenuIcon } from "../../assets/images/index";

import "../../assets/css/navbar.css";
import { ProfilePictureIcon, NavBarLoadingIcon, DropDownIcon, SignOutIcon } from "../../assets/images";

import Categories from "../../lib/productsCategory";

class Navbar extends Component {

    state = {
        menuDrop: "menuDrop hide",
        triangle: "dropDownIcon",
        isHide: false,

        allProdCatSelected: "",

        productCategoriesMenu: "productCategoriesMenu",
        scrolling: false,

        dropdownModal: "dropdownModal hide",
        menuCategoryModal: "menuCategoryModal hide",

        isShowing: false,

        dropDownClass: "allProductsDropdownModalCategorySectionInnerLayer",
        dropDownLoaderClass: "loaderAnimationWrap hide",

        loginOrSignUpActive: "logIn",

        categories: [
            {
                categoryName: "Furniture",
                categoryId: "CAT0012"
            },
            {
                categoryName: "Bathroom",
                categoryId: "CAT0001"
            },
            {
                categoryName: "Kitchen",
                categoryId: "CAT0017"
            },
            {
                categoryName: "Outdoor",
                categoryId: "CAT0021"
            },
            {
                categoryName: "Lighting",
                categoryId: "CAT0019"
            },
            {
                categoryName: "Office",
                categoryId: "CAT0020"
            },
            {
                categoryName: "Décor",
                categoryId: "CAT0004"
            },
            {
                categoryName: "Wellness",
                categoryId: "CAT0030"
            },
            {
                categoryName: "Finishing",
                categoryId: "CAT0009"
            },
            {
                categoryName: "All categories",
                categoryId: 10
            }
        ],

        navBarWholeCategoryData: [],
        trendingArray: [],

        categorySelected: "",

        userAuthed: false,
        showLoading: true,

        categoryModal: "categoryModal hide",

        highLightedCategory: "highlighted-category"
    };

    componentDidMount = async () => {

        let theResponseDataObj = {}

        let dummyArray = [];

        const get20TrendingProducts = () => {
            Categories.map((cat, i) => {
                this.props.hitApi(api.TRENDING_20_PRODUCTS, "POST",
                    {
                        requestData: {
                            categoryId: cat.categoryId
                        },
                        message: "Requesting 20 products"
                    }
                )
                    .then((res) => {
                        let { trending20 } = res.payload.responsePayload;

                        dummyArray.push({
                            categoryId: cat.categoryId,
                            trendingProducts: trending20
                        })

                        this.setState({
                            trendingArray: [...dummyArray]
                        })
                    })
                    .catch(err => {
                        console.error(err);
                    });
            })

            // return x
        }

        get20TrendingProducts()

        await Promise.all([
            this.props.addToCartClicked(),
            this.props.checkForAuth(),
            this.props.hitApi(api.GET_ALL_PRODUCTS_DATA, "GET")
        ])
            .then(async data => {
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
                    await this.props.hitApi(api.GET_ITEMS_IN_CART, "GET")
                    .then(res => {
                        let { cart, cartItemsExist } = res.payload.responsePayload;
                       

                        if (cart) {
                            if (cartItemsExist) {
                                this.setState({
                                    truckLoad: cart.cartItems
                                })
                            }
                        }
                        
                    })
                    .catch(err => console.log(err))

                    this.setState({
                        loadingClass: "loadingAnim hide",
                        mainClass: "mainClass",
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

                // console.log([...theResponseDataObj.allCategories])

                this.setState({
                    navBarWholeCategoryData: [...theResponseDataObj.allCategories],
                    dropDownClass: "allProductsDropdownModalCategorySectionInnerLayer",
                    dropDownLoaderClass: "loaderAnimationWrap hide"
                });


                // window.addEventListener("scroll", this.hideBar);
            })
            .catch(err => {
                console.error(err);
            });

        window.addEventListener("scroll", this.hideBar);
    };

    componentWillUnmount = () => {
        window.removeEventListener("scroll", this.hideBar);
    };

    hideBar = () => {

        const tl = new TimelineMax()

        if (window.scrollY > this.prev) {
            tl.to(
                ".productCategoriesMenu, .product-categories-menu-wrap",
                0.2,
                {
                    y: "-100%"
                }
            )

        }

        else {
            tl.to(
                ".productCategoriesMenu, .product-categories-menu-wrap",
                0.2,
                {
                    y: "0%",
                }
            )
        }

        
        this.prev = window.scrollY;
    };

    toggleClass = (theIcon) => {
        if (theIcon === "cornerMenu") {
            if (this.state.menuDrop === "menuDrop") {
                this.setState({
                    menuDrop: "menuDrop hide",
                    triangle: "dropDownIcon"
                })
            }

            if (this.state.menuDrop === "menuDrop hide") {
                this.setState({
                    menuDrop: "menuDrop",
                    triangle: "dropDownIcon rotated"
                })
            }
        }
    };

    returnCustomDesignBtn = () => {
        return (
            <a href="/submit-design">
                <div className="submit-custom-design">
                    <WhiteButton>
                        Submit custom design
                    </WhiteButton>
                </div>
            </a>

        )
    };

    returnFooter = () => {
        if (this.state.userAuthed !== true) {
            return (
                <footer className="loginAndSignUpButtons">
                    {/* <div
                        className={this.props.hideCart ? "hide" : "cart-container"}
                        onClick={() => {
                            window.open('/checkout-details', "_self")
                        }}
                        // onClick={() => console.log("cart truck")}
                    >
                        <CartTruckData savedCartData={this.state.truckLoad} />
                    </div> */}
                    <div className={this.props.hideSubmitButton ? "hide" : "custom-design-wrap"}>
                        {this.returnCustomDesignBtn()}
                    </div>


                    <section className="signUpButton">
                        <a>
                            <div
                                onClick={() => {
                                    this.props.reCustomizeProduct(
                                        "open",
                                        {
                                            dropdownModal: "dropdownInModal",
                                            modalType: "logIn",
                                            requestFrom: "navBar"
                                        }
                                    )
                                }}
                            >
                                <WhiteButton>
                                    Log In
                                </WhiteButton>
                            </div>
                        </a>
                    </section>
                </footer>
            )
        }

        else {
            return (
                <footer>
                    <div
                        className={this.props.hideCart ? "hide" : "cart-container"}
                        onClick={() => {
                            window.open('/checkout-details', "_self")
                        }}
                    >
                        <CartTruckData savedCartData={this.state.truckLoad} />
                    </div>

                    {this.returnCustomDesignBtn()}

                    <div className="menu"
                        tabIndex={0}

                        onMouseEnter={() => {
                            this.toggleClass("cornerMenu")
                        }}

                        onMouseLeave={() => {
                            this.toggleClass("cornerMenu")
                        }}
                    >

                        <div className="profilePicTiny">
                            <div className="innerWrap">
                                {this.returnProfilePicture()}
                            </div>
                        </div>

                        <div className={this.state.triangle}>
                            <DropDownIcon />
                        </div>

                        <div className="menuDropWrap">
                            <div className={this.state.menuDrop}>
                                <div className="dummyWrap"></div>
                                <div className="menuItemsFullWrap">
                                    <a
                                    href="/submit-design"
                                    >
                                        <div
                                            className="submit-custom-design-link"
                                        >
                                        <p>Submit custom design</p>
                                        </div>
                                    </a>
                                    <a
                                        href="/my-orders"
                                    >
                                        <div
                                            className="my-orders-page-link"
                                        >
                                            <p>My Orders</p>
                                        </div>
                                    </a>
                                    <Link href={api.USER_SIGN_OUT}>
                                        <a>
                                            <div className="menuItem">
                                                <div className="icon">
                                                    <SignOutIcon />
                                                </div>
                                                <p>Sign out</p>
                                            </div>
                                        </a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            )
        }
    };

    returnLoading = () => {
        return <div className="loading-navbar"></div>
    };

    returnProfilePicture = () => {
        if (this.state.profilePicture) {
            return (
                <img
                    src={this.state.profilePicture}
                    alt={this.state.firstName + "_" + this.state.lastName}
                />
            )
        }

        else return <ProfilePictureIcon />;
    };

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

    returnTheDropDownBar = (categories) => {

        return categories.map((item, i) => {
            return (
                <div
                    className={item.categoryId === 10 ? "individual-category all-products-wrap" : "individual-category"}
                    key={i}
                    onMouseEnter={() => {
                        this.setState({
                            categorySelected: item.categoryId,
                            categoryModal: "categoryModal",
                            highLightedCategory: ".highlighted-category" + i,
                        })
                    }}

                    onMouseLeave={() => {

                        // /////
                        // TweenMax.to(
                        //     this.state.highLightedCategory,
                        //     0.2,
                        //     {
                        //         background: "#000000",
                        //         width: "0%"
                        //     }
                        // )
                        // //////

                        this.setState({
                            categoryModal: "categoryModal hide",
                            // categoryModal: "categoryModal",
                        })
                    }}
                >
                    <h3>{item.categoryName}</h3>
                    <div className={"clicked-active " + "highlighted-category" + i}></div>
                </div>
            )
        })
    };

    returnDropDownContainer = () => {

        let { trendingArray, navBarWholeCategoryData, categories } = this.state

        return (
            <div
                className={this.state.categoryModal === "categoryModal" ? "drop-down-container" : "drop-down-container hide"} >
                <div className="dummy-drop-down-container">

                    {
                        navBarWholeCategoryData.length === 33 && trendingArray.length === 33
                            ?
                            <ProductsDropdownIndex
                                trendingProductsArray={this.state.trendingArray}
                                categorySelected={this.state.categorySelected}
                                navBarWholeCategoryData={this.state.navBarWholeCategoryData}
                                categories={this.state.categories}
                            />
                            :
                            this.returnDropDownLoading()
                    }
                </div>
            </div>
        )
    };

    returnDropDownLoading = () => {

        return (
            <div
                className="loadingClassAnime"
            // style = {{background: "yellow", padding : "10em"}}
            >
                <div className="loadingAnimeInnerLayer">
                    <div className="imageAnimationContainer">
                        <div className="headerAnimationContainer">
                            <div className="headerContainer"></div>
                        </div>
                        <div className="lower-section">
                            <div className="upperAnimationContainer">
                                <div className="bigBoxContainer">
                                    <div className="bigBoxContainerInnerLayer"></div>
                                </div>
                                <div className="bigBoxContainer">
                                    <div className="bigBoxContainerInnerLayer"></div>
                                </div>
                            </div>
                            <div className="lowerAnimationContainer">
                                <div className="smallBoxContainer">
                                    <div className="smallBoxContainerInnerLayer"></div>
                                </div>
                                <div className="smallBoxContainer">
                                    <div className="smallBoxContainerInnerLayer"></div>
                                </div>
                                <div className="smallBoxContainer">
                                    <div className="smallBoxContainerInnerLayer"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="smallAnimationContainer">
                        <div className="smallAnimeContainer">
                            <NavBarLoadingIcon />
                        </div>
                    </div>
                </div>
            </div>
        )

    };

    returnCategories = () => {
        const { categories } = this.state;

        return (
            <div className="dropdownModalForCategories">
                <div className="gridWrapper">
                    {
                        this.returnTheDropDownBar(categories)
                    }
                </div>

                <div
                    className="drop-down-wrap"

                    onMouseEnter={() => {

                        /////
                        TweenMax.to(
                            this.state.highLightedCategory,
                            0.2,
                            {
                                background: "#000000",
                                width: "100%"
                            }
                        )
                        //////


                        this.setState({
                            categoryModal: "categoryModal"
                        })
                    }}

                    onMouseLeave={() => {

                        /////
                        TweenMax.to(
                            this.state.highLightedCategory,
                            0.2,
                            {
                                background: "#000000",
                                width: "0%"
                            }
                        )
                        //////

                        this.setState({
                            categoryModal: "categoryModal hide",
                            // categoryModal: "categoryModal",
                        })
                    }}

                >
                    {
                        this.returnDropDownContainer()
                    }
                </div>
            </div>
        )
    };

    redirectToHomePage = () => {
        window.open("/", "_self")
    };

    returnModals = () => {
        return <LoginOrSignUpModal />
    };

    render() {
        return (
            <div className="navBarMainClass" ref="navbar">
                <div className="navbarHeaderClass">
                    <div className="navbar-inner-layer-wrap">
                        <div className="navBarInnerLayer">
                            
                            <header className={this.props.hideLogo ? "hide" : "rollingLogsLogo"}>
                                <div className="categoryMenuButton">
                                    <div 
                                        className="menuButtonContainer"
                                        onClick={() => {
                                            this.setState({
                                                menuCategoryModal: "menuCategoryModal"
                                            })
                                        }}
                                    >
                                        <MenuIcon/>
                                    </div>
                                </div>
                                <a 
                                    href="/"
                                    title="Architects, Interior Designers Marketplace in India"
                                    >
                                        <NewLogoIcon />
                                </a>
                                {this.state.navBarWholeCategoryData.length === 33 ?
                                    <div className="search-bar-container">
                                        <Searchbar allCategoriesData={this.state.navBarWholeCategoryData} />
                                    </div>
                                :
                                    <h3></h3>
                                }
                            </header>

                            <article>
                                <div className={this.props.navBarLoadingClass.loadingAnimationClass}>
                                    <div className="loadingIcon">
                                        <NavBarLoadingIcon />
                                    </div>
                                </div>
                            </article>

                            {this.state.showLoading ? this.returnLoading() : this.returnFooter()}
                        </div>
                    </div>

                    <div 
                        className={ this.props.dontDisplayProducts ? "hide" : "product-categories-menu-wrap"}
                        
                        >
                        <div className="productCategoriesMenu" >
                            {this.returnCategories()}
                        </div>
                    </div>
                </div>

                {/* {this.returnModals()} */}
                <div className={this.state.menuCategoryModal}>
                    <div
                        className="close"
                        onClick={() => {
                            this.setState({
                                menuCategoryModal: "menuCategoryModal hide"
                            })
                        }}
                        >
                        <CategoryMenuCloseButton/>
                    </div>
                    <ReturnMenuModal
                        menuCategoryModal={this.state.menuCategoryModal}
                        categorySelected={this.state.categorySelected}
                        navBarWholeCategoryData={this.state.navBarWholeCategoryData}
                        categories={this.state.categories}
                    />
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        cartData: state.cartData,
        navBarLoadingClass: state.navBarLoadingClass,
        responseData: state.responseDataFromAPI,
        userData: state.userData,
        isAuthed: state.isAuthed,
        openOrCloseModal: state.openOrCloseModal
    }
};

const matchDispatchToProps = (dispatch) => {
    return bindActionCreators({
        addToCartClicked,
        navBarLoadingAnimationShowHide,
        hitApi,
        checkForAuth,
        reCustomizeProduct
    }, dispatch)
};

export default connect(mapStateToProps, matchDispatchToProps)(Navbar);