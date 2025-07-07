import { axiosInstance } from "./api";

export const getAllOrganizations = async (data) => {
    return await axiosInstance.post("/organizations/get-all", data);
}