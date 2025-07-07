import { useContext, useEffect, useState } from "react";
import { LOCAL_STORAGE_EMAIL, LOCAL_STORAGE_TOKEN } from "../src/utils/CONSTANTS";
import { useNavigate } from "react-router";
import axios from "axios";
import { AppContext } from "../src/context/AppContext";

export const useAuth = (shouldRedirect) => {
    const { user, setUserInfo, removeUserInfo } = useContext(AppContext);
    const navigate = useNavigate();
    const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem(LOCAL_STORAGE_TOKEN));
    useEffect(() => {
        if (shouldRedirect && !isAuthenticated) {
            navigate('/login');
        }
        if (isAuthenticated && !user) {
            fetchUserInfo();
        }
    }, [isAuthenticated]);
    const fetchUserInfo = () => {
        axios.get('http://localhost:3000/auth/me', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem(LOCAL_STORAGE_TOKEN)}`
            }
        })
            .then((res) => {
                setUserInfo(res.data);
            }).catch((err) => {
                console.log(err);
            });
    }
    const logout = () => {
        localStorage.removeItem(LOCAL_STORAGE_TOKEN);
        setIsAuthenticated(false);
        navigate('/login');
        removeUserInfo();
    }
    const loginUser = (token, nombreUsuario,role) => {
        localStorage.setItem(LOCAL_STORAGE_TOKEN, token);
        localStorage.setItem(LOCAL_STORAGE_EMAIL, nombreUsuario);
        localStorage.setItem("role", role);
        setUserInfo({ nombreUsuario,role });
    }
    const getAuthUser = () => {
        const token = localStorage.getItem(LOCAL_STORAGE_TOKEN);
        const email = localStorage.getItem(LOCAL_STORAGE_EMAIL);
        const role = localStorage.getItem("role");
        return { token, email,role };
    }

    return { isAuthenticated, logout, loginUser, getAuthUser };
}