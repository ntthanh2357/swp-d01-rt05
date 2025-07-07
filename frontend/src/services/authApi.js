import { axiosInstance } from "./api";

export const sendOtp = async (data) => {
    return await axiosInstance.post("/auth/send-otp", data );
}

export const verifyOtp = async (data) => {
    return await axiosInstance.post("/auth/verify-otp", data);
}

export const register = async (data) => {
    return await axiosInstance.post("/auth/register", data);
};

export const createStaff = async (data) => {
    return await axiosInstance.post("/auth/create-staff", data);
}

export const createAdmin = async (data) => {
    return await axiosInstance.post("/auth/create-admin", data);
}

export const googleLogin = async (data) => {
    return await axiosInstance.post("/auth/google", data);
}

export const login = async (data) => {
    return await axiosInstance.post("/auth/login", data);
};

export const forgotPassword = async (data) => {
    return await axiosInstance.post("/auth/forgot-password", data);
}

export const resetPassword = async (data) => {
    return await axiosInstance.post("/auth/reset-password", data);
}

export const changePassword = async (data) => {
    const { token, ...body } = data;
    return await axiosInstance.post("/auth/change-password", body, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
};