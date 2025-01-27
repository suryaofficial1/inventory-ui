export const domain = 'http://localhost:8082';

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
export const DELETE_PRODUCT = (id) => `${domain}/product/supplier/${id}`;

export const CUSTOMER_LIST = `${domain}/customer/customers`;
export const ADD_CUSTOMER = `${domain}/customer/customer`;
export const UPDATE_CUSTOMER = (id) => `${domain}/customer/customer/${id}`;
export const DELETE_CUSTOMER = (id) => `${domain}/customer/supplier/${id}`;

export const SALES_LIST = `${domain}/sales/sales-list`;
export const CUSTOMERS = `${domain}/sales/customers`;
export const PRODUCTS = `${domain}/sales/products`;
export const ADD_SALES_DETAILS = `${domain}/sales/sales`;
export const UPDATE_SALES_DETAILS = (id) => `${domain}/sales/sales/${id}`;
export const DELETE_SALES = (id) => `${domain}/sales/sales/${id}`;

export const PURCHASE_LIST = `${domain}/purchase/purchase-list`;
export const SUPPLIERS = `${domain}/purchase/suppliers`;
export const ADD_PURCHASE_DETAILS = `${domain}/purchase/purchase`;
export const UPDATE_PURCHASE_DETAILS = (id) => `${domain}/purchase/purchase/${id}`;
export const DELETE_PURCHASE = (id) => `${domain}/purchase/purchase/${id}`;

export const CUSTOMERS_LIST = `${domain}/public/customers-list`;
export const SUPPLIERS_LIST = `${domain}/public/suppliers-list`;
export const PRODUCTS_LIST = `${domain}/public/products-list`;
