import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/seeker/files';

// Upload file
export const uploadFile = async (file, category, token) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    
    const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
        }
    });
    
    return response;
};

// Get all files for current user
export const getMyFiles = async (token) => {
    const response = await axios.get(`${API_BASE_URL}/my-files`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    return response;
};

// Delete file
export const deleteFile = async (fileId, token) => {
    const response = await axios.delete(`${API_BASE_URL}/${fileId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
    
    return response;
};

// Get file download URL
export const getFileDownloadUrl = (fileId, token) => {
    return `${API_BASE_URL}/download/${fileId}?Authorization=Bearer ${token}`;
};

// Preview file (for PDF, images)
export const previewFile = async (fileId, token) => {
    const response = await axios.get(`${API_BASE_URL}/download/${fileId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
    });
    
    return response;
};
