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

// SỬA: API để lấy seekers premium - endpoint chính xác từ StaffController
export const getPremiumSeekers = async (token) => {
    return await axiosInstance.post(`/staff/premium-seekers`, { token });
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

export const getPublicStaffList = async () => {
    return await axiosInstance.get("/staff/public-list");
};

export const getPublicStaffProfile = async (staffId) => {
    return await axiosInstance.get(`/staff/public-profile/${staffId}`);
};

export const postStaffReview = async (data) => {
    return await axiosInstance.post('/staff/review', data);
};

export const getSeekerDetail = async (seekerId) => {
    return await axiosInstance.get(`/staff-dashboard/seeker/${seekerId}`);
};