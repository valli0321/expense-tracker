import axios from "axios";
import { axiosInstance } from "./axiosInstance";

function handleApiError(error){
    // Axios error response
    if(error.response) return error.response.data?.message || "Something went wrong";

    // No response from server
    if(error.request) return "Server not responding";

    return error.message || "Something went wrong";
}

export const apiGet = async(url, config = {}) => {
    try {
        const response = await axiosInstance.get(url, config);
        return response.data.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const apiPost = async(url, data = {}, config = {}) => {
    try {
        const isFormData = data instanceof FormData;

        const response = await axiosInstance.post(
            url,
            data, 
            {
                ...config,
                headers: {
                    ...(isFormData
                        ? {}
                        : {
                            "Content-Type": "application/json",
                        }
                    ),
                    ...config.headers,
                },
            }
        );
        return response.data.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const apiPut = async(url, data = {}, config = {}) => {
    try {
        const response = await axiosInstance.put(url, data, config);
        return response.data.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const apiPatch = async(url, data = {}, config = {}) => {
    try {
        const response = await axiosInstance.patch(url, data, config);
        return response.data.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const apiDelete = async(url, config = {}) => {
    try {
        const response = await axiosInstance.delete(url, config);
        return response.data.data;
    } catch (error) {
        throw handleApiError(error);
    }
};

export const apiDonwload = async(url, config = {}) => {
    try {
        const response = await axiosInstance.get(
            url,
            {
                ...config,
                responseType: "blob"
            }
        );
        return response.data.data;
    } catch (error) {
        throw handleApiError(error);
    }
}