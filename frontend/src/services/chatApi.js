import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

export const getConversation = (token, otherUserId) => {
    return axios.post(`${API_URL}/chat/conversation`, {
        token,
        otherUserId
    });
};

export const getContacts = (token) => {
    return axios.post(`${API_URL}/chat/contacts`, {
        token
    });
};

export const getUnreadMessageCount = (token) => {
    return axios.post(`${API_URL}/chat/unread-count`, {
        token
    });
};

export const markAsRead = (token, otherUserId) => {
    return axios.post(`${API_URL}/chat/mark-read`, {
        token,
        otherUserId
    });
};

export const getPrompts = () => {
    return axios.get(`${API_URL}/chat/prompts`);
};