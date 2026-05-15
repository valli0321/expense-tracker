import { useEffect, useState } from "react";

import { apiGet, apiPost } from "../utils/apiUtils";
import { API_PATHS } from "../utils/apiPath";
import { UserContext } from "./UserContext";

const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const updateUser = (userData) => {
        setUser(userData);
    };

    const clearUser = () => {
        setUser(null);
    };

    const getUser = async() => {
        setLoading(true)
        try {      
            const response = await apiGet(API_PATHS.AUTH.GET_USER_INFO);
            updateUser(response);
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false);
        }
    };

    const logoutUser = async() => {
        try {
            const res = await apiPost(API_PATHS.AUTH.LOGOUT);
            clearUser();
        } catch (error) {
            throw error;
        }
    }

    useEffect(() => {
        getUser();
    }, [])

    return (
        <UserContext.Provider value = {{ user, updateUser, clearUser, getUser, loading, logoutUser}}>
            {children}
        </UserContext.Provider>
    )
};

export default UserProvider