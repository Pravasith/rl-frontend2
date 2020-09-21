import { useEffect, useState } from 'react';
import Axios from 'axios';
import { api } from '../../../actions/apiLinks';
import PublicId from "../../../factories/cloudinaryFactory";
import { Image } from "cloudinary-react";
import { decryptData, encryptData } from '../../../factories/encryptDecrypt';
import { formatPricesToLocale } from '../../../factories/formatter';

const cancelledOrders = () => {

    const [ cancelledOrders, setCancelledOrders ] = useState(null);

    useEffect(() => {
        Axios.get(
            api.GET_CANCELLED_PLACED_ORDER,
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
            let decryptedData = decryptData(res.data.responseData);

            setCancelledOrders(decryptedData.cancelledOrders)
        })
        .catch(err => console.log(err))
    }, [])

    const handleRefundStatus = (id) => {

        let dataToSendBackend = {
            requestData: encryptData({ tId: id }),
            message: "suspect captured, check for conviction"
        }

        Axios.post(
            api.VERIFY_REFUND,
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
        .then(res => {
            let decryptedData = decryptData(res.data.responseData);

            // console.log(decryptedData);
        })
        .catch(err => console.log(err))
    }

    const dummy = () => {

        let handleColorOrFinish = (cancelledOrderData) => {
            if (cancelledOrderData.color) return <p>Color: <span>{cancelledOrderData.color.colorName}</span></p>;
            else if (cancelledOrderData.finish) return <p>Color: <span>{cancelledOrderData.finish.finishName}</span></p>;
        }

       if(cancelledOrders) {
           return cancelledOrders.map((item, i) => {
                let { cancelledOrderData, refundData } = item;
               return (
                   <div 
                        key={i}
                        className="cancelled-item-outer-container"
                    >   
                        <div className="cancelled-item-inner-container">
                            <div className="cancelled-item-info-container">
                                <div className="info-container-inner-container">
                                    <div className="img-container">
                                       <Image
                                           cloudName="rolling-logs"
                                           alt={cancelledOrderData.productName}
                                           publicId={PublicId(cancelledOrderData.productThumbImage)}
                                           width="70"
                                           height="75"
                                           crop="fit"
                                           secure="true"
                                       />
                                       <div className="info-container">
                                           <h3>{cancelledOrderData.productName}</h3>
                                           <p>Brand: <span>{cancelledOrderData.brandName}</span></p>
                                           {handleColorOrFinish(cancelledOrderData)}
                                           <p>Material: <span>{cancelledOrderData.productMaterial.materialName}</span></p>
                                       </div>
                                    </div>
                                    <div className="left-container">
                                       <div className="cancelled-item-price-container">
                                           <div className="item-price-inner-container">
                                               <p>Quantity: <span>{cancelledOrderData.quantity}</span> </p>
                                               <h3>₹ {cancelledOrderData.totalPriceInclGST}</h3>
                                           </div>
                                       </div>
                                       <div className="status-button-container">
                                           <div className="button-container">
                                               <h3>Cancelled</h3>
                                               <p>
                                                   As per request,the seller has cancelled this product in your order.Please
                                                   do not accept if delivery is attempted
                                               </p>
                                           </div>
                                       </div>
                                    </div>
                                    <div className="responsive-container">
                                        <div className="cancelled-button-container">
                                            <p>Cancelled</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="line"></div>
                            <div className="cancelled-item-price-container">
                                {/* <div className="item-price-inner-container">
                                   <h3>₹ {cancelledOrderData.totalPriceInclGST}</h3>
                                </div> */}
                            </div>                        
                            <div className="cancelled-item-refund-container">
                                <div className="refund-item-inner-layer">
                                    <div className="responsive-refund-amount">
                                        <div className="responsive-refund-amount-inner-container">
                                           <h3>₹ {cancelledOrderData.totalPriceInclGST}</h3>
                                           <p>Quantity: <span>{cancelledOrderData.quantity}</span> </p>
                                        </div>
                                    </div>
                                    <div className="refund-header">
                                       <h3>Refund Status</h3>
                                       <div className="line"></div>
                                    </div>
                                    <div className="status-container">
                                        <div className="status-id-container">
                                           {handleRefundStatus(refundData.paymentId)}
                                           <p>Refund amount: <span>₹ {formatPricesToLocale((refundData.amount) / 100)}</span></p>
                                           <p>Refund ID: <span>{refundData.refundId}</span></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                   </div>
               )
           })
       }
    }

    return(
        <div className="cancelled-item-container">
            {dummy()}
        </div>
    )
}

export default cancelledOrders;

{/* <Image
    cloudName="rolling-logs"
    alt={cancelledOrderData.productName}
    publicId={PublicId(cancelledOrderData.productThumbImage)}
    width="70"
    height="75"
    crop="fit"
    secure="true"
/> */}

{/* <p>Size: {cancelledOrderData.size.sizeName}</p> */ }