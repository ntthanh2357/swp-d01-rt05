// Import các thư viện React và hooks cần thiết
import React, { useState, useContext } from "react";
// Import react-hook-form để quản lý form validation
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// Import jwt-decode để giải mã JWT token
import { jwtDecode } from "jwt-decode";
// Import react-toastify để hiển thị thông báo
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import UserContext để quản lý trạng thái người dùng
import { UserContext } from "../contexts/UserContext";
// Import API service để thực hiện đăng nhập
import { login as loginUser } from "../services/authApi";

// Import các component UI
import Header from '../components/Header';
import Footer from '../components/Footer';
import GoogleLoginButton from "../components/GoogleLoginButton";

// Import CSS styling
import '../css/Login.css';

// Schema validation cho form đăng nhập sử dụng Yup
const schema = yup.object().shape({
    email: yup.string().required("Vui lòng nhập email").email("Email không hợp lệ"),
    password: yup.string().required("Vui lòng nhập mật khẩu"),
});

/**
 * Component LoginForm - Trang đăng nhập của hệ thống
 * Chức năng:
 * - Hiển thị form đăng nhập với email và mật khẩu
 * - Validation dữ liệu đầu vào
 * - Xử lý đăng nhập và chuyển hướng theo role
 * - Hỗ trợ đăng nhập bằng Google
 */
function LoginForm() {
    // Khởi tạo react-hook-form với schema validation
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    // State management cho component
    const [errorMessage, setErrorMessage] = useState(""); // Lưu thông báo lỗi
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
    const { login } = useContext(UserContext); // Context để quản lý user

    /**
     * Hàm xử lý submit form đăng nhập
     * @param {Object} data - Dữ liệu form (email, password)
     */
    const onSubmit = async (data) => {
        setIsLoading(true); // Bật trạng thái loading
        setErrorMessage(""); // Xóa thông báo lỗi cũ
        try {
            // Gọi API đăng nhập
            const res = await loginUser({
                email: data.email,
                password: data.password,
            });
            
            if (res.status === 200) {
                // Xử lý đăng nhập thành công
                const accessToken = res.data.token;
                console.log("Access Token:", accessToken); // Log token
                
                if (typeof accessToken === "string" && accessToken.length > 0) {
                    // Lưu token vào localStorage
                    localStorage.setItem("accessToken", accessToken);
                    // Giải mã token để lấy thông tin user
                    const decoded = jwtDecode(accessToken);
                    console.log("Decoded Token:", decoded); // Log decoded token
                    
                    // Chuyển hướng theo role của user
                    if (decoded.role === "staff") {
                        toast.success("Đăng nhập thành công với quyền nhân viên!");
                        setTimeout(() => {
                            console.log("Redirecting to /staff/staff-dashboard");
                            window.location.href = "/staff/staff-dashboard";
                        }, 1000);
                    } else {
                        toast.success("Đăng nhập thành công!");
                        setTimeout(() => {
                            console.log("Redirecting to /");
                            window.location.href = "/";
                        }, 1000);
                    }
                } else {
                    setErrorMessage("Lỗi: Không nhận được accessToken hợp lệ từ server.");
                }
            }
        } catch (error) {
            console.error("Login Error:", error);
            
            // Kiểm tra lỗi tài khoản bị khóa
            if (error.response) {
                if (error.response.status === 403) {
                    toast.error("Tài khoản của bạn đã bị khóa.");
                    setErrorMessage("Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.");
                } else {
                    toast.error("Đăng nhập thất bại.");
                    setErrorMessage("Email hoặc mật khẩu không đúng");
                }
            } else {
                toast.error("Đăng nhập thất bại.");
                setErrorMessage("Có lỗi xảy ra khi đăng nhập. Vui lòng thử lại sau.");
            }
        } finally {
            setIsLoading(false); // Tắt trạng thái loading
        }
    };

    // Render giao diện trang đăng nhập
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Header của trang */}
            <Header />
            
            {/* Nội dung chính của trang đăng nhập */}
            <main className="login-container flex-grow-1">
                <div className="container login-form-container shadow rounded overflow-hidden">
                    <div className="row">
                        {/* Cột hình ảnh - chỉ hiển thị trên desktop */}
                        <div className="col-md-6 d-none d-md-block login-image-col">
                            <img
                                src="https://picsum.photos/800"
                                alt="Login Visual"
                                className="login-image"
                            />
                        </div>

                        {/* Cột form đăng nhập */}
                        <div className="col-md-6 bg-white login-form-col">
                            {/* Tiêu đề form */}
                            <h3 className="text-center fw-bold login-form-title">
                                <i className="fas fa-sign-in-alt me-2"></i>Đăng nhập
                            </h3>
                            <p className="text-center text-muted login-form-subtitle">
                                Chào mừng trở lại! Vui lòng nhập thông tin của bạn.
                            </p>

                            {/* Hiển thị thông báo lỗi nếu có */}
                            {errorMessage && (
                                <div className="alert alert-danger">{errorMessage}</div>
                            )}

                            {/* Form đăng nhập */}
                            <form onSubmit={handleSubmit(onSubmit)} noValidate>
                                {/* Input email */}
                                <div className="mb-3">
                                    <label className="form-label">Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-envelope"></i>
                                        </span>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                            {...register("email")}
                                            placeholder="Nhập email"
                                        />
                                        {/* Hiển thị lỗi validation cho email */}
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                {errors.email.message}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Input mật khẩu */}
                                <div className="mb-3">
                                    <label className="form-label">Mật khẩu</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-lock"></i>
                                        </span>
                                        <input
                                            type="password"
                                            className={`form-control ${errors.password ? "is-invalid" : ""}`}
                                            {...register("password")}
                                            placeholder="Nhập mật khẩu"
                                        />
                                        {/* Hiển thị lỗi validation cho mật khẩu */}
                                        {errors.password && (
                                            <div className="invalid-feedback">
                                                {errors.password.message}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Nút submit */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mt-3"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                                </button>

                                {/* Links hỗ trợ */}
                                <div className="text-center mt-3">
                                    <p className="text-muted">
                                        Chưa có tài khoản? <a href="/auth/user-register">Đăng ký ngay</a>
                                    </p>
                                    <a href="/auth/forgot-password">Quên mật khẩu?</a>
                                </div>
                                
                                {/* Nút đăng nhập bằng Google */}
                                <div className="text-center mt-3">
                                    <GoogleLoginButton />
                                </div>
                            </form>
                        </div>
                    </div>
                    {/* Container hiển thị toast notifications */}
                    <ToastContainer />
                </div>
            </main>
            
            {/* Footer của trang */}
            <Footer />
        </div>
    );
}

export default LoginForm;