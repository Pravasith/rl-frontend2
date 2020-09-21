import React, { Component } from "react";

import { connect } from "react-redux";
import Head from 'next/head';

import { Image } from "cloudinary-react";
import PublicId from "../../factories/cloudinaryFactory";

import NewFooter from '../footer/newFooter';

import LogoAnimation from "../animations/logoAnimation";

import { IndianIcon, LocationIcon, MinusIcon, PlusIcon, ModalCloseButton } from '../../assets/images';

import { api } from "../../actions/apiLinks";
import { hitApi } from "../../actions/generalActions";

import HtmlSlider from "../../components/UX/htmlSlider";
import productCategories from "../../lib/productsCategory";
import { convertToKebabCase, handleCategoryName } from "../../factories/handleNames";
import { alterFetchId } from '../../factories/alterFetchId';

class VendorSharedLink extends Component {

  state = {
    subCategoryHeaderAndImages: `subCategoryHeaderAndImages`,
    products: [],
    categoryArray: [...productCategories],
    categoriesSelected: [],

    sCatsCollapseExpand: [],
    sCatsCollapseHeaderExpand: [],
    sliderContainer: "sliderContainer",

    loadingClass: 'loadingAnim',
    vendorPublicUrl: 'hide',
    mainClass: 'mainClass hide',

    showAllContainer: "hide"

  };

  componentDidMount = async () => {
    const { vendorProductsData } = this.props;

    // console.log(vendorProductsData)

    let companyDescriptionLine1 = vendorProductsData.companyDescriptionLine1 ? vendorProductsData.companyDescriptionLine1 : ""
    let companyDescriptionLine2 = vendorProductsData.companyDescriptionLine2 ? vendorProductsData.companyDescriptionLine2 : ""

    this.setState({
      loadingClass: 'loadingAnim  hide',
      mainClass: 'mainClass',
      city: vendorProductsData.address.city,
      companyDescription: companyDescriptionLine1 + " " + companyDescriptionLine2,
      companyName: vendorProductsData.companyName,
      companyProfilePicture: vendorProductsData.companyProfilePicture,
      experience: vendorProductsData.experience.years,
      products: vendorProductsData.products,
      state: vendorProductsData.address.state,
      profilePicture: vendorProductsData.profilePicture
    })

  };

  // componentDidUpdate(prevProps, prevState) {
  //   console.log(this.state.sCatsCollapseExpand)
  // }

  reArrangeProductsData = () => {

    let rawProductsArray = [...this.state.products],
      categoryId,
      subCategoryId

    let refinedArray = rawProductsArray.reduce((all, product, i) => {

      let subCategoriesArray = [],
        categoryDoesntExist = true,
        categoryName;

      categoryId = product.productId.split("-")[0];
      subCategoryId = product.productId.split("-")[0] + "-" + product.productId.split("-")[1];

      this.state.categoryArray.map(categoryObj => {
        if (categoryObj.categoryId === categoryId)
          categoryName = categoryObj.categoryName
      });

      all.map((previousProduct, j) => {

        let subCategoryDoesntExist = true

        if (previousProduct.categoryId === categoryId) {
          categoryDoesntExist = false

          previousProduct.subCategories.map((subCat, k) => {
            if (subCat.subCategoryId === subCategoryId) {
              subCategoryDoesntExist = false

              subCat.products.push({
                productTitle: product.productName,
                productImage: product.thumb,
                productId: product.productId
              })
            }
          })

          if (subCategoryDoesntExist) {
            previousProduct.subCategories.push({
              subCategoryName: product.subCategoryName,
              subCategoryId,
              products: [{
                productTitle: product.productName,
                productImage: product.thumb,
                productId: product.productId
              }]
            })
          }

        }
      });

      // -----------------
      // Only do the following if category is not already
      // added

      if (categoryDoesntExist) {
        all.push({
          categoryId,
          categoryName,
          subCategories: [{
            subCategoryName: product.subCategoryName,
            subCategoryId,
            products: [{
              productTitle: product.productName,
              productImage: product.thumb,
              productId: product.productId
            }]
          }]
        })
      }

      return all
    }, [])

    return refinedArray;
  };

  hideProductMainTypes = (index) => {
    const tl = new TimelineMax()

    tl
      .to(".sc" + index, 0.1, { opacity: 0 })
      .set(".sc" + index, { display: "none" })

    let dummyArray = [...this.state.sCatsCollapseHeaderExpand]

    if (!dummyArray.includes("sc" + index)) {
      dummyArray.push("sc" + index)
    }

    this.setState({
      sCatsCollapseHeaderExpand: dummyArray
    })
  };

  showProductMainTypes = (index) => {
    const tl = new TimelineMax()

    tl
      .set(".sc" + index, { display: "flex" })
      .to(".sc" + index, 0.1, { opacity: 1 })


    let dummyArray = [...this.state.sCatsCollapseHeaderExpand]

    dummyArray.splice(dummyArray.indexOf("sc" + index), 1)

    this.setState({
      sCatsCollapseHeaderExpand: dummyArray
    })
  }

  returnRelevantMainIconBox = (index) => {
    let collapseOrExpandIcon = "collapseActive"

    this.state.sCatsCollapseHeaderExpand.map((item, i) => {
      if ("sc" + index === item) {
        collapseOrExpandIcon = "expandActive"
      }
    })

    if (collapseOrExpandIcon === "collapseActive")
      return (
        <div
          className="iconBox"
          onClick={() => {
            this.hideProductMainTypes(index)
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
            this.showProductMainTypes(index)
          }}
        >
          <PlusIcon />
        </div>
      )
  };

  hideProductTypes = async (index) => {
    const tl = new TimelineMax()

    tl
      .to(".sCat" + index, 0.1, { opacity: 0 })
      .set(".sCat" + index, { display: "none" })

    let dummyArray = [...this.state.sCatsCollapseExpand]

    if (!dummyArray.includes("sCat" + index)) {
      dummyArray.push("sCat" + index)
    }

    await this.setState({
      sCatsCollapseExpand: dummyArray
    })


    // console.log(this.state.sCatsCollapseExpand)
  };

  showProductTypes = (index) => {
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

      // console.log("sCat" + index === item)

      if ("sCat" + index === item) {
        collapseOrExpandIcon = "expandActive"
      }
    })

    if (collapseOrExpandIcon === "collapseActive")
      return (
        <div
          className="iconBox"
          onClick={() => {
            this.hideProductTypes(index)
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
            this.showProductTypes(index)
          }}
        >
          <PlusIcon />
        </div>
      )
  };

  returnHeader = () => {
    let categoryArray = this.reArrangeProductsData();

    return categoryArray.map((item, i) => {
      return item.subCategories.map((item, j) => {
        if (item.subCategoryId === this.state.subCatId) {
          return (
            <h3
              key={j}
            >
              {item.subCategoryName}
            </h3>
          )
        }
      })
    })

  }


  returnCategoryInModal = () => {
    let categoryArray = this.reArrangeProductsData();


    return categoryArray.map((cat, i) => {
      return cat.subCategories.map((subCat, j) => {
        if (subCat.subCategoryId === this.state.subCatId) {
          return subCat.products.map((item, k) => {
            // console.log(item)
            return (
              <a 
                href={`/product-detail/${convertToKebabCase(handleCategoryName(item.productId.split("-")[0]).categoryName)}/${convertToKebabCase(subCat.subCategoryName)}/${convertToKebabCase(subCat.subCategoryName)}/${alterFetchId(item.productId)}`}
                >
                <div
                  key={k}
                  className="productImagesAndTitle">
                  <div className="productImagesAndTitleInnerLayer">
                    <Image
                      cloudName="rolling-logs"
                      alt={item.productTitle}
                      publicId={PublicId(item.productImage)}
                      width={180}
                      height={120}
                      crop="lpad"
                      secure="true"
                    />
                    <p>{item.productTitle}</p>
                  </div>
                </div>
              </a>
            )
          })
        }
      })
    })
  }

  showAllCategories = () => {
    return (
      <div
        className={this.state.showAllContainer}>
        <div className="showAllContainerInnerWrap">
          <div className="closeModalButton"
            onClick={() => {
              this.setState({
                showAllContainer: "hide"
              })
            }}
          >
            <ModalCloseButton />
          </div>
          <div className="modalContainerOuterWrap">
            <div className="modalContainerInnerWrap">
              <div className="modalHeaderClass">
                {/* <h3>Uploaded products</h3> */}
                {this.returnHeader()}
                <div className="line"></div>
              </div>
              <div className="uploadedProductsContainer">
                <div className="uploadedProductsInnerContainer">
                  {this.returnCategoryInModal()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  returnCategoriesData = () => {
    let categoryArray = this.reArrangeProductsData();
    // console.log(categoryArray)

    return categoryArray.map((item, i) => {

      const returnSubCategoriesInItem = () => {
        return item.subCategories.map((subCat, j) => {

          let imagesObject = {
            categoryName: subCat.subCategoryName,
            imagesInCategory: [...subCat.products.map((productInfo, k) => {

              return {
                itemCode: "WB12",
                textOnRibbonSatisfied: false,
                imageURL: productInfo.productImage,
                title: productInfo.productTitle, //- optional

                hrefLink: `/product-detail/${convertToKebabCase(handleCategoryName(productInfo.productId.split("-")[0]).categoryName)}/${convertToKebabCase(subCat.subCategoryName)}/${convertToKebabCase(subCat.subCategoryName)}/${alterFetchId(productInfo.productId)}`
              }
            })]
          }

          return (
            <div
              className={this.state.subCategoryHeaderAndImages + " " + ""}
              key={i + "" + j}
            >
              <div className="subCategoryHeader">
                <p>{subCat.subCategoryName}</p>
                {/* {this.returnRelevantIconBox(i + "pt" + j)} */}
                {/* {this.returnRelevantIconBox(j)} */}
                <div
                  className="expandButtonContainerTwo"
                  onClick={() => {
                    this.setState({
                      showAllContainer: "showAllContainer",
                      subCatId: subCat.subCategoryId
                    })
                  }}
                >
                  <p>Show All</p>
                </div>
              </div>
              <div
                className={this.state.sliderContainer + " sCat" + j}
                key={j}
              >
                <HtmlSlider
                  uniqueClassName={"trending-products-" + i + j}
                  imageWidth={180}
                  categoryData={imagesObject} // format of Item
                  textOnRibbon={""} // All caps
                // runFunction={(data) => {
                //     this.fetchProductData(data.itemCode)
                //     this.setState({
                //         modalClass: 'modalClass',
                //         productManagerWrapperClass: "productManagerWrapperClass blurClass",
                //         activeModalType: "subCategoryDetailedPreview",
                //         itemCode: data.itemCode
                //     })
                // }}
                />
              </div>
            </div>

          )
        })
      }

      return (
        <div
          className="categoryDataContainer"
          key={i}
        >
          <div className="categoryDataHeader">
            <div className="headerExpansionContainer">
              <h3>{item.categoryName}</h3>
              {this.returnRelevantMainIconBox(i)}
            </div>
            <div className="line"></div>
          </div>


          <div className={"subCategoriesWrapper " + "sc" + i}>
            {returnSubCategoriesInItem()}
          </div>

        </div>
      )
    })
  };

  returnSEOContent = () => {
    const { vendorProductsData, vId, vName } = this.props

    // console.log(vendorProductsData)

    const vendorName = vName.split("").map((item, i) => {
      if(item === "-")
      return " "

      else 
      return item
    }).join("")

    let companyDescriptionLine1 = vendorProductsData.companyDescriptionLine1 ? vendorProductsData.companyDescriptionLine1 : ""
    let companyDescriptionLine2 = vendorProductsData.companyDescriptionLine2 ? vendorProductsData.companyDescriptionLine2 : ""

    return (
      <Head>
          <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
          <link rel="canonical" href={`https://rollinglogs.com/vendor/${vName}/${vId}`} />

          <title>{`${vendorProductsData.companyName} vendor profile, ${vendorProductsData.address.city}, ${vendorProductsData.address.state} at RollingLogs.com`}</title>
          <meta name="description" content={`${companyDescriptionLine1} ${companyDescriptionLine2}`.split("").filter((item, i) => i<155).join("")}/>
          <meta 
              name="keywords" 
              content= {`${vendorName}, ${vendorProductsData.companyName}, ${vendorProductsData.companyName} products, ${vendorProductsData.companyName} products online India, ${vendorProductsData.companyName} at ${vendorProductsData.address.city} ${vendorProductsData.address.state} India, ${vendorName}, ${vendorName} at ${vendorProductsData.address.city} ${vendorProductsData.address.state}`}
          />
          
          <meta property="og:type" content="website" />
          <meta property="og:locale" content="en_US" />
          <meta property="og:title" content={`${vendorProductsData.companyName} vendor profile, ${vendorProductsData.address.city}, ${vendorProductsData.address.state} at RollingLogs.com`}/>
          <meta property="og:site_name" content="RollingLogs" />
          <meta property="og:url" content={`https://rollinglogs.com/vendor/${vName}/${vId}`} />
          <meta property="og:image:type" content="image/jpeg" />
          <meta property="og:image" content={vendorProductsData.companyProfilePicture} />
          <meta property="og:image:alt" content={vendorProductsData.companyName} />
          <meta property="og:description" content={`${companyDescriptionLine1} ${companyDescriptionLine2}`.split("").filter((item, i) => i<155).join("")} />

          <meta name="twitter:title" content={`${vendorProductsData.companyName} vendor profile, ${vendorProductsData.address.city}, ${vendorProductsData.address.state} at RollingLogs.com`}  />
          <meta name="twitter:url" content={`https://rollinglogs.com/vendor/${vName}/${vId}`} />
          <meta name="twitter:site" content="@Rollinglogs" />
          <meta name="twitter:description" content={`${companyDescriptionLine1} ${companyDescriptionLine2}`.split("").filter((item, i) => i<155).join("")} />
          <meta name="twitter:image" content={vendorProductsData.companyProfilePicture} />
          <meta name="twitter:image:alt" content={vendorProductsData.companyName} />
          <meta name="twitter:card" content="CARD_TYPE" />



      </Head>
    )


  }

  render() {

    // console.log(this.state.profilePicture)
    return (
      <div className="vendorPublicUrlOuterWrap">

        {this.returnSEOContent()}

        <div className={this.state.loadingClass}>
          <LogoAnimation text="Bringing back the Art in Architecture." />
        </div>
        <div className={this.state.mainClass}>
          <div className="vendorPublicUrl">
            <section className="vendorProfileDetails">
              <div className="vendorProfileDetailsInnerLayer">
              
                
                <div className="vendorInfoContainer">
                  <div className="vendorImageCategory">
                    <div className="vendorImageContainerInnerLayer">
                      {/* <img
                          src={this.state.companyProfilePicture}
                          alt=""
                          // style={{ height: "75px", width: "75px" }}
                        /> */}

                      {
                        this.state.companyProfilePicture
                          ?
                          <Image
                            cloudName="rolling-logs"
                            alt={this.state.companyName ? this.state.companyName : "vendor-profile-pic"}
                            publicId={PublicId(this.state.companyProfilePicture)}
                            width={100}
                            height={100}
                            crop="fit"
                            secure="true"
                          />
                          :
                          <div></div>
                      }

                    </div>
                  </div>

                  <div className="companyHeaderSection">
                      <h1>
                        {this.state.companyName}
                      </h1>
                      <div className="line"></div>
                    </div>
                </div>
                <div className="vendorInfoContainer">
                  <div className="vendorCompanyDescriptionCategory">
                    
                    <p>
                      {this.state.companyDescription}
                    </p>
                    <div className="vendorCompanyLocation">
                      <div className="locationIconContainer">
                        <LocationIcon />
                      </div>
                      <h3>{this.state.city}, {this.state.state}</h3>
                      <div className="iconCategoryContainer">
                        <IndianIcon />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="vendorInfoContainer">
                  <div className="vendorpersonalDescription">
                    <div className="headerContainer">
                      <h3>Propreitor</h3>
                      <div className="line"></div>
                    </div>
                    <div className="vendorDetails">
                      <div className="vendorProfilePic">
                        <div className="vendorProfilePicInnerLayer">
                          <img src={this.state.profilePicture} alt={this.state.companyName ? this.state.companyName : "vendor-profile-pic"}/>
                          
                        </div>
                      </div>
                      <div className="vendorNameContainer">
                        <h3>
                          {
                            this.props.vName.split("-")[0].charAt(0).toUpperCase() + this.props.vName.split("-")[0].slice(1) +
                            " " +
                            this.props.vName.split("-")[1].charAt(0).toUpperCase() + this.props.vName.split("-")[1].slice(1)
                          }
                        </h3>
                        <p>Has been for {this.state.experience} years in this industry</p>
                      </div>
                    </div>
                  </div>
                </div>
                          
                
              
              </div>
              {/* <div className="addthis_inline_share_toolbox"></div> */}
              {/* <!-- Go to www.addthis.com/dashboard to customize your tools --> */}
              <script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-5cbaabb8590da7f1"></script>
            </section>

            <div className="lineSection">
              {/* <div className="line"></div> */}
            </div>

            <section className="vendorProfileProducts">
              <div className="vendorProfileProductsInnerLayer">
                <div className="vendorProfileProductsInnerLayerContainer">
                  {this.returnCategoriesData()}
                </div>
              </div>
            </section>
          </div>
        </div>
        <NewFooter />
        {this.showAllCategories()}
      </div>
    );
  };
};

const mapStateToProps = state => {
  return {
    userData: state.userData,
    responseData: state.responseDataFromAPI
  };
};

export default connect(mapStateToProps, { hitApi })(VendorSharedLink);
