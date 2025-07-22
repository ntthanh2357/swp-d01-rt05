// Import React hooks và utilities cần thiết
import React, { useState } from "react";
// Import react-hook-form để quản lý form validation
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// Import react-toastify để hiển thị thông báo
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import API service để xác thực OTP
import { verifyOtp } from "../services/authApi";
// Import các component UI
import Header from '../components/Header';
import Footer from '../components/Footer';
// Import CSS styling
import '../css/otp.css';

// Schema validation cho mã OTP (6 chữ số)
const schema = yup.object().shape({
    otp: yup
        .string()
        .required("Vui lòng nhập mã OTP")
        .matches(/^\d{6}$/, "Mã OTP phải là 6 chữ số"),
});

/**
 * Component OtpForgotPassword - Trang xác thực OTP cho reset mật khẩu
 * Chức năng:
 * - Hiển thị form nhập mã OTP 6 chữ số để reset mật khẩu
 * - Xác thực OTP với email từ bước quên mật khẩu trước
 * - Tự động focus và hỗ trợ paste OTP
 * - Chuyển hướng đến trang đặt lại mật khẩu khi thành công
 */
function OtpForgotPassword() {
    // Khởi tạo react-hook-form với schema validation
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    // State management cho component
    const [otpValues, setOtpValues] = useState(Array(6).fill("")); // Mảng lưu 6 ký tự OTP
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading
    const [errorMessage, setErrorMessage] = useState(""); // Thông báo lỗi

    /**
     * Xử lý thay đổi giá trị trong ô OTP
     * @param {Event} e - Event input
     * @param {number} index - Vị trí ô input (0-5)
     */
    const handleOtpChange = (e, index) => {
        const value = e.target.value.replace(/\D/, ""); // Chỉ cho phép số
        if (value.length > 1) return; // Chỉ cho phép 1 ký tự

        // Cập nhật giá trị ô hiện tại
        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);
        setValue("otp", newOtpValues.join("")); // Cập nhật form value

        // Tự động focus sang ô tiếp theo nếu có giá trị và chưa phải ô cuối
        if (value && index < 5) {
            const nextInput = document.querySelector(
                `.otp-single-input:nth-child(${index + 2})`
            );
            if (nextInput) nextInput.focus();
        }
    };

    /**
     * Xử lý paste OTP từ clipboard
     * @param {Event} e - Event paste
     */
    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text/plain').trim();
        
        // Kiểm tra dữ liệu paste có đúng format (6 chữ số)
        if (pasteData.length === 6 && /^\d{6}$/.test(pasteData)) {
            const newOtpValues = pasteData.split('');
            setOtpValues(newOtpValues);
            setValue("otp", pasteData);
            // Focus vào ô cuối cùng sau khi paste
            const otpInputs = document.querySelectorAll('.otp-single-input');
            if (otpInputs[5]) otpInputs[5].focus();
        }
    };

    /**
     * Xử lý phím Backspace để quay lại ô trước
     * @param {Event} e - Event keydown
     * @param {number} index - Vị trí ô input
     */
    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && otpValues[index] === "" && index > 0) {
            const prevInput = document.querySelector(
                `.otp-single-input:nth-child(${index})`
            );
            if (prevInput) prevInput.focus();
        }
    };

    /**
     * Xử lý submit form xác thực OTP reset mật khẩu
     * @param {Object} data - Dữ liệu form chứa OTP
     */
    const onSubmit = async (data) => {
        setIsLoading(true); // Bật trạng thái loading
        setErrorMessage(""); // Xóa thông báo lỗi cũ
        
        try {
            // Gọi API xác thực OTP với email từ localStorage
            const res = await verifyOtp({
                email: localStorage.getItem("resetPasswordEmail"), // Email từ bước forgot password
                otp: data.otp, // Mã OTP người dùng nhập
                task: "reset_password", // Loại task (reset mật khẩu)
            });
            
            if (res.status === 200) {
                toast.success(res.body);
                // Chuyển hướng đến trang đặt lại mật khẩu
                window.location.href = "/auth/password-reset";
            }
        } catch (error) {
            if (error.response && error.response.status === 401) {
                setErrorMessage("Mã OTP không đúng hoặc đã hết hạn");
                toast.error("Xác thực thất bại!");
            } else {
                toast.error("Lỗi kết nối server!");
                console.error("Lỗi:", error);
            }
        } finally {
            setIsLoading(false); // Tắt trạng thái loading
        }
    };

    // Render giao diện trang xác thực OTP reset mật khẩu
    return (
        <div className="page-container">
            {/* Header của trang */}
            <Header />
            
            {/* Container chính của form OTP */}
            <div className="otp-container">
                <div className="otp-form-wrapper">
                    {/* Tiêu đề trang - sửa lại cho đúng ngữ cảnh */}
                    <h2 className="otp-title">Xác Thực OTP</h2>
                    <p className="otp-subtitle">
                        Vui lòng nhập mã OTP đã được gửi đến email của bạn để đặt lại mật khẩu.
                    </p>
                    
                    {/* Hiển thị thông báo lỗi nếu có */}
                    {errorMessage && (
                        <div className="alert alert-danger">{errorMessage}</div>
                    )}
                    
                    {/* Form nhập OTP */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="otp-input-group">
                            <label>Mã OTP:</label>
                            
                            {/* Container chứa 6 ô input OTP */}
                            <div className="otp-inputs">
                                {[...Array(6)].map((_, index) => (
                                    <input
                                        key={index}
                                        type="text"
                                        maxLength={1}
                                        value={otpValues[index]}
                                        className="otp-single-input"
                                        onChange={(e) => handleOtpChange(e, index)}
                                        onPaste={handleOtpPaste}
                                        onKeyDown={(e) => handleOtpKeyDown(e, index)}
                                    />
                                ))}
                                {/* Hidden input để lưu giá trị OTP hoàn chỉnh */}
                                <input type="hidden" {...register("otp")} value={otpValues.join("")} />
                            </div>
                            
                            {/* Hiển thị lỗi validation */}
                            <p className="error-message">{errors.otp?.message}</p>
                        </div>
                        
                        {/* Nút submit với loading state */}
                        <button type="submit" disabled={isLoading} className="submit-btn">
                            {isLoading ? "Đang xác thực..." : "Xác thực"}
                        </button>
                    </form>
                    
                    {/* Container hiển thị toast notifications */}
                    <ToastContainer />
                </div>
            </div>
            
            {/* Footer của trang */}
            <Footer />
        </div>
    );
}

export default OtpForgotPassword;