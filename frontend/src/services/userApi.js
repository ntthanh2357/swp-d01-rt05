import { axiosInstance } from "./api";

export const userManage = async (data) => {
    return await axiosInstance.post("/users/user-manage", data);
}

export const getRegistrationStats = async (data) => {
    return await axiosInstance.post("/users/registration-stats", data);
}

export const sendUpdateUserProfileOtp = async (data) => {
    return await axiosInstance.post("/users/send-otp", data);
}

export const verifyUpdateUserProfileOtp = async (data) => {
    return await axiosInstance.post("/users/verify-otp", data);
}

export const userProfileUpdate = async (data) => {
    return await axiosInstance.post("/users/update-user-profile", data);
}