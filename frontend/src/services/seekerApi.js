import { axiosInstance } from "./api";

export const seekerProfile = async (data) => {
    return await axiosInstance.post("/seeker/profile", data);
}

export const sendUpdateSeekerProfileOtp = async (data) => {
    return await axiosInstance.post("/seeker/send-otp", data);
}

export const verifyUpdateSeekerProfileOtp = async (data) => {
    return await axiosInstance.post("/seeker/verify-otp", data);
}

export const seekerProfileUpdate = async (data) => {
    return await axiosInstance.post("/seeker/update-seeker-profile", data);
}

export const seekerProfileDelete = async (data) => {
    return await axiosInstance.delete("/seeker/profile", { data });
}