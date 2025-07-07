import axios from "axios";

const API_BASE = "http://localhost:8080/api";

export const axiosInstance = axios.create({
    baseURL: API_BASE,
    headers: {
        "Content-Type": "application/json",
    },
});