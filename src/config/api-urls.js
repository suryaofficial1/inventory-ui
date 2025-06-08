 export const domain = 'https://inventory.supraindustries.in';
//  export const domain = 'http://localhost:5001';

export const LOGIN = `${domain}/auth/login`;
export const SEND_OTP = `${domain}/auth/send-otp`;
export const VERIFY_OTP = `${domain}/auth/verify-otp`;
export const GET_USER_BY_ID = (id) => `${domain}/auth/user/${id}`;
export const UPDATE_USER_BY_ID = (id) => `${domain}/auth/update/${id}`;
export const UPDATE_PASSWORD_BY_ID = (id) => `${domain}/auth/password/${id}`;

export const USER_LIST = `${domain}/admin/users`;
export const DELETE_USER = (id) => `${domain}/admin/${id}/user`;
export const DEPARTMENT_LIST = `${domain}/admin/departments`;
export const ROLE_LIST = `${domain}/admin/roles`;
export const ADD_USER = `${domain}/admin/create-user`;
export const UPDATE_USER = (id) => `${domain}/admin/${id}/user`;


export const SUPPLIER_LIST = `${domain}/supplier/suppliers`;
export const ADD_SUPPLIER = `${domain}/supplier/supplier`;
export const UPDATE_SUPPLIER = (id) => `${domain}/supplier/supplier/${id}`;
export const DELETE_SUPPLIER = (id) => `${domain}/supplier/supplier/${id}`;

export const PRODUCT_LIST = `${domain}/product/products`;
export const ADD_PRODUCT = `${domain}/product/product`;
export const UPDATE_PRODUCT = (id) => `${domain}/product/product/${id}`;
export const DELETE_PRODUCT = (id) => `${domain}/product/product/${id}`;

export const CUSTOMER_LIST = `${domain}/customer/customers`;
export const ADD_CUSTOMER = `${domain}/customer/customer`;
export const UPDATE_CUSTOMER = (id) => `${domain}/customer/customer/${id}`;
export const DELETE_CUSTOMER = (id) => `${domain}/customer/customer/${id}`;

export const SALES_LIST = `${domain}/sales/sales-list`;
export const CUSTOMERS = `${domain}/sales/customers`;
export const PRODUCTS = `${domain}/sales/products`;
export const ADD_SALES_DETAILS = `${domain}/sales/sales`;
export const UPDATE_SALES_DETAILS = (id) => `${domain}/sales/sales/${id}`;
export const DELETE_SALES = (id) => `${domain}/sales/sales/${id}`;

// Sales Return API 

export const SALES_RETURN_LIST_BY_INVOICE_NO = `${domain}/sales/return-list-by-invoice`;
export const SALES_RETURN_LIST = `${domain}/sales/return-list`;
export const ADD_RETURN_SALES_DETAILS = `${domain}/sales/upsert/return`;
export const UPDATE_RETURN_SALES_DETAILS = (id) => `${domain}/sales/upsert/return/${id}`;
export const DELETE_RETURN_SALES = (id) => `${domain}/sales/return/${id}`;
export const SALES_ITEM_AVAILABLE_QTY = (id) => `${domain}/sales/${id}/product/availability`;
export const SALES_DETAIL_BY_PRODUCT_ID = (id, cId, type) => `${domain}/sales/product/${id}/${cId}/customer/${type}`;

export const PURCHASE_LIST = `${domain}/purchase/purchase-list`;
export const ADD_PURCHASE_DETAILS = `${domain}/purchase/purchase`;
export const UPDATE_PURCHASE_DETAILS = (id) => `${domain}/purchase/purchase/${id}`;
export const DELETE_PURCHASE = (id) => `${domain}/purchase/purchase/${id}`;

export const PURCHASE_DETAILS_BY_PRODUCT_ID = (id, sId, type) => `${domain}/purchase/${id}/product/${sId}/supplier/${type}`;
// Return API
export const PURCHASE_DETAILS_BY_PRODUCT = `${domain}/purchase/details`; //d


export const PURCHASE_LIST_BY_PRODUCT = `${domain}/purchase/list-by-product`;
export const PURCHASE_RETURN_LIST_BY_PRODUCTS = `${domain}/purchase/return-list-by-product`;
export const PURCHASE_RETURN_LIST = `${domain}/purchase/return-list`;
export const ADD_RETURN_PURCHASE_DETAILS = `${domain}/purchase/upsert/return`;
export const UPDATE_RETURN_PURCHASE_DETAILS = (id) => `${domain}/purchase/upsert/return/${id}`;
export const DELETE_RETURN_PURCHASE = (id) => `${domain}/purchase/return/${id}`;

export const CUSTOMERS_LIST = `${domain}/public/customers-list`;
export const SUPPLIERS_LIST = `${domain}/public/suppliers-list`;
export const PRODUCTS_LIST = (type) => `${domain}/public/products-list/${type}`; //d
export const PRODUCTION_PRODUCTS_LIST = `${domain}/public/production-products-list`;
export const PRODUCTION_PRODUCTS_LIST_BY_PRODUCT = `${domain}/public/production-products-details`;
export const SALES_PRODUCTS_LIST = `${domain}/public/sales-products-list`;
export const SALES_RETURN_PRODUCTS_LIST = `${domain}/public/sales-return-products-list`;
export const PURCHASE_PRODUCTS_LIST = `${domain}/public/purchase-products-list`;
export const AVAILABLE_PRODUCT_QTY = (id, by, type) => `${domain}/public/products/${id}/${by}/${type}`;
export const AVAILABLE_PURCHASE_PRODUCT_QTY = (id, sId) => `${domain}/material/${id}/product/${sId}/supplier`;

export const PRODUCTION_LIST = `${domain}/production/production-list`;
export const PRODUCTION_DETAIL_BY_ID = (id) => `${domain}/production/production-detail/${id}`;
export const PRODUCTION_DETAIL_BY_PRODUCT_ID = (id) => `${domain}/production/product/${id}`;
export const ADD_PRODUCTION_DETAILS = `${domain}/production/production`;
export const UPDATE_PRODUCTION_DETAILS = (id) => `${domain}/production/production/${id}`;
export const UPDATE_PRODUCTION_STATUS = (id) => `${domain}/production/${id}/status`;
export const DELETE_PRODUCTION = (id) => `${domain}/production/production/${id}`;

export const MATERIAL_LIST = (productionId) => `${domain}/material/material-list/${productionId}`;
export const ADD_MATERIAL_DETAILS = `${domain}/material/material`;
export const UPDATE_MATERIAL_DETAILS = (id) => `${domain}/material/material/${id}`;
export const USED_MATERIAL_DETAIL_BY_PRODUCT_ID = (productId, id) => `${domain}/material/product/${productId}/production/${id}`;
export const DELETE_MATERIAL = (id) => `${domain}/material/material/${id}`;

export const SALES_OVERVIEW = `${domain}/report/sales-overview`;
export const SALES_RETURN_OVERVIEW = `${domain}/report/sales-return-overview`;
export const PURCHASE_REPORT = `${domain}/report/purchase`;
export const PURCHASE_RETURN_REPORT = `${domain}/report/purchase-return`;
export const STOCK_REPORT = `${domain}/report/stock`;
export const PRODUCT_HISTORY = (id, type) => `${domain}/report/timeline/${id}/product/${type}`;

export const ALL_STATS_COUNT = `${domain}/public/all-stats-count`;
export const TOP_5_PRODUCTS = `${domain}/public/top-5-products`;
export const PRODUCTION_SUMMARY = `${domain}/public/production-summary`;


export const PRODUCT_NAME_BY_TYPE = `${domain}/public/product-name-by-type`;

