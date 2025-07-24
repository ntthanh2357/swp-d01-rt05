import { axiosInstance } from "./api";

export const getNotificationList = async (userId, token) => {
    return await axiosInstance.get(
        `/notification/list/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const getUnreadCount = async (userId, token) => {
    return await axiosInstance.get(
        `/notification/unread-count/${userId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
}

export const markNotificationAsRead = async (id, token) => {
    return await axiosInstance.post(
        `/notification/read/${id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
}

export const sendNotification = async (userId, title, content, type, token) => {
    return await axiosInstance.post(
        `/notification/send`,
        { userId, title, content, type },
        { headers: { Authorization: `Bearer ${token}` } }
    );
}