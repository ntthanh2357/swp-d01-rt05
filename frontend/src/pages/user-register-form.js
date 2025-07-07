import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { register as registerUser } from "../services/authApi";

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/register.css';

const schema = yup.object().shape({
    name: yup
        .string()
        .required("Vui lòng nhập họ tên")
        .matches(/^[a-zA-Z\s]+$/, "Họ tên không được chứa số hoặc ký tự đặc biệt"),
    phone: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^(0[3|5|7|8|9]\d{8})$/, "Số điện thoại không hợp lệ"),
    date_of_birth: yup
        .date()
        .required("Vui lòng nhập ngày sinh")
        .max(new Date(), "Ngày sinh không thể là tương lai")
        .test("age", "Bạn phải từ 10 tuổi trở lên", (value) => {
            if (!value) return false;
            const today = new Date();
            const age = today.getFullYear() - value.getFullYear();
            const m = today.getMonth() - value.getMonth();
            return age > 10 || (age === 10 && m >= 0);
        }),
    gender: yup
        .string()
        .required("Vui lòng chọn giới tính"),
    password: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .min(8, "Mật khẩu phải từ 8 ký tự trở lên")
        .matches(/[a-zA-Z]/, "Mật khẩu cần có chữ cái")
        .matches(/\d/, "Mật khẩu cần có số")
        .matches(/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]/, "Mật khẩu cần có ký tự đặc biệt"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp"),
});

function UserRegisterForm() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const email = localStorage.getItem("registerEmail");

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const res = await registerUser({
                name: data.name,
                email: email,
                phone: data.phone,
                dateOfBirth: data.date_of_birth,
                gender: data.gender,
                passwordHash: data.password,
            });

            if (res.status === 201) {
                toast.success("Đăng ký thành công!");
                localStorage.removeItem("registerEmail");
                window.location.href = "/auth/login";
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage("Đăng ký thất bại!");
                toast.error("Đăng ký thất bại!");
            } else {
                toast.error("Lỗi kết nối server!");
                console.error("Error:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="page-container">
            <Header />
            <div className="register-container">
                <div className="register-form">
                    <h2 className="register-title">Đăng ký</h2>
                    <p className="register-subtitle">
                        Vui lòng điền thông tin để tạo tài khoản.
                    </p>

                    {errorMessage && (
                        <div className="alert alert-danger register-error">{errorMessage}</div>
                    )}

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Họ tên:</label>
                                    <input
                                        className={`form-input ${errors.name ? 'input-error' : ''}`}
                                        {...register("name")}
                                        placeholder="Nhập họ và tên"
                                    />
                                    {errors.name && (
                                        <p className="error-message">{errors.name.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Ngày sinh:</label>
                                    <input
                                        type="date"
                                        className={`form-input ${errors.date_of_birth ? 'input-error' : ''}`}
                                        {...register("date_of_birth")}
                                    />
                                    {errors.date_of_birth && (
                                        <p className="error-message">{errors.date_of_birth.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Số điện thoại:</label>
                                    <input
                                        className={`form-input ${errors.phone ? 'input-error' : ''}`}
                                        {...register("phone")}
                                        placeholder="Nhập số điện thoại"
                                    />
                                    {errors.phone && (
                                        <p className="error-message">{errors.phone.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Giới tính:</label>
                                    <select
                                        className={`form-input ${errors.gender ? 'input-error' : ''}`}
                                        {...register("gender")}
                                    >
                                        <option value="">Chọn giới tính</option>
                                        <option value="male">Nam</option>
                                        <option value="female">Nữ</option>
                                        <option value="other">Khác</option>
                                    </select>
                                    {errors.gender && (
                                        <p className="error-message">{errors.gender.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Mật khẩu:</label>
                                    <input
                                        type="password"
                                        className={`form-input ${errors.password ? 'input-error' : ''}`}
                                        {...register("password")}
                                        placeholder="Nhập mật khẩu"
                                    />
                                    {errors.password && (
                                        <p className="error-message">{errors.password.message}</p>
                                    )}
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Xác nhận mật khẩu:</label>
                                    <input
                                        type="password"
                                        className={`form-input ${errors.confirmPassword ? 'input-error' : ''}`}
                                        {...register("confirmPassword")}
                                        placeholder="Nhập lại mật khẩu"
                                    />
                                    {errors.confirmPassword && (
                                        <p className="error-message">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="submit-btn"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <span className="spinner"></span>
                                    Đang đăng ký...
                                </>
                            ) : (
                                'Đăng ký'
                            )}
                        </button>
                    </form>
                </div>
                <ToastContainer />
            </div>
            <Footer />
        </div>
    );

}

export default UserRegisterForm;