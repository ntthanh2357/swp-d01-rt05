import { axiosInstance } from "./api";

export const getRoadmap = async (token) => {
    return await axiosInstance.get(
        "/consultation-roadmap",
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const getRoadmapProgress = async (token) => {
    return await axiosInstance.get(
        "/consultation-roadmap/progress",
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

// SỬA: API cho seeker để lấy chi tiết stage của chính mình
export const getStageDetails = async (token, stageNumber) => {
    return await axiosInstance.get(
        `/consultation-roadmap/stage/${stageNumber}/details`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

// API cho staff để lấy chi tiết stage template
export const getStageDetailsForStaff = async (token, stageNumber) => {
    return await axiosInstance.get(
        `/consultation-roadmap/staff/stage/${stageNumber}/details`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

// API cho staff để lấy chi tiết từng bước của seeker trong một giai đoạn
export const getSeekerStageDetails = async (token, seekerId, stageNumber) => {
    return await axiosInstance.get(
        `/consultation-roadmap/${seekerId}/stage/${stageNumber}/details`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const getSeekerRoadmap = async (token, seekerId) => {
    return await axiosInstance.get(
        `/consultation-roadmap/${seekerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

// LEGACY: API cũ để update stage status
export const updateStepStatus = async (token, data) => {
    return await axiosInstance.put(
        "/consultation-roadmap/step",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

// THÊM: API mới để update step detail status
export const updateStepDetailStatus = async (token, data) => {
    return await axiosInstance.put(
        "/consultation-roadmap/step-detail",
        data,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const createRoadmapForSeeker = async (token, seekerId) => {
    return await axiosInstance.post(
        `/consultation-roadmap/create/${seekerId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
    );
};

export const deleteRoadmap = async (token, seekerId) => {
    return await axiosInstance.delete(
        `/consultation-roadmap/${seekerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
    );
};