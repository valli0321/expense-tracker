import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

import { UserContext } from "../context/UserContext";
import AuthLoader from "./AuthLoader";

const ProtectedRoute = () => {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return (
            <AuthLoader />
        );
    }

    return user ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoute;