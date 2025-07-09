import { axiosInstance } from "./api";

export const getAllOrganizations = async () => {
    return await axiosInstance.get("/organizations");
};

export const getActiveOrganizations = async () => {
    return await axiosInstance.post("/organizations/get-active");
};

export const searchOrganizations = async (searchCriteria) => {
    return await axiosInstance.post("/organizations/search", searchCriteria);
};

export const getOrganizationById = async (id) => {
    return await axiosInstance.get(`/organizations/${id}`);
};