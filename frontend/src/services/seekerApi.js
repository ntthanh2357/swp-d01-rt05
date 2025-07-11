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

export const getFavoriteScholarships = async (token) => {
    return await axiosInstance.post(
        "/seeker/favorite-scholarships",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const addFavoriteScholarship = async (token, scholarshipId) => {
    return await axiosInstance.post(
        "/seeker/favorite",
        { scholarshipId },
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const removeFavoriteScholarship = async (token, scholarshipId) => {
    console.log('Removing favorite:', scholarshipId);
    const response = await axiosInstance.delete(
        "/seeker/favorite",
        {
            data: { scholarshipId },
            headers: { Authorization: `Bearer ${token}` }
        }
    );
    console.log('Remove favorite response:', response);
    return response;
};