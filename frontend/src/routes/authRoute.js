import { Routes, Route } from "react-router-dom";
import UserRegister from "../pages/user-register";
import OtpVerificationForm from "../pages/opt-verification";
import UserRegisterForm from "../pages/user-register-form";
import LoginForm from "../pages/login";
import ForgotPassword from "../pages/forgot-password";
import OtpForgotPassword from "../pages/otp-forgot-password";
import PasswordReset from "../pages/password-reset";

function AuthRoute() {
    return (
        <Routes>
            <Route path="/user-register" element={<UserRegister />} />
            <Route path="/verify-otp" element={<OtpVerificationForm />} />
            <Route path="/user-register-form" element={<UserRegisterForm />} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-forgot-password" element={<OtpForgotPassword />} />
            <Route path="/password-reset" element={<PasswordReset />} />
        </Routes>
    );
}

export default AuthRoute;