// Import hooks và utilities cần thiết
import { useState } from "react";
// Import react-hook-form để quản lý form validation
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// Import react-toastify để hiển thị thông báo
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import API service để gửi yêu cầu reset mật khẩu
import { forgotPassword } from "../services/authApi";
// Import các component UI
import Header from '../components/Header';
import Footer from '../components/Footer';
// Import CSS styling
import '../css/Login.css';

// Schema validation cho email
const schema = yup.object().shape({
    email: yup.string().required("Vui lòng nhập email").email("Email không hợp lệ"),
});

/**
 * Component ForgotPassword - Trang quên mật khẩu
 * Chức năng:
 * - Nhận email từ người dùng để gửi mã OTP khôi phục mật khẩu
 * - Validation email
 * - Gửi yêu cầu reset mật khẩu đến server
 * - Chuyển hướng đến trang nhập OTP reset mật khẩu
 */
function ForgotPassword() {
    // Khởi tạo react-hook-form với schema validation
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    // State management cho component
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi gửi yêu cầu
    const [errorMessage, setErrorMessage] = useState(""); // Lưu thông báo lỗi

    /**
     * Hàm xử lý submit form quên mật khẩu
     * @param {Object} data - Dữ liệu form chứa email
     */
    const onSubmit = async (data) => {
        setIsLoading(true); // Bật trạng thái loading
        setErrorMessage(""); // Xóa thông báo lỗi cũ

        try {
            // Gọi API gửi yêu cầu reset mật khẩu
            const res = await forgotPassword({
                email: data.email,
            });

            if (res.status === 200) {
                toast.success(res.body);
                // Lưu email vào localStorage để sử dụng ở bước tiếp theo
                localStorage.setItem("resetPasswordEmail", data.email);
                // Chuyển hướng đến trang nhập OTP reset mật khẩu
                window.location.href = "/auth/otp-forgot-password";
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage("Gửi mã OTP thất bại!");
                toast.error("Gửi mã OTP thất bại!");
            } else {
                toast.error("Lỗi kết nối server!");
                console.error("Lỗi:", error);
            }
        } finally {
            setIsLoading(false); // Tắt trạng thái loading
        }
    };

    // Render giao diện trang quên mật khẩu
    return (
        <div className="d-flex flex-column min-vh-100">
            {/* Header của trang */}
            <Header />
            
            {/* Nội dung chính của trang */}
            <main className="login-container flex-grow-1">
                <div className="container my-5">
                    <div className="row shadow rounded overflow-hidden login-form-container">
                        
                        {/* Cột hình ảnh bên trái - chỉ hiển thị trên desktop */}
                        <div className="col-md-6 d-none d-md-block login-image-col">
                            <img
                                src="https://picsum.photos/800?grayscale"
                                alt="Forgot Password"
                                className="login-image"
                            />
                        </div>

                        {/* Cột form bên phải */}
                        <div className="col-md-6 bg-white login-form-col">
                            {/* Tiêu đề form */}
                            <h3 className="text-center fw-bold login-form-title mt-4">
                                <i className="fas fa-unlock-alt me-2"></i>Quên mật khẩu
                            </h3>
                            <p className="text-center text-muted login-form-subtitle">
                                Nhập email để nhận mã OTP khôi phục mật khẩu.
                            </p>

                            {/* Hiển thị thông báo lỗi nếu có */}
                            {errorMessage && (
                                <div className="alert alert-danger">{errorMessage}</div>
                            )}

                            {/* Form quên mật khẩu */}
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
                                            <div className="invalid-feedback">{errors.email.message}</div>
                                        )}
                                    </div>
                                </div>

                                {/* Nút gửi OTP với loading state */}
                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mt-3"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin me-2"></i>Đang gửi...
                                        </>
                                    ) : (
                                        "Gửi mã OTP"
                                    )}
                                </button>

                                {/* Link quay lại trang đăng nhập */}
                                <div className="text-center mt-3">
                                    <a href="/login">Quay lại đăng nhập</a>
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

export default ForgotPassword;