import Axios from "axios";
import { api } from "../actions/apiLinks";

export const setCookieData = (data) => {
    return Axios.post(
        api.SET_DATA_AS_COOKIE,
        
        {
            requestData: data,
            message: "All units, one o in pursuit, calling back up, limb shots only!"
        },
        {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                "Content-Type": "application/json"
            },
    
            withCredentials: true,
        }
    )
}

export const getProductHierarchy = (data) => {
    return Axios.post(
        api.GET_PRODUCT_HIERARCHY,
        
        {
            requestData: data,
            message: "All units, one o in pursuit, calling back up, limb shots only!"
        },
        {
            headers: {
                'accept': 'application/json',
                'Accept-Language': 'en-US,en;q=0.8',
                "Content-Type": "application/json"
            },
    
            withCredentials: true,
        }
    )
}