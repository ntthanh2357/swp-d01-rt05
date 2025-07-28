import axios from "axios";

const axiosInstance = axios.create({
    baseURL: "http://localhost:8080/api", // Đổi lại nếu backend bạn chạy ở port khác
    headers: {
        "Content-Type": "application/json",
    },
});

export default axiosInstance;