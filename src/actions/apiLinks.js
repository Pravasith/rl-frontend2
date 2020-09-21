let API_SOCKETS_URL,
    API_BASE_URL,
    API_ARCH_URL

if(process.env.NODE_ENV === "development"){
    API_SOCKETS_URL = 'ws://localhost:8000/nes'
    API_BASE_URL = 'http://localhost:8000/'
    API_ARCH_URL = 'http://localhost:5000/'
}

else if (process.env.NODE_ENV === "production"){
    API_SOCKETS_URL = 'wss://apirl.pravasdesign/nes'
    API_BASE_URL = 'https://apirl.pravasdesign.com/'
    API_ARCH_URL = 'https://api2rl.pravasdesign.com/'
}




const API_PATH = 'api/'
// const API_URL = API_BASE_URL + API_PATH

export const api = {
    CREATE_USER: API_ARCH_URL + API_PATH + 'user/create-user', // done
    GET_USER_DATA: API_ARCH_URL + API_PATH + 'user/get-user-data', // 

    USER_SIGN_OUT: API_ARCH_URL + API_PATH + 'user/user-sign-out',
    USER_LOGIN : API_ARCH_URL + API_PATH + 'user/login',

    // KNOCK_LINKEDIN_VENDOR: API_BASE_URL + 'knock/linkedin-vendor',
    // KNOCK_GOOGLE_VENDOR: API_BASE_URL + 'knock/google-vendor',

    KNOCK_LINKEDIN_COMMON_USER: API_ARCH_URL + 'knock/linkedin-common-user',
    KNOCK_GOOGLE_COMMON_USER: API_ARCH_URL + 'knock/google-common-user',
    
    REGISTER_LINKEDIN_USER: API_ARCH_URL + API_PATH + 'user/login-linkedin-user',
    REGISTER_GOOGLE_USER: API_ARCH_URL + API_PATH + 'user/login-google-user',

    // UPDATE_USER_TYPE: API_BASE_URL + API_PATH + 'user/update-user-type',
    // UPDATE_USER_DATA: API_BASE_URL + API_PATH + 'user/update-user-data',

    GET_ALL_PRODUCTS_DATA: API_BASE_URL + API_PATH + 'categories/get-all-products-data',
    GET_CATEGORISED_PRODUCTS_DATA: API_BASE_URL + API_PATH + 'categories/get-five-products-data',
    GET_DETAILED_PRODUCTS_DATA: API_BASE_URL + API_PATH + 'categories/get-product-data-no-auth',
    GET_10_MORE_PRODUCTS : API_BASE_URL + API_PATH + 'categories/get-ten-more-products',
    GET_PRODUCT_HIERARCHY: API_BASE_URL + API_PATH + 'categories/get-product-hierarchy',

    // GET_PUBLIC_VENDOR_DATA: API_BASE_URL + API_PATH + 'user/get-public-vendor-data',

    UPLOAD_IMAGE: API_ARCH_URL + API_PATH + 'common/upload-image',

    CHECK_FOR_AUTH: API_ARCH_URL + API_PATH + 'user/check-for-auth',

    UPDATE_TRENDING_30_PRODUCTS : API_BASE_URL + API_PATH + 'trending/top-30',

    TRENDING_20_PRODUCTS : API_BASE_URL + API_PATH + 'trending/top-20-in-category',

    VENDOR_AD_REQUEST : API_ARCH_URL + API_PATH + 'enquiry/new-vendor-ad-request', /// Ad display request
    ASK_FOR_PRODUCTS : API_ARCH_URL + API_PATH + 'enquiry/ask-for-products', // Ask for the products
    VENDOR_ONBOARD_REQUEST : API_ARCH_URL + API_PATH + 'enquiry/new-vendor-onboard',
    CUSTOM_DESIGN_ENQUIRY : API_ARCH_URL + API_PATH + 'enquiry/custom-design-enquiry',
    PRODUCT_QUOTE_REQUEST : API_ARCH_URL + API_PATH + 'enquiry/product-quote-request',

    DEEP_ANALYTICS : API_BASE_URL + API_PATH + 'trending/top-subcategories',
    TOP_OFFERS : API_BASE_URL + API_PATH + 'trending/top-offers',

    // GET_SUBCATEGORIES : API_BASE_URL + API_PATH + 'categories/get-sub-categories',
    // GET_PRODUCT_TYPES : API_BASE_URL + API_PATH + 'categories/get-product-types',
    GET_QUERIED_PRODUCTS : API_BASE_URL + API_PATH + 'products/get-products-data-of-query',

    SET_DATA_AS_COOKIE : API_ARCH_URL + API_PATH + 'checkout/cookie-store',
    GET_COOKIE_DATA : API_ARCH_URL + API_PATH + 'checkout/get-cookie-store',

    CREATE_NEWSLETTER_SUBSCRIBER: API_ARCH_URL + API_PATH + 'news-letter/create-subscriber',
    GET_COOKIE_DATA_NEWSLETTER: API_ARCH_URL + API_PATH + 'news-letter/get-cookie-store',

    VERIFY_PAYMENT: API_ARCH_URL + API_PATH + 'payments/payment-verification',
    VERIFY_REFUND: API_ARCH_URL + API_PATH + 'payments/refund-verification',
    REFUND_PAYMENT: API_ARCH_URL + API_PATH + 'payments/refund',

    CREATE_NEW_ADDRESS: API_ARCH_URL + API_PATH + 'saved-address/create-address',
    GET_SAVED_ADDRESS: API_ARCH_URL + API_PATH + 'saved-address/get-saved-address',
    REMOVE_ADDRESS: API_ARCH_URL + API_PATH + 'saved-address/remove-address',

    CREATE_NEW_ORDER: API_ARCH_URL + API_PATH + 'orders/new-order',
    GET_PLACED_ORDERS: API_ARCH_URL + API_PATH + 'orders/fetch-orders',
    CANCEL_PLACED_ORDER: API_ARCH_URL + API_PATH + 'orders/cancel-order',

    CREATE_CANCELLED_PLACED_ORDER: API_ARCH_URL + API_PATH + 'cancelled-placed-orders/new-order',
    GET_CANCELLED_PLACED_ORDER: API_ARCH_URL + API_PATH + 'cancelled-placed-orders/fetch-orders',

    ADD_ITEM_TO_CART: API_ARCH_URL + API_PATH + 'cart/add-new-item',
    GET_ITEMS_IN_CART: API_ARCH_URL + API_PATH + 'cart/fetch-items-in-cart',
    DELETE_CART_DATA: API_ARCH_URL + API_PATH + 'cart/remove-cart'
}