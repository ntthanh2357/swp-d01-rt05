import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { resetPassword } from "../services/authApi";

import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/pass.css'

const schema = yup.object().shape({
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

function PasswordReset() {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const email = localStorage.getItem("resetPasswordEmail");

    const onSubmit = async (data) => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const res = await resetPassword({
                email: email,
                newPassword: data.password,
            });

            if (res.status === 200) {
                toast.success(res.body);
                localStorage.removeItem("resetPasswordEmail");
                window.location.href = "/auth/login";
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                setErrorMessage("Đặt lại mật khẩu thất bại!");
                toast.error("Đặt lại mật khẩu thất bại!");
            } else {
                toast.error("Lỗi kết nối server!");
                console.error("Lỗi:", error);
            }
        } finally {
            setIsLoading(false);
        }
    };

   return (
    <div className="password-reset-container">
      <Header />
      
      <div className="password-reset-content">
        <div className="password-reset-form">
          <h2 className="password-reset-title">Đặt lại mật khẩu</h2>
          
          <p className="password-reset-subtitle">
            Vui lòng nhập mật khẩu mới cho email: <strong>{email}</strong>
          </p>
          
          {errorMessage && (
            <div className="alert alert-danger error-message">{errorMessage}</div>
          )}
          
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Mật khẩu mới:</label>
              <input
                type="password"
                className={`form-control ${errors.password ? "is-invalid" : ""}`}
                {...register("password")}
                placeholder="Nhập mật khẩu mới"
              />
              {errors.password && (
                <p className="invalid-feedback">{errors.password.message}</p>
              )}
              <small className="form-text">
                Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ cái, số và ký tự đặc biệt
              </small>
            </div>

            <div className="form-group">
              <label>Xác nhận mật khẩu:</label>
              <input
                type="password"
                className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                {...register("confirmPassword")}
                placeholder="Nhập lại mật khẩu"
              />
              {errors.confirmPassword && (
                <p className="invalid-feedback">{errors.confirmPassword.message}</p>
              )}
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-reset"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
                  Đang xử lý...
                </>
              ) : (
                "Đặt lại mật khẩu"
              )}
            </button>
          </form>
        </div>
      </div>
      
      <Footer />
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default PasswordReset;