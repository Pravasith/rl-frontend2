import { useContext, useEffect, useState } from 'react';
import Axios from "axios";

import { api } from "../../actions/apiLinks";

import { ModalCloseButton, PaymentSuccessIcon } from "../../assets/images/index";

import sumProperty from '../../factories/sumProperty';
import { encryptData, decryptData } from '../../factories/encryptDecrypt';
import { CartDataContext, ModalContext } from '../../../utils/context/context';
import { setCookieData } from '../../factories/setCookieData';
import { WhiteButton } from '../UX/uxComponents';

const Payment = () => {
  const [ cartData, setCartData ] = useState(null);
  const [ authCredentials, setAuthCredentials ] = useState(null);
  const [ deliveryAddress, setDeliveryAddress ] = useState(null);
  const [ paymentData, setPaymentData ] = useState(null);

  const [ paymentModal, setPaymentModal] = useState("payment-modal hide")

  const cartContext = useContext(CartDataContext);
  const modalContext = useContext(ModalContext);

  useEffect(() => {
    handleAuthData()
    handleCartData()
  }, [cartContext.valeGlobalState])

  useEffect(() => {
    if(paymentData) {
      if (paymentData.status === "captured") {
  
        let dataToSendBackend = { 
            requestData: encryptData({
              address: deliveryAddress,
              cartItems: cartData, 
              paymentData: {
                amount: paymentData.amount,
                paymentId: paymentData.id
              }
            }) 
        }
  
        Axios.post(
          api.CREATE_NEW_ORDER, 
          dataToSendBackend,
          {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                "Content-Type": "application/json"
            },
  
            withCredentials: true
        })
          .then(res => {
            // let decryptedData = decryptData(res.data.responseData)
  
            // console.log(decryptedData);
  
            Axios.delete(
              api.DELETE_CART_DATA,
              {
                headers: {
                    'accept': 'application/json',
                    'Accept-Language': 'en-US,en;q=0.8',
                    "Content-Type": "application/json"
                },
  
                withCredentials: true
              }
            )
  
            setCookieData(encryptData({ cartData: [] }))
            setPaymentModal("payment-modal")
          })
          .catch(err => console.log(err))
      }
    }
  }, [paymentData])

  useEffect(() => {
    setDeliveryAddress(modalContext.valueGlobalState.address)
    // setRollingLogsId(modalContext.valueGlobalState.address.rLId)
  }, [modalContext.valueGlobalState])

  // Payment response status
  // created: Payment is created when the customer fills up and submits the payment information and it is sent to the Razorpay API. No processing has been done on the payment at this stage.
  // authorized: An authorization is performed when customer's payment details are successfully authenticated by the bank. The money is deducted from the customer’s account, but will not be transferred to your account until the funds are captured.
  // captured: The authorized payment is verified as complete by Razorpay. After capture, the amount is transferred to your account as per the settlement schedule. The captured amount must be same as authorized amount. Any authorization not followed by a capture within 5 days is automatically voided and the amount is refunded to the customer.
  // refunded: A successfully captured payment should be refunded by you and the amount is transferred back to the customer's bank account.
  // failed: Any unsuccessful transaction is marked as failed and you might have to retry the operation till you succeed.

  const handleCartData = () => {
    let cartData = cartContext.valeGlobalState;
    let cartLength = Object.keys(cartData).length;
    let newCartData = [], c = 0;
  
    while (c < cartLength){
      newCartData.push(cartData[c])
      c++
    };

    setCartData(newCartData);
  };

  const handleAuthData = () => {
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

          let { emailId, firstName, lastName } = responseData;

          setAuthCredentials({
            name: `${firstName} ${lastName}`,
            emailId
          })
      })
      .catch(e => console.error(e))
  };

  const openCheckout = (e) => {

    if (cartContext.valeGlobalState) {
      let handleTotalCost = () => {

        if (cartData) {
          // Round upto two decimals 
          // console.log(Math.round(Number(sumProperty(cartData, "totalPriceInclGST") * 100)* 100) / 100);

          return (Math.round(Number(sumProperty(cartData, "totalPriceInclGST") * 100)* 100) / 100)
        }
      };
  
      let handlePrefills = () => {
        if (authCredentials) {
          return {
            "name": authCredentials.name,
            "email": authCredentials.emailId
          }
        }
      };
      
      let backgroundVerification = (res) => {
  
        let encryptedData = encryptData({
            tId: res.razorpay_payment_id,
            amount: handleTotalCost()
        })
  
        let requestData = {
          requestData: encryptedData,
          message: "suspect captured, check for conviction"
        }
  
        Axios.post(
          api.VERIFY_PAYMENT, 
          requestData,
          {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                "Content-Type": "application/json",
            },
            withCredentials: true
        })
          .then(res => {
            let responseData = decryptData(res.data.responseData);
  
            if(responseData.response) setPaymentData(responseData.response)
          })
          .catch(err => console.log(err))
      };
  
      let options = {
        "key": "rzp_test_81FPTsR6b3iPcH",
        "amount": handleTotalCost(), // 2000 paise = INR 20, amount in paisa
        "name": "Rolling Logs",
        "description": "Purchase Description",
        "image": "https://rolling-logs.s3.ap-south-1.amazonaws.com/app-data/backgrounds/rl.png",
        "handler": function(response) { backgroundVerification(response) },
        "prefill": handlePrefills(),
        "theme": {
          "color": "#F37254"
        },
        "modal": {
          "ondismiss": function(){
            modalContext.loginSignUpOrPaymentModal("close")
          }
        },
        // callback_url: 'http://localhost:3000/orders',
        // redirect: true
      };
        
      let rzp = new Razorpay(options);
      rzp.open();
    }
  };

  const returnPaymentModal = () => {
    return(
      <div className="payment-modal-inner-layer">
        <div className="payment-success-message">
            <PaymentSuccessIcon/>
            <div className="success-screen-button-container">
              <h3>Your order has been successfully placed</h3>
              <a 
                href="/my-orders"
              >
                <div className="button-container">
                  <WhiteButton>
                    My order
                  </WhiteButton>
                </div>
              </a>
            </div>
            <div 
              className="closeButton"
              onClick={() => {
                setPaymentModal("payment-modal hide")
              }}
            >
                <ModalCloseButton/>
            </div>
        </div>
      </div>
    )
  };

  return (
    <div>
      { paymentData ? null: openCheckout() }
      <div className={paymentModal}>
        {returnPaymentModal()}
      </div>
    </div>
  )
};

export default Payment;