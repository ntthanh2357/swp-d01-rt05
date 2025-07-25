import React, { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { seekerProfile } from "../services/seekerApi";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        isLoggedIn: false,
        userId: null,
        name: null,
        role: null,
        accessToken: null,
        purchasedPackage: null,
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
                    purchasedPackage: null, // Will be loaded separately
                });
                
                // Nếu là seeker, load thông tin purchased package
                if (decoded.role === 'seeker') {
                    loadSeekerProfile(accessToken);
                }
            } catch {
                setUser({ isLoggedIn: false, userId: null, name: null, role: null, accessToken: null, purchasedPackage: null });
            }
        }
        // Đánh dấu là đã hoàn thành kiểm tra xác thực
        setIsCheckingAuth(false);
    }, []);

    const loadSeekerProfile = async (accessToken) => {
        try {
            const response = await seekerProfile({ token: accessToken });
            if (response.status === 200) {
                // Always update purchasedPackage, even if it's null
                setUser(prevUser => ({
                    ...prevUser,
                    purchasedPackage: response.data.purchased_package || null
                }));
                console.log("Loaded seeker profile, purchased_package:", response.data.purchased_package);
            }
        } catch (error) {
            console.error("Error loading seeker profile:", error);
        }
    };

    const login = (accessToken) => {
        localStorage.setItem("accessToken", accessToken);
        const decoded = jwtDecode(accessToken);
        setUser({
            isLoggedIn: true,
            userId: decoded.userId || null,
            name: decoded.name || null,
            role: decoded.role,
            accessToken,
            purchasedPackage: null, // Will be loaded separately if seeker
        });

        // Nếu là seeker, load thông tin purchased package
        if (decoded.role === 'seeker') {
            console.log("User is seeker, loading profile for purchased_package...");
            loadSeekerProfile(accessToken);
        } else {
            console.log("User is not seeker, role:", decoded.role);
        }
    };

    const updatePurchasedPackage = (packageId) => {
        setUser(prevUser => ({
            ...prevUser,
            purchasedPackage: packageId
        }));
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser({ isLoggedIn: false, userId: null, name: null, role: null, accessToken: null, purchasedPackage: null });
    };

    return (
        <UserContext.Provider value={{ user, login, logout, updatePurchasedPackage, isCheckingAuth }}>
            {children}
        </UserContext.Provider>
    );
}