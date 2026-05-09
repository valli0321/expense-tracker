import axios from "axios";

export const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    },
    withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use((config) => {
    return config;
});

axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if(error.response){
            if(error.response.status === 401){
                // Redirect to login
                if (window.location.pathname !== "/login") {
                    window.location.href = "/login";
                }
            } else if (error.response.status === 500){
                console.log("Server error please try again later");
            } 
        } else if (error.code === "ECONNABORTED"){
            console.log("Request timeout. Please try again.")
        }

        return Promise.reject(error);
    }
);