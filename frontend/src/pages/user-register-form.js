// Import hooks và utilities cần thiết
import { useState } from "react";
// Import react-hook-form để quản lý form validation
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
// Import react-toastify để hiển thị thông báo
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// Import API service để đăng ký tài khoản
import { register as registerUser } from "../services/authApi";

// Import các component UI
import Header from '../components/Header';
import Footer from '../components/Footer';

// Import CSS styling
import '../css/register.css';

// Schema validation chi tiết cho form đăng ký
const schema = yup.object().shape({
    // Validation cho họ tên
    name: yup
        .string()
        .required("Vui lòng nhập họ tên")
        .matches(/^[a-zA-Z\s]+$/, "Họ tên không được chứa số hoặc ký tự đặc biệt"),
    // Validation cho số điện thoại (format Việt Nam)
    phone: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^(0[3|5|7|8|9]\d{8})$/, "Số điện thoại không hợp lệ"),
    // Validation cho ngày sinh
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
    // Validation cho giới tính
    gender: yup
        .string()
        .required("Vui lòng chọn giới tính"),
    // Validation cho mật khẩu với các điều kiện bảo mật
    password: yup
        .string()
        .required("Vui lòng nhập mật khẩu")
        .min(8, "Mật khẩu phải từ 8 ký tự trở lên")
        .matches(/[a-zA-Z]/, "Mật khẩu cần có chữ cái")
        .matches(/\d/, "Mật khẩu cần có số")
        .matches(/[!@#$%^&*()_\-+=\[\]{};':"\\|,.<>/?`~]/, "Mật khẩu cần có ký tự đặc biệt"),
    // Validation cho xác nhận mật khẩu
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp"),
});

/**
 * Component UserRegisterForm - Trang đăng ký bước 2: Điền thông tin chi tiết
 * Chức năng:
 * - Nhận thông tin cá nhân từ người dùng (họ tên, ngày sinh, SĐT, giới tính)
 * - Nhận mật khẩu và xác nhận mật khẩu
 * - Validation dữ liệu đầy đủ
 * - Tạo tài khoản mới và chuyển hướng đến trang đăng nhập
 */
function UserRegisterForm() {
    // Khởi tạo react-hook-form với schema validation
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    // State management cho component
    const [isLoading, setIsLoading] = useState(false); // Trạng thái loading khi đăng ký
    const [errorMessage, setErrorMessage] = useState(""); // Lưu thông báo lỗi
    const email = localStorage.getItem("registerEmail"); // Lấy email từ bước trước

    /**
     * Hàm xử lý submit form đăng ký
     * @param {Object} data - Dữ liệu form chứa thông tin cá nhân và mật khẩu
     */
    const onSubmit = async (data) => {
        setIsLoading(true); // Bật trạng thái loading
        setErrorMessage(""); // Xóa thông báo lỗi cũ

        try {
            // Gọi API đăng ký tài khoản với thông tin đầy đủ
            const res = await registerUser({
                name: data.name,
                email: email, // Email từ bước trước
                phone: data.phone,
                dateOfBirth: data.date_of_birth,
                gender: data.gender,
                passwordHash: data.password,
            });

            if (res.status === 201) {
                toast.success("Đăng ký thành công!");
                // Xóa email khỏi localStorage sau khi đăng ký thành công
                localStorage.removeItem("registerEmail");
                // Chuyển hướng đến trang đăng nhập
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
            setIsLoading(false); // Tắt trạng thái loading
        }
    };

    // Render giao diện form đăng ký chi tiết
    return (
        <div className="page-container">
            {/* Header của trang */}
            <Header />
            
            {/* Container chính của form đăng ký */}
            <div className="register-container">
                <div className="register-form">
                    {/* Tiêu đề form */}
                    <h2 className="register-title">Đăng ký</h2>
                    <p className="register-subtitle">
                        Vui lòng điền thông tin để tạo tài khoản.
                    </p>

                    {/* Hiển thị thông báo lỗi nếu có */}
                    {errorMessage && (
                        <div className="alert alert-danger register-error">{errorMessage}</div>
                    )}

                    {/* Form đăng ký với layout responsive */}
                    <form onSubmit={handleSubmit(onSubmit)}>
                        {/* Row 1: Họ tên và Ngày sinh */}
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Họ tên:</label>
                                    <input
                                        className={`form-input ${errors.name ? 'input-error' : ''}`}
                                        {...register("name")}
                                        placeholder="Nhập họ và tên"
                                    />
                                    {/* Hiển thị lỗi validation cho họ tên */}
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
                                    {/* Hiển thị lỗi validation cho ngày sinh */}
                                    {errors.date_of_birth && (
                                        <p className="error-message">{errors.date_of_birth.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Row 2: Số điện thoại và Giới tính */}
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label className="form-label">Số điện thoại:</label>
                                    <input
                                        className={`form-input ${errors.phone ? 'input-error' : ''}`}
                                        {...register("phone")}
                                        placeholder="Nhập số điện thoại"
                                    />
                                    {/* Hiển thị lỗi validation cho số điện thoại */}
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
                                    {/* Hiển thị lỗi validation cho giới tính */}
                                    {errors.gender && (
                                        <p className="error-message">{errors.gender.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Row 3: Mật khẩu và Xác nhận mật khẩu */}
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
                                    {/* Hiển thị lỗi validation cho mật khẩu */}
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
                                    {/* Hiển thị lỗi validation cho xác nhận mật khẩu */}
                                    {errors.confirmPassword && (
                                        <p className="error-message">{errors.confirmPassword.message}</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Nút submit với loading state */}
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
                
                {/* Container hiển thị toast notifications */}
                <ToastContainer />
            </div>
            
            {/* Footer của trang */}
            <Footer />
        </div>
    );

}

export default UserRegisterForm;