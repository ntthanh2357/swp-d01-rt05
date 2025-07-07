import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { forgotPassword } from "../services/authApi";
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../css/Login.css';


const schema = yup.object().shape({
    email: yup.string().required("Vui lòng nhập email").email("Email không hợp lệ"),
});

function ForgotPassword() {
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
            const res = await forgotPassword({
                email: data.email,
            });

            if (res.status === 200) {
                toast.success(res.body);
                localStorage.setItem("resetPasswordEmail", data.email);
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
            setIsLoading(false);
        }
    };

    return (
  <div className="d-flex flex-column min-vh-100">
    <Header />
    <main className="login-container flex-grow-1">
      <div className="container my-5">
        <div className="row shadow rounded overflow-hidden login-form-container">
          
          {/* Cột hình ảnh bên trái */}
          <div className="col-md-6 d-none d-md-block login-image-col">
            <img
              src="https://picsum.photos/800?grayscale"
              alt="Forgot Password"
              className="login-image"
            />
          </div>

          {/* Cột form bên phải */}
          <div className="col-md-6 bg-white login-form-col">
            <h3 className="text-center fw-bold login-form-title mt-4">
              <i className="fas fa-unlock-alt me-2"></i>Quên mật khẩu
            </h3>
            <p className="text-center text-muted login-form-subtitle">
              Nhập email để nhận mã OTP khôi phục mật khẩu.
            </p>

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
                    <div className="invalid-feedback">{errors.email.message}</div>
                  )}
                </div>
              </div>

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

              <div className="text-center mt-3">
                <a href="/login">Quay lại đăng nhập</a>
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

export default ForgotPassword;