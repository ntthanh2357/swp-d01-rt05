import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        isLoggedIn: false,
        userId: null,
        name: null,
        role: null,
        accessToken: null,
    });
    const [isCheckingAuth, setIsCheckingAuth] = useState(true);

    useEffect(() => {
        const accessToken = localStorage.getItem("accessToken");
        if (accessToken) {
            try {
                const decoded = jwtDecode(accessToken);
                setUser({
                    isLoggedIn: true,
                    userId: decoded.userId || null,
                    name: decoded.name || null,
                    role: decoded.role,
                    accessToken,
                });
            } catch {
                setUser({ isLoggedIn: false,  userId: null, name: null, role: null, accessToken: null });
            }
        }
        // Đánh dấu là đã hoàn thành kiểm tra xác thực
        setIsCheckingAuth(false);
    }, []);

    const login = (accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        const decoded = jwtDecode(accessToken);
        setUser({
            isLoggedIn: true,
            userId: decoded.userId || null,
            name: decoded.name || null,
            role: decoded.role,
            accessToken,
        });
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser({ isLoggedIn: false, userId: null, name: null, role: null, accessToken: null });
    };

    return (
        <UserContext.Provider value={{ user, login, logout, isCheckingAuth }}>
            {children}
        </UserContext.Provider>
    );
}