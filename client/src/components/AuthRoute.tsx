import { Navigate, Outlet } from "react-router-dom";

function AuthRoute() {
    // NOTE: this doesn't actually verify jwt, that'll be done on the server while trying to load page details -Harley
    const webtoken = localStorage.getItem("jsonaccesstoken"); 
    return (
        webtoken ? <Outlet /> : <Navigate to="/login" /> 
    );
}

export default AuthRoute;