export const API_PATHS = {
    AUTH: {
        LOGIN: "/v1/auth/login",
        GET_USER_INFO: "/v1/auth/get-user",
        REGISTER: "/v1/auth/register",
        LOGOUT: "/v1/auth/logout",
    },
    DASHBOARD: {
        GET_DATA: "/v1/dashboard",
    },
    CATEGORY: {
        ADD: "/v1/category/add-category",
        GET: "/v1/category/get-categories",
        UPDATE: (transactionId) => `/v1/category/${categoryId}`,
        DELETE: (transactionId) => `/v1/category/${categoryId}`,
    },
    TRANSACTION: {
        ADD: "/v1/transaction/add",
        GET: "/v1/transactionget-transactions",
        DOWNLOAD_EXCEL: "/v1/transaction/download-excel",
        DELETE: (transactionId) => `/v1/transaction/${transactionId}`,
        UPDATE: (transactionId) => `/v1/transaction/${transactionId}`,
        GET_TRANSACTION_BY_ID: (transactionId) => `/v1/transaction/${transactionId}`,
    },
    IMAGE: {
        UPLOAD_IMAGE: "/v1/auth/upload-image"
    }
};