import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createAdmin } from "../services/authApi";

import Header from '../components/Header.js';
import Footer from '../components/Footer.js';

import "../css/register.css";

const schema = yup.object().shape({
    email: yup.string().required("Vui lòng nhập email").email("Email không hợp lệ"),
    password: yup.string().required("Vui lòng nhập mật khẩu").min(6, "Mật khẩu tối thiểu 6 ký tự"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref('password'), null], "Mật khẩu nhập lại không khớp")
        .required("Vui lòng nhập lại mật khẩu"),
});

function CreateAdmin() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMessage("");
        try {
            const res = await createAdmin({
                email: data.email,
                passwordHash: data.password,
            });

            if (res.status === 201) {
                toast.success("Tạo tài khoản admin thành công!");
                reset();
                window.location.href = "/admin/manage-users";
            } else {
                setErrorMessage("Tạo tài khoản thất bại!");
                toast.error("Tạo tài khoản thất bại!");
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
        <div className="d-flex flex-column min-vh-100">
            <Header />
            <main className="flex-grow-1 d-flex align-items-center justify-content-center bg-light py-5">
                <div className="container">
                    <div className="row justify-content-center">
                        <div className="col-lg-6 col-md-8">
                            <div className="card shadow-lg border-0 rounded-4">
                                <div className="card-body p-5 bg-white">
                                    <h3 className="text-center mb-4">
                                        <i className="fas fa-user-shield me-2"></i>Tạo tài khoản Admin
                                    </h3>
                                    <p className="text-center text-muted mb-4">
                                        Nhập thông tin để tạo tài khoản admin mới.
                                    </p>

                                    {errorMessage && (
                                        <div className="alert alert-danger">{errorMessage}</div>
                                    )}

                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className="mb-3">
                                            <label className="form-label">Email</label>
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
                                                    placeholder="Nhập mật khẩu"
                                                    {...register("password")}
                                                    disabled={isLoading}
                                                />
                                                {errors.password && (
                                                    <div className="invalid-feedback">
                                                        {errors.password.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <label className="form-label">Nhập lại mật khẩu</label>
                                            <div className="input-group">
                                                <span className="input-group-text">
                                                    <i className="fas fa-lock"></i>
                                                </span>
                                                <input
                                                    type="password"
                                                    className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                                                    placeholder="Nhập lại mật khẩu"
                                                    {...register("confirmPassword")}
                                                    disabled={isLoading}
                                                />
                                                {errors.confirmPassword && (
                                                    <div className="invalid-feedback">
                                                        {errors.confirmPassword.message}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="btn btn-primary w-100 rounded-pill"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? "Đang tạo..." : "Tạo Admin"}
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
            <ToastContainer />
        </div>
    );
}

export default CreateAdmin;
