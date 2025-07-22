// Import React hooks và utilities cần thiết
import React, { useState } from "react";
// Import react-hook-form để quản lý form validation
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// Import react-toastify để hiển thị thông báo
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import CSS styling cho OTP modal
import "../css/otp.css";

// Schema validation cho mã OTP (6 chữ số)
const schema = yup.object().shape({
    otp: yup
        .string()
        .required("Vui lòng nhập mã OTP")
        .matches(/^\d{6}$/, "Mã OTP phải là 6 chữ số"),
});

/**
 * Component OtpModal - Modal xác thực mã OTP
 * Props:
 * @param {boolean} show - Điều khiển hiển thị modal
 * @param {function} onClose - Callback khi đóng modal
 * @param {function} onSubmitOtp - Callback khi submit OTP
 * @param {boolean} isLoading - Trạng thái loading
 * @param {string} errorMessage - Thông báo lỗi
 * 
 * Chức năng:
 * - Hiển thị 6 ô input cho mã OTP
 * - Tự động focus sang ô tiếp theo khi nhập
 * - Hỗ trợ paste OTP từ clipboard
 * - Validation mã OTP 6 chữ số
 */
function OtpModal({ show, onClose, onSubmitOtp, isLoading, errorMessage }) {
    // Khởi tạo react-hook-form với schema validation
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    // State quản lý giá trị từng ô OTP (mảng 6 phần tử)
    const [otpValues, setOtpValues] = useState(Array(6).fill(""));

    // Không render nếu modal không được hiển thị
    if (!show) return null;

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

        // Tự động chuyển sang ô tiếp theo nếu có giá trị và chưa phải ô cuối
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
     * Xử lý submit form OTP
     * @param {Object} data - Dữ liệu form chứa OTP
     */
    const onSubmit = (data) => {
        if (onSubmitOtp) onSubmitOtp(data.otp);
    };

    // Render giao diện modal OTP
    return (
        <div className="otp-modal-backdrop">
            <div className="otp-modal">
                {/* Header modal với tiêu đề và nút đóng */}
                <div className="otp-modal-header">
                    <h5>Xác nhận OTP</h5>
                    <button type="button" className="close" onClick={onClose}>
                        &times;
                    </button>
                </div>
                
                {/* Nội dung chính của modal */}
                <div className="otp-modal-body">
                    <p>Vui lòng nhập mã OTP đã được gửi đến email của bạn.</p>
                    
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
                        <button type="submit" disabled={isLoading} className="btn btn-success w-100 mt-2">
                            {isLoading ? "Đang xác thực..." : "Xác thực"}
                        </button>
                    </form>
                </div>
                
                {/* Container hiển thị toast notifications */}
                <ToastContainer />
            </div>
        </div>
    );
}

export default OtpModal;