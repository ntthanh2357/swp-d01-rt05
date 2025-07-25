import { axiosInstance } from "./api";

export const adminProfile = async (data) => {
    return await axiosInstance.post("/admin/profile", data);
}

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

export const banUser = async (data) => {
    try {
        const response = await axiosInstance.post("/users/ban-user", data);
        return response;
    } catch (error) {
        console.error("Error in banUser API:", error);
        throw error;
    }
}

// Hàm mở khóa người dùng
export const unbanUser = async (data) => {
    try {
        const response = await axiosInstance.post("/users/unban-user", data);
        return response;
    } catch (error) {
        console.error("Error in unbanUser API:", error);
        throw error;
    }
};