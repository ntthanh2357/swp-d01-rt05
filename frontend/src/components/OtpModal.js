import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../css/otp.css";

const schema = yup.object().shape({
    otp: yup
        .string()
        .required("Vui lòng nhập mã OTP")
        .matches(/^\d{6}$/, "Mã OTP phải là 6 chữ số"),
});

function OtpModal({ show, onClose, onSubmitOtp, isLoading, errorMessage }) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [otpValues, setOtpValues] = useState(Array(6).fill(""));

    if (!show) return null;

    const handleOtpChange = (e, index) => {
        const value = e.target.value.replace(/\D/, "");
        if (value.length > 1) return;

        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);
        setValue("otp", newOtpValues.join(""));

        if (value && index < 5) {
            const nextInput = document.querySelector(
                `.otp-single-input:nth-child(${index + 2})`
            );
            if (nextInput) nextInput.focus();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasteData = e.clipboardData.getData('text/plain').trim();
        if (pasteData.length === 6 && /^\d{6}$/.test(pasteData)) {
            const newOtpValues = pasteData.split('');
            setOtpValues(newOtpValues);
            setValue("otp", pasteData);
            const otpInputs = document.querySelectorAll('.otp-single-input');
            if (otpInputs[5]) otpInputs[5].focus();
        }
    };

    const handleOtpKeyDown = (e, index) => {
        if (e.key === "Backspace" && otpValues[index] === "" && index > 0) {
            const prevInput = document.querySelector(
                `.otp-single-input:nth-child(${index})`
            );
            if (prevInput) prevInput.focus();
        }
    };

    const onSubmit = (data) => {
        if (onSubmitOtp) onSubmitOtp(data.otp);
    };

    return (
        <div className="otp-modal-backdrop">
            <div className="otp-modal">
                <div className="otp-modal-header">
                    <h5>Xác nhận OTP</h5>
                    <button type="button" className="close" onClick={onClose}>
                        &times;
                    </button>
                </div>
                <div className="otp-modal-body">
                    <p>Vui lòng nhập mã OTP đã được gửi đến email của bạn.</p>
                    {errorMessage && (
                        <div className="alert alert-danger">{errorMessage}</div>
                    )}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="otp-input-group">
                            <label>Mã OTP:</label>
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
                                <input type="hidden" {...register("otp")} value={otpValues.join("")} />
                            </div>
                            <p className="error-message">{errors.otp?.message}</p>
                        </div>
                        <button type="submit" disabled={isLoading} className="btn btn-success w-100 mt-2">
                            {isLoading ? "Đang xác thực..." : "Xác thực"}
                        </button>
                    </form>
                </div>
                <ToastContainer />
            </div>
        </div>
    );
}

export default OtpModal;