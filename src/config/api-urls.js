 export const domain = 'https://inventory.supraindustries.in';
//export const domain = 'http://localhost:8082';

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

export const SALES_LIST_BY_INVOICE_NO = `${domain}/sales/list-by-invoice`;
export const SALES_RETURN_LIST_BY_INVOICE_NO = `${domain}/sales/return-list-by-invoice`;
export const SALES_RETURN_LIST = `${domain}/sales/return-list`;
export const ADD_RETURN_SALES_DETAILS = `${domain}/sales/upsert/return`;
export const UPDATE_RETURN_SALES_DETAILS = (id) => `${domain}/sales/upsert/return/${id}`;
export const DELETE_RETURN_SALES = (id) => `${domain}/sales/return/${id}`;

export const PURCHASE_LIST = `${domain}/purchase/purchase-list`;
export const ADD_PURCHASE_DETAILS = `${domain}/purchase/purchase`;
export const UPDATE_PURCHASE_DETAILS = (id) => `${domain}/purchase/purchase/${id}`;
export const DELETE_PURCHASE = (id) => `${domain}/purchase/purchase/${id}`;

// Return API
export const PURCHASE_LIST_BY_INVOICE_NO = `${domain}/purchase/list-by-invoice`;
export const PURCHASE_RETURN_LIST_BY_INVOICE_NO = `${domain}/purchase/return-list-by-invoice`;
export const PURCHASE_RETURN_LIST = `${domain}/purchase/return-list`;
export const ADD_RETURN_PURCHASE_DETAILS = `${domain}/purchase/upsert/return`;
export const UPDATE_RETURN_PURCHASE_DETAILS = (id) => `${domain}/purchase/upsert/return/${id}`;
export const DELETE_RETURN_PURCHASE = (id) => `${domain}/purchase/return/${id}`;

export const CUSTOMERS_LIST = `${domain}/public/customers-list`;
export const SUPPLIERS_LIST = `${domain}/public/suppliers-list`;
export const PRODUCTS_LIST = `${domain}/public/products-list`;

export const PRODUCTION_LIST = `${domain}/production/production-list`;
export const ADD_PRODUCTION_DETAILS = `${domain}/production/production`;
export const UPDATE_PRODUCTION_DETAILS = (id) => `${domain}/production/production/${id}`;
export const DELETE_PRODUCTION = (id) => `${domain}/production/production/${id}`;

export const MATERIYAL_LIST = `${domain}/material/material-list`;
export const ADD_MATERIYAL_DETAILS = `${domain}/material/material`;
export const UPDATE_MATERIYAL_DETAILS = (id) => `${domain}/material/material/${id}`;
export const DELETE_MATERIYAL = (id) => `${domain}/material/material/${id}`;


export const SALES_OVERVIEW = `${domain}/report/sales-overview`;
export const PURCHASE_REPORT = `${domain}/report/purchase`;
