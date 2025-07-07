import { axiosInstance } from "./api";

export const getStaffOverview = async (data) => {
    return await axiosInstance.post(`/staff-dashboard/overview`, data );
};

export const getStaffActivityChart = async (data) => {
    return await axiosInstance.post(`/staff-dashboard/activity-chart`, data );
};

export const getStaffFeedback = async (data) => {
    return await axiosInstance.post(`/staff-dashboard/feedback`, data );
};