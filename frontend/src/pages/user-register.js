import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { sendOtp } from "../services/authApi";

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';
import GoogleLoginButton from '../components/GoogleLoginButton.js';

import "../css/register.css";

const schema = yup.object().shape({
    email: yup.string().required("Vui lòng nhập email").email("Email không hợp lệ"),
});

function UserRegister() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const res = await sendOtp({
                email: data.email,
            });

            if (res.status === 200) {
                toast.success("Gửi mã OTP thành công!");
                localStorage.setItem("registerEmail", data.email);
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
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Header />
            <div className="login-container">
                <div className="container login-form-container shadow rounded overflow-hidden">
                    <div className="row">
                        <div className="col-md-6 d-none d-md-block login-image-col">
                            <img
                                src="https://picsum.photos/800"
                                alt="Login Visual"
                                className="login-image"
                            />
                        </div>

                        <div className="col-md-6 bg-white login-form-col">
                            <form className="register-form" onSubmit={handleSubmit(onSubmit)}>
                                <h2 className="text-center mb-3">
                                    <i className="fas fa-sign-in-alt me-2"></i>Đăng ký
                                </h2>
                                <p className="text-center text-muted mb-4">
                                    Chào mừng! Vui lòng nhập email để đăng ký.
                                </p>

                                {errorMessage && (
                                    <div className="alert alert-danger">{errorMessage}</div>
                                )}

                                <div className="mb-3">
                                    <label>Email</label>
                                    <div className="input-group">
                                        <span className="input-group-text"><i className="fas fa-envelope"></i></span>
                                        <input
                                            type="email"
                                            className={`form-control ${errors.email ? "is-invalid" : ""}`}
                                            placeholder="Nhập email"
                                            {...register("email")}
                                            disabled={isLoading}
                                        />
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                {errors.email.message}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary login-form-button"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Đang gửi..." : "Gửi mã OTP"}
                                </button>
                                <p className="text-center mt-3">
                                    Đã có tài khoản? <a href="/login">Đăng nhập</a>
                                </p>
                                <p className="text-center text-muted mt-3">
                                    Hoặc đăng ký bằng tài khoản Google
                                </p>
                                <div className="text-center mt-3">
                                    <GoogleLoginButton />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <ToastContainer />
        </div>
    );
}

export default UserRegister;