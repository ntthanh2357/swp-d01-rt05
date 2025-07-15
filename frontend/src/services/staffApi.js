import { axiosInstance } from "./api";

// Dashboard APIs
export const getStaffOverview = async (data) => {
    return await axiosInstance.post(`/staff-dashboard/overview`, data);
};

export const getStaffActivityChart = async (data) => {
    return await axiosInstance.post(`/staff-dashboard/activity-chart`, data);
};

export const getStaffFeedback = async (data) => {
    return await axiosInstance.post(`/staff-dashboard/feedback`, data);
};

export const getActiveSeekers = async (data) => {
    return await axiosInstance.post(`/staff-dashboard/active-seekers`, data);
};

// Profile APIs
export const getStaffProfile = async (data) => {
    return await axiosInstance.post(`/staff/profile`, data);
};

export const sendUpdateStaffProfileOtp = async (data) => {
    return await axiosInstance.post(`/staff/send-otp`, data);
};

export const verifyUpdateStaffProfileOtp = async (data) => {
    return await axiosInstance.post(`/staff/verify-otp`, data);
};

export const updateStaffProfile = async (data) => {
    return await axiosInstance.post(`/staff/update-staff-profile`, data);
};

export const getAllStaffs = async (filters) => {
    if (!filters || Object.values(filters).every(v => v === undefined || v === "")) {
        return await axiosInstance.post(`/staff/all`);
    }
    return await axiosInstance.post(`/staff/all`, filters);
};

// Lấy thông tin chi tiết của một seeker
export const getSeekerDetail = async ({ seekerId, token }) => {
    try {
        console.log('Calling API with seekerId:', seekerId);
        
        const response = await fetch(`/api/seeker/profile`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ seekerId })
        });

        if (!response.ok) {
            throw new Error('Failed to fetch seeker detail');
        }

        const data = await response.json();
        console.log('API response:', data);
        return data;
    } catch (error) {
        console.error('Error fetching seeker detail:', error);
        throw error;
    }
};

export const getPublicStaffList = async () => {
    return await axiosInstance.get("/staff/public-list");
};

export const getPublicStaffProfile = async (staffId) => {
    return await axiosInstance.get(`/staff/public-profile/${staffId}`);
};

export const postStaffReview = async (data) => {
    return await axiosInstance.post('/staff/review', data);
};