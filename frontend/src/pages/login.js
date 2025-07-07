import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { jwtDecode } from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserContext } from "../contexts/UserContext";
import { login as loginUser } from "../services/authApi";

import Header from '../components/Header';
import Footer from '../components/Footer';
import GoogleLoginButton from "../components/GoogleLoginButton";

import '../css/Login.css';

const schema = yup.object().shape({
    email: yup.string().required("Vui lòng nhập email").email("Email không hợp lệ"),
    password: yup.string().required("Vui lòng nhập mật khẩu"),
});

function LoginForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useContext(UserContext);

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const res = await loginUser({
                email: data.email,
                password: data.password,
            });

            if (res.status === 200) {
                const accessToken = res.data.token;
                if (typeof accessToken === "string" && accessToken.length > 0) {
                    // Lưu token vào localStorage nếu cần
                    localStorage.setItem("accessToken", accessToken);
                    // Giải mã token để lấy role
                    const decoded = jwtDecode(accessToken);
                    if (decoded.role === "staff") {
                        window.location.href = "/staff/staff-dashboard";
                    } else {
                        window.location.href = "/";
                    }
                } else {
                    setErrorMessage("Lỗi: Không nhận được accessToken hợp lệ từ server.");
                }
            }
        } catch (error) {
            setErrorMessage("Email hoặc mật khẩu không đúng");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="login-container flex-grow-1">
                <div className="container login-form-container shadow rounded overflow-hidden">
                    <div className="row">
                        {/* Cột hình ảnh */}
                        <div className="col-md-6 d-none d-md-block login-image-col">
                            <img
                                src="https://picsum.photos/800"
                                alt="Login Visual"
                                className="login-image"
                            />
                        </div>

                        {/* Cột form */}
                        <div className="col-md-6 bg-white login-form-col">
                            <h3 className="text-center fw-bold login-form-title">
                                <i className="fas fa-sign-in-alt me-2"></i>Đăng nhập
                            </h3>
                            <p className="text-center text-muted login-form-subtitle">Chào mừng trở lại! Vui lòng nhập thông tin của bạn.</p>

                            {errorMessage && (
                                <div className="alert alert-danger">{errorMessage}</div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} noValidate>
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
                                        {errors.email && (
                                            <div className="invalid-feedback">
                                                {errors.email.message}
                                            </div>
                                        )}
                                    </div>
                                </div>

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
                                        {errors.password && (
                                            <div className="invalid-feedback">
                                                {errors.password.message}
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 mt-3"
                                    disabled={isLoading}
                                >
                                    {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
                                </button>

                                <div className="text-center mt-3">
                                    <p className="text-muted">
                                        Chưa có tài khoản? <a href="/user-register">Đăng ký ngay</a>
                                    </p>
                                    <a href="/auth/forgot-password">Quên mật khẩu?</a>
                                </div>
                                <div className="text-center mt-3">
                                    <GoogleLoginButton />
                                </div>
                            </form>
                        </div>
                    </div>
                    <ToastContainer />
                </div>
            </main>
            <Footer />
        </div>
    );
}

export default LoginForm;