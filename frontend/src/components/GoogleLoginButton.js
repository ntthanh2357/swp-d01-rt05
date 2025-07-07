import { useState, useContext } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { googleLogin } from '../services/authApi';
import { UserContext } from '../contexts/UserContext';

function GoogleLoginButton() {
    const { login } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(false);

    const handleSuccess = async (credentialResponse) => {
        setIsLoading(true);
        try {
            const res = await googleLogin({ token: credentialResponse.credential });
            if (res.status === 200 && res.data.token) {
                login(res.data.token);
                toast.success("Đăng nhập Google thành công!");
                window.location.href = "/";
            } else {
                toast.error("Đăng nhập Google thất bại!");
            }
        } catch (e) {
            toast.error("Đăng nhập Google thất bại!");
            console.error("Lỗi đăng nhập Google:", e);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <GoogleLogin
            onSuccess={handleSuccess}
            useOneTap
            disabled={isLoading}
        />
    );
}

export default GoogleLoginButton;