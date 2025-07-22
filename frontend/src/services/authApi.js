// Import axios instance được cấu hình sẵn
import { axiosInstance } from "./api";

/**
 * API Service cho Authentication & User Management
 * Chứa các hàm gọi API liên quan đến xác thực và quản lý người dùng
 */

/**
 * Gửi mã OTP đến email để đăng ký tài khoản
 * @param {Object} data - Chứa email người dùng
 * @returns {Promise} Response từ server
 */
export const sendOtp = async (data) => {
    return await axiosInstance.post("/auth/send-otp", data );
}

/**
 * Xác thực mã OTP nhập từ người dùng
 * @param {Object} data - Chứa email và mã OTP
 * @returns {Promise} Response từ server
 */
export const verifyOtp = async (data) => {
    return await axiosInstance.post("/auth/verify-otp", data);
}

/**
 * Đăng ký tài khoản người dùng mới
 * @param {Object} data - Thông tin đăng ký (name, email, phone, password, etc.)
 * @returns {Promise} Response từ server
 */
export const register = async (data) => {
    return await axiosInstance.post("/auth/register", data);
};

/**
 * Tạo tài khoản nhân viên (staff) - chỉ admin
 * @param {Object} data - Thông tin nhân viên
 * @returns {Promise} Response từ server
 */
export const createStaff = async (data) => {
    return await axiosInstance.post("/auth/create-staff", data);
}

/**
 * Tạo tài khoản quản trị viên (admin) - chỉ super admin
 * @param {Object} data - Thông tin admin
 * @returns {Promise} Response từ server
 */
export const createAdmin = async (data) => {
    return await axiosInstance.post("/auth/create-admin", data);
}

/**
 * Đăng nhập bằng Google OAuth
 * @param {Object} data - Token từ Google
 * @returns {Promise} Response từ server chứa JWT token
 */
export const googleLogin = async (data) => {
    return await axiosInstance.post("/auth/google", data);
}

/**
 * Đăng nhập bằng email và mật khẩu
 * @param {Object} data - Email và password
 * @returns {Promise} Response từ server chứa JWT token
 */
export const login = async (data) => {
    return await axiosInstance.post("/auth/login", data);
};

/**
 * Gửi yêu cầu quên mật khẩu (gửi OTP qua email)
 * @param {Object} data - Email của người dùng
 * @returns {Promise} Response từ server
 */
export const forgotPassword = async (data) => {
    return await axiosInstance.post("/auth/forgot-password", data);
}

/**
 * Đặt lại mật khẩu mới sau khi xác thực OTP
 * @param {Object} data - Email, OTP và mật khẩu mới
 * @returns {Promise} Response từ server
 */
export const resetPassword = async (data) => {
    return await axiosInstance.post("/auth/reset-password", data);
}

/**
 * Thay đổi mật khẩu cho người dùng đã đăng nhập
 * @param {Object} data - Token, mật khẩu cũ và mật khẩu mới
 * @returns {Promise} Response từ server
 */
export const changePassword = async (data) => {
    const { token, ...body } = data; // Tách token ra khỏi body
    return await axiosInstance.post("/auth/change-password", body, {
        headers: {
            Authorization: `Bearer ${token}` // Gửi token trong header
        }
    });
};