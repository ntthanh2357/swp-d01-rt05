import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { verifyOtp } from "../services/authApi";
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../css/otp.css';

const schema = yup.object().shape({
    otp: yup
        .string()
        .required("Vui lòng nhập mã OTP")
        .matches(/^\d{6}$/, "Mã OTP phải là 6 chữ số"),
});

function OtpForgotPassword() {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [otpValues, setOtpValues] = useState(Array(6).fill(""));
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

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

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const res = await verifyOtp({
                email: localStorage.getItem("resetPasswordEmail"),
                otp: data.otp,
                task: "reset_password",
            });
            if (res.status === 200) {
                toast.success(res.body);
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
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Header />
            <div className="otp-container">
                <div className="otp-form-wrapper">
                    <h2 className="otp-title">Đăng ký</h2>
                    <p className="otp-subtitle">
                        Vui lòng nhập mã OTP đã được gửi đến email của bạn.
                    </p>
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
                        <button type="submit" disabled={isLoading} className="submit-btn">
                            {isLoading ? "Đang xác thực..." : "Xác thực"}
                        </button>
                    </form>
                    <ToastContainer />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default OtpForgotPassword;