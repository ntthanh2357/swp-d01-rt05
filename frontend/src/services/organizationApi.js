import { axiosInstance } from "./api";

export const getAllOrganizations = async () => {
    return await axiosInstance.get("/organizations");
};

export const getOrganizationById = async (id) => {
    return await axiosInstance.get(`/organizations/${id}`);
};