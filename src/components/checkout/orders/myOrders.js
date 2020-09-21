import { useEffect, useState } from 'react';
import Axios from 'axios';

import { api } from '../../../actions/apiLinks';

import { CartTruck, LocationStroke, NewCartTruck } from '../../../assets/images';
import { decryptData, encryptData } from '../../../factories/encryptDecrypt';
import { WhiteButton } from '../../UX/uxComponents';
import GenericModal from '../../UX/genericModal';

import PublicId from "../../../factories/cloudinaryFactory";
import { Image } from "cloudinary-react";

import "../../../assets/css/checkout_details.css";
import CancelledOrders from './cancelledOrders';
import LogIn from '../../common/loginOrSignUp/logIn';
import SignUp from '../../common/loginOrSignUp/signUp';

const MyOrders = () => {

    const [ orders, setOrders ] = useState(null);
    const [ itemToCancel, setItemToCancel ] = useState(null);
    const [ modalType, setModalType ] = useState(null);

    const [ ordersToShow, setOrdersToShow ] = useState("Upcoming");

    const [upcomingButton, setUpComingButton] = useState("upcoming-orders-button-container bgd-color");
    const [ cancellationButton, setCancellationButton] = useState("cancelled-orders-button-container");
    const [ orderDoneButton, setOrderDoneButton ] = useState("completed-orders-button-container")
    const [ accessContainer, setAccessContainer ] = useState("Login");

    const [ isAuth, setIsAuth ] = useState(false);

    useEffect(() => {
        Axios.get(
            api.CHECK_FOR_AUTH,
            {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    "Content-Type": "application/json"
                },
    
                withCredentials: true
            }
        )
        .then(res => {
            let responseData = decryptData(res.data.responseData);
            
            if(!responseData.isAuthenticated) {
                setIsAuth(false)
            } 

            else {
                Axios.get(
                    api.GET_PLACED_ORDERS,
                    {
                        headers: {
                            'accept': 'application/json',
                            'Accept-Language': 'en-US,en;q=0.8',
                            "Content-Type": "application/json"
                        },
                
                        withCredentials: true
                    }
                )
                .then(res => {
                    let { orders, ordersExist } = decryptData(res.data.responseData);
        
                    if (ordersExist) setOrders(orders);
                    else setOrders(null);
                })
                .catch(err => console.log(err))

                
                setIsAuth(true)
            }
        })
        .catch(e => console.error(e))  

       
    }, []);

    const upcomingOrders = () => {

        if(orders) {
            return orders.map(order => {
                const { address, cartItems, paymentData } = order; 
    
                if (cartItems) {
                    return cartItems.map((item, i) => {
                        let { paymentId } = paymentData;

                        return(
                            <div 
                                key={i}
                                className="main-item-content-container"
                            >
                                <div className="order-container-inner-layer">
                                    <div className="product-image-info-container">
                                        <Image
                                            cloudName="rolling-logs"
                                            alt={item.productName}
                                            publicId={PublicId(item.productThumbImage)}
                                            width="70"
                                            height="75"
                                            crop="fit"
                                            secure="true"
                                        />
                                        <div className="product-name-container">
                                            <h3>{item.productName}</h3>
                                            <div className="product-quantity-container">
                                                <p>X</p>
                                                <h3>{item.quantity}</h3>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="line"></div>
                                    <div className="address-details-content-container">
                                        <div className="address-details-inner-container">
                                            <div className="price-info-container">
                                                <p>{item.totalPriceInclGST}<span>incl. GST</span></p>
                                                <div className="line"></div>
                                            </div>
                                            <div className="delivery-address-container">
                                                <div className="delivery-address">
                                                    <div className="location-stroke-container">
                                                        <LocationStroke />
                                                    </div>
                                                    <div className="delivery-address-container">
                                                        <h3>{address.name}</h3>
                                                        <p>{address.completeAddress}</p>
                                                        <p>Landmark: {address.landmark}</p>
                                                        <p>Contact No.: {address.mobileNumber}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="cancel-order-field-container">
                                                <div className="cancel-field">
                                                    <div onClick={() => {
                                                        setItemToCancel({ ...item, paymentId, address })
                                                        setModalType("cancelAlert")
                                                    }}>
                                                        <WhiteButton>
                                                            Cancel order*
                                                        </WhiteButton>
                                                    </div>

                                                    <p>* 5 % of order value will be charged</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )
                    })
                }
            })
        }
    };

    const handleCancelAPI = (paymentId, productId) => {

        let requestData = {
            requestData: encryptData({
                paymentId: paymentId,
                amount: ((itemToCancel.totalPriceInclGST * 95) / 100)
            }),
            message: "suspect for refund"
        }

        Axios.delete(
            `${api.CANCEL_PLACED_ORDER}?paymentId=${paymentId}&productId=${productId}`, 
            {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    "Content-Type": "application/json"
                },
    
                withCredentials: true
            }
        )
        .then(res => {

           if(res.status === 204) {
                Axios.post(
                    api.REFUND_PAYMENT,
                    requestData,
                    {
                        headers: {
                            'accept': 'application/json',
                            'Accept-Language': 'en-US,en;q=0.8',
                            "Content-Type": "application/json",
                        },
                        withCredentials: true
                    }
                )
                .then(res => {
                    let { response } = decryptData(res.data.responseData);

                    if(response) {

                        let dataToSendBackend = { 
                            requestData: encryptData({
                                cancelledOrderData: itemToCancel, 
                                refundData: {
                                    amount: response.amount,
                                    paymentId: response.payment_id,
                                    refundId: response.id
                                }
                            }) 
                        }

                        Axios.post(
                            api.CREATE_CANCELLED_PLACED_ORDER,
                            dataToSendBackend,
                            {
                                headers: {
                                    'accept': 'application/json',
                                    'Accept-Language': 'en-US,en;q=0.8',
                                    "Content-Type": "application/json"
                                },
                      
                                withCredentials: true
                            }
                        )
                        .then(res => console.log(res))
                        .catch(err => console.log(err))
                    }
                })
                .catch(err => {
                    console.log(err);
                })
           }

        })
        .catch(err => console.log(err))
        
    };

    const returnModal = () => {

        let returnModalContent = () => {
            if (modalType === "cancelAlert") {
                return (
                    <div className="orders-modal-outer-layer">
                        <div className="orders-modal-inner-layer">
                            <h3>Are you sure you want to cancel, {itemToCancel.productName}?</h3>

                            <div className="cancel-order-button-container">
                                <div className="go-back-button-container">
                                    <WhiteButton
                                        runFunction={() => {
                                            setModalType(null)
                                            setItemToCancel(null)
                                        }}
                                    >
                                        No, go back
                                    </WhiteButton>
                                </div>
                                <div className="cancel-button-container">
                                    <WhiteButton
                                        runFunction={() => {
                                            handleCancelAPI(itemToCancel.paymentId, itemToCancel.productId)
                                            setModalType("successfulCancellation")
                                        }}
                                    >
                                        Yes, cancel
                                    </WhiteButton>
                                </div>
                            </div>
                            <p>*3% of order value will be charged</p>
                        </div>
                    </div>
                )
            }

            else if (modalType === "successfulCancellation") {


                setTimeout(() => {
                    setModalType(null)
                    setItemToCancel(null)
                }, 5000)

                return (
                    <div className="cancelled-order-container">
                        <div className="cancelled-order-inner-container">
                            <h3>
                                Your order has been
                                cancelled successfully,
                                refund of Rs. {itemToCancel.totalPriceInclGST} will
                                be credited back to you in
                                15 days
                            </h3>
                            <div className="cancel-confirmation-button-container">
                                <WhiteButton
                                    runFunction={() => {
                                        setModalType(null)
                                        setItemToCancel(null)
                                    }}
                                >
                                    Okay, close 
                                </WhiteButton>
                            </div>
                        </div>
                    </div>
                )
            }
        } 

        if (itemToCancel) {
            return (
                <GenericModal
                    heading=""
                    // backgroundImage="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/logInBackground.png"
                    closeTheCheckoutModal={() => {
                        setItemToCancel(null)
                    }}
                >   
                    {returnModalContent()}
                </GenericModal>
            )
        }
    };

    const handleOrdersToShow = () => {
        if (ordersToShow === "Upcoming") return upcomingOrders();
        else if (ordersToShow === "Cancelled") return <CancelledOrders />
        else if (ordersToShow === "Completed") console.log("completed orders");
    };

    const thingsToShow = () => {

        let returnAccessContainer = () => {
            if(accessContainer === "Login"){
                return(
                    <div className="login-signup-container">
                        {/* <div className="login-img-container">
                            <img src="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/footer-image.png" alt=""/>
                        </div> */}
                        <div className="form-container">
                            <div className="login-page-inner-container">
                                <LogIn />
                            </div>
                            <div className="loginSignup-button-container">
                                <div
                                    className="loginSignup-button-inner-container"
                                    onClick={() => {
                                        setAccessContainer("Signup")
                                    }}
                                >
                                    <h3>New to Rollinglogs? Create an account</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            else{
                return(
                    <div className="login-signup-container">
                        {/* <div className="login-img-container">
                            <img src="https://s3.ap-south-1.amazonaws.com/rolling-logs/app-data/backgrounds/footer-image.png" alt="" />
                        </div> */}
                        <div className="form-container">
                            <div className="login-page-inner-container">
                                <SignUp />
                            </div>
                            <div className="loginSignup-button-container">
                                <div
                                    className="loginSignup-button-inner-container"
                                    onClick={() => {
                                        setAccessContainer("Login")
                                    }}
                                >
                                    <h3>Existing User? Log in</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        }

        if (isAuth) {
            return (
                <div className="switch-tabs-outer-container">
                    <div className="switch-tabs-inner-container">
                        <div className="header-container">
                            <div className="svg-container">
                                {/* <CartTruck /> */}
                                {/* <NewCartTruck/> */}
                            </div>
                            <h3>Your orders</h3>
                        </div>
                        <div className="switch-button-container">
                            <div
                                className={upcomingButton}
                                onClick={() => {
                                    setUpComingButton("upcoming-orders-button-container bgd-color")
                                    setCancellationButton("cancelled-orders-button-container")
                                    // setOrderDoneButton("completed-orders-button-container")
                                }}
                            >
                                <WhiteButton
                                    runFunction={() => {
                                        setOrdersToShow("Upcoming")
                                    }}
                                >
                                    Upcoming
                            </WhiteButton>
                            </div>
                            <div
                                className={cancellationButton}
                                onClick={() => {
                                    setCancellationButton("cancelled-orders-button-container bgd-color")
                                    setUpComingButton("upcoming-orders-button-container")
                                    // setOrderDoneButton("completed-orders-button-container")
                                }}
                            >
                                <WhiteButton
                                    runFunction={() => {
                                        setOrdersToShow("Cancelled")
                                    }}
                                >
                                    Cancelled
                            </WhiteButton>
                            </div>
                            {/* <div 
                            className={orderDoneButton}
                            onClick={() => {
                                setCancellationButton("cancelled-orders-button-container")
                                setUpComingButton("upcoming-orders-button-container")
                                setOrderDoneButton("completed-orders-button-container bgd-color")
                            }}
                        >
                            <WhiteButton
                                runFunction={() => {
                                    setOrdersToShow("Completed")
                                }}
                            >
                                Completed
                            </WhiteButton>
                        </div> */}
                        </div>
                    </div>
                </div> 
            )
        }

        else {
            return (
                <div className="order-page-login-container">
                    {returnAccessContainer()}
                </div>
            )
        }
    }

    return (
        <div className="order-details-main-container">
            <div className="order-details-inner-container">
                <div className="order-items-content-container">
                        {thingsToShow()}
                    <div className="order-items-content-inner-container">
                        {handleOrdersToShow()}
                    </div>
                </div>
                {returnModal()}
            </div>
        </div>
    )
};

export default MyOrders;