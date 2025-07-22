// Import hooks và utilities cần thiết
import { useState } from "react";
// Import react-hook-form để quản lý form validation
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// Import react-toastify để hiển thị thông báo
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import API service để gửi OTP
import { sendOtp } from "../services/authApi";

// Import các component UI
import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import GoogleLoginButton from '../components/GoogleLoginButton.js';

// Import CSS styling
import "../css/register.css";

// Schema validation cho email đăng ký
const schema = yup.object().shape({
    email: yup.string().required("Vui lòng nhập email").email("Email không hợp lệ"),
});

/**
 * Component UserRegister - Trang đăng ký bước 1: Nhập email
 * Chức năng:
 * - Nhận email từ người dùng
 * - Gửi mã OTP đến email
 * - Chuyển hướng đến trang xác thực OTP
 * - Hỗ trợ đăng ký bằng Google
 */
function UserRegister() {
    // Khởi tạo react-hook-form với schema validation
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    // State management cho component
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi gửi OTP
    const [errorMessage, setErrorMessage] = useState(""); // Lưu thông báo lỗi

    /**
     * Hàm xử lý submit form gửi OTP
     * @param {Object} data - Dữ liệu form chứa email
     */
    const onSubmit = async (data) => {
        setIsLoading(true); // Bật trạng thái loading
        setErrorMessage(""); // Xóa thông báo lỗi cũ
        
        try {
            // Gọi API gửi OTP đến email
            const res = await sendOtp({
                email: data.email,
            });

            if (res.status === 200) {
                toast.success("Gửi mã OTP thành công!");
                // Lưu email vào localStorage để sử dụng ở bước tiếp theo
                localStorage.setItem("registerEmail", data.email);
                // Chuyển hướng đến trang xác thực OTP
                window.location.href = "/auth/verify-otp";
            } else {
                setErrorMessage("Gửi mã OTP thất bại!");
                toast.error("Gửi mã OTP thất bại!");
            }
        } catch (error) {
            setErrorMessage("Lỗi kết nối server!");
            toast.error("Lỗi kết nối server!");
            console.error("Error:", error);
        } finally {
            setIsLoading(false); // Tắt trạng thái loading
        }
    };

    // Render giao diện trang đăng ký
    return (
        <div className="page-container">
            {/* Header của trang */}
            <Header />
            
            {/* Nội dung chính trang đăng ký */}
            <div className="login-container">
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

                        {/* Cột form đăng ký */}
                        <div className="col-md-6 bg-white login-form-col">
                            <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
                                {/* Tiêu đề form */}
                                <h2 className="text-center mb-3">
                                    <i className="fas fa-sign-in-alt me-2"></i>Đăng ký
                                </h2>
                                <p className="text-center text-muted mb-4">
                                    Chào mừng! Vui lòng nhập email để đăng ký.
                                </p>

                                {/* Hiển thị thông báo lỗi nếu có */}
                                {errorMessage && (
                                    <div className="alert alert-danger">{errorMessage}</div>
                                )}

                                {/* Input email */}
                                <div className="mb-3">
                                    <label>Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text">
                                            <i className="fas fa-envelope"></i>
                                        </span>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                            placeholder="Nhập email"
                                            {...register("email")}
                                            disabled={isLoading}
                                        />
                                        {/* Hiển thị lỗi validation cho email */}
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                {errors.email.message}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Nút gửi OTP */}
                                <button
                                    type="submit"
                                    className="btn btn-primary login-form-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
                                </button>
                                
                                {/* Link đăng nhập cho user đã có tài khoản */}
                                <p className="text-center mt-3">
                                    Đã có tài khoản? <a href="/auth/login">Đăng nhập</a>
                                </p>
                                
                                {/* Hướng dẫn đăng ký bằng Google */}
                                <p className="text-center text-muted mt-3">
                                    Hoặc đăng ký bằng tài khoản Google
                                </p>
                                
                                {/* Nút đăng ký bằng Google */}
                                <div className="text-center mt-3">
                                    <GoogleLoginButton />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Footer của trang */}
            <Footer />
            
            {/* Container hiển thị toast notifications */}
            <ToastContainer />
        </div>
    );
}

export default UserRegister;