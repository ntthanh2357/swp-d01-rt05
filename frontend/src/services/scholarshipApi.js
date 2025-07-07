import { axiosInstance } from "./api";

export const getActiveScholarships = async () => {
    return await axiosInstance.post("/scholarships/get-active");
}

export const getAllScholarships = async () => {
    return await axiosInstance.post("/scholarships/get-all");
}

export const addScholarship = async (data) => {
    return await axiosInstance.post("/scholarships/add", data);
}

export const updateScholarship = async (data) => {
    return await axiosInstance.post("/scholarships/update", data);
}

export const deleteScholarship = async (id) => {
    return await axiosInstance.post("/scholarships/delete", { id });
}