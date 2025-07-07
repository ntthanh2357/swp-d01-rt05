import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { UserContext } from "../contexts/UserContext";
import { seekerProfile, sendUpdateSeekerProfileOtp, verifyUpdateSeekerProfileOtp, seekerProfileUpdate } from "../services/seekerApi";
import { sendUpdateUserProfileOtp, verifyUpdateUserProfileOtp, userProfileUpdate } from "../services/userApi";
import { changePassword } from "../services/authApi";

import Header from "../components/Header";
import Footer from "../components/Footer";
import OtpModal from "../components/OtpModal";
import ChangePasswordModal from "../components/ChangePasswordModal";

import "../css/user-profile.css";

const profileSchema = yup.object().shape({
    name: yup.string().required("Vui lòng nhập họ tên"),
    phone: yup
        .string()
        .required("Vui lòng nhập số điện thoại")
        .matches(/^[0-9]{9,15}$/, "Số điện thoại không hợp lệ"),
    date_of_birth: yup
        .string()
        .required("Vui lòng chọn ngày sinh"),
    gender: yup
        .string()
        .oneOf(["male", "female", ""], "Giới tính không hợp lệ"),
    email: yup
        .string()
        .email("Email không hợp lệ")
        .required("Vui lòng nhập email"),
});

function UserProfile() {
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editPersonal, setEditPersonal] = useState(false);
    const [showOtpModal, setShowOtpModal] = useState(false);
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState("");
    const [pendingUpdateType, setPendingUpdateType] = useState("");
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
    const [changePasswordLoading, setChangePasswordLoading] = useState(false);
    const [changePasswordError, setChangePasswordError] = useState("");
    const [formData, setFormData] = useState(null);

    const {
        register,
        handleSubmit,
        setValue,
        reset,
        getValues,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(profileSchema),
        defaultValues: {}
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!user || !user.accessToken) {
                    setLoading(false);
                    return;
                }
                const response = await seekerProfile({
                    token: user.accessToken
                });
                if (response.status !== 200) {
                    throw new Error("Failed to fetch profile");
                }
                setProfile(response.data);
                reset(response.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [user, reset]);

    if (loading) {
        return (
            <div>
                <Header />
                <div className="container">
                    <div className="loading-container">
                        <div>Đang tải thông tin...</div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    if (!profile) {
        return (
            <div>
                <Header />
                <div className="container">
                    <div className="error-container">
                        <div>Không tìm thấy thông tin người dùng</div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    const handleChange = (e) => {
        setValue(e.target.name, e.target.value);
    };

    const onSendOtp = async (data, type) => {
        setOtpError("");
        setOtpLoading(true);
        try {
            if (type === "personal") {
                await sendUpdateUserProfileOtp({ email: data.email });
            } else {
                await sendUpdateSeekerProfileOtp({ email: profile.email });
            }
            setShowOtpModal(true);
            setPendingUpdateType(type);
            setFormData(data);
        } catch (err) {
            setOtpError("Không gửi được OTP. Vui lòng thử lại.");
        }
        setOtpLoading(false);
    };

    const handleSubmitForm = (data) => {
        onSendOtp(data, "personal");
    };

    const handleSubmitOtp = async (otp) => {
        setOtpLoading(true);
        setOtpError("");
        try {
            let verified = false;
            const data = formData || getValues();

            if (pendingUpdateType === "personal") {
                const res = await verifyUpdateUserProfileOtp({ email: data.email, otp });
                verified = res.status === 200;
            } else {
                const res = await verifyUpdateSeekerProfileOtp({ email: profile.email, otp });
                verified = res.status === 200;
            }
            if (!verified) throw new Error();

            if (pendingUpdateType === "personal") {
                await userProfileUpdate({
                    name: data.name,
                    phone: data.phone,
                    date_of_birth: data.date_of_birth,
                    gender: data.gender,
                    email: data.email,
                    token: user.accessToken
                });
                toast.success("Cập nhật thông tin thành công!");
            }

            setShowOtpModal(false);
            setEditPersonal(false);
            setFormData(null);
            const response = await seekerProfile({ token: user.accessToken });
            setProfile(response.data);
            reset(response.data);
        } catch (err) {
            setOtpError("OTP không đúng hoặc đã hết hạn.");
        }
        setOtpLoading(false);
    };

    const handleChangePassword = async (data) => {
        setChangePasswordLoading(true);
        setChangePasswordError("");
        try {
            const res = await changePassword({
                email: profile.email,
                oldPassword: data.old_password,
                newPassword: data.new_password,
                token: user.accessToken
            });
            if (res.status === 200) {
                toast.success("Đổi mật khẩu thành công!");
                setShowChangePasswordModal(false);
            }
        } catch (err) {
            setChangePasswordError("Đổi mật khẩu thất bại. Vui lòng thử lại.");
        }
        setChangePasswordLoading(false);
    };

    return (
        <div>
            <Header />
            <div className="container user-profile-container">
                <h2 className="page-title">Thông tin cá nhân</h2>

                <div className="user-id-display">
                    <span className="label">ID người dùng:</span>
                    <span className="value">{profile.user_id || "Chưa cập nhật"}</span>
                </div>

                <div className="profile-section">
                    <div className="profile-header">
                        <h5>Thông tin cá nhân</h5>
                        <div>
                            {editPersonal ? (
                                <>
                                    <button
                                        className="btn btn-success me-2"
                                        onClick={handleSubmit(handleSubmitForm)}
                                        disabled={otpLoading}
                                    >
                                        {otpLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => {
                                            setEditPersonal(false);
                                            reset(profile);
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={() => setEditPersonal(true)}
                                >
                                    Chỉnh sửa
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="profile-content">
                        {editPersonal ? (
                            <form id="personal-form">
                                <table className="table profile-table">
                                    <tbody>
                                        <tr>
                                            <td>Họ và tên</td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    {...register("name")}
                                                    onChange={handleChange}
                                                    placeholder="Nhập họ và tên"
                                                />
                                                {errors.name && (
                                                    <span className="text-danger">{errors.name.message}</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Email</td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    {...register("email")}
                                                    disabled
                                                    style={{ backgroundColor: '#f8f9fa' }}
                                                />
                                                {errors.email && (
                                                    <span className="text-danger">{errors.email.message}</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Số điện thoại</td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    {...register("phone")}
                                                    onChange={handleChange}
                                                    placeholder="Nhập số điện thoại"
                                                />
                                                {errors.phone && (
                                                    <span className="text-danger">{errors.phone.message}</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Ngày sinh</td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    type="date"
                                                    {...register("date_of_birth")}
                                                    onChange={handleChange}
                                                />
                                                {errors.date_of_birth && (
                                                    <span className="text-danger">{errors.date_of_birth.message}</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Giới tính</td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    {...register("gender")}
                                                    onChange={handleChange}
                                                >
                                                    <option value="">Chọn giới tính</option>
                                                    <option value="male">Nam</option>
                                                    <option value="female">Nữ</option>
                                                </select>
                                                {errors.gender && (
                                                    <span className="text-danger">{errors.gender.message}</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Mật khẩu</td>
                                            <td>
                                                <button
                                                    type="button"
                                                    className="btn btn-outline-secondary"
                                                    onClick={() => setShowChangePasswordModal(true)}
                                                >
                                                    Đổi mật khẩu
                                                </button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        ) : (
                            <table className="table profile-table">
                                <tbody>
                                    <tr>
                                        <td>Họ và tên</td>
                                        <td>{profile.name || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td>Email</td>
                                        <td>{profile.email || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td>Số điện thoại</td>
                                        <td>{profile.phone || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td>Ngày sinh</td>
                                        <td>{profile.date_of_birth || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td>Giới tính</td>
                                        <td>
                                            {profile.gender === "male"
                                                ? "Nam"
                                                : profile.gender === "female"
                                                    ? "Nữ"
                                                    : "Chưa cập nhật"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>Mật khẩu</td>
                                        <td>
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary"
                                                onClick={() => setShowChangePasswordModal(true)}
                                            >
                                                Đổi mật khẩu
                                            </button>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>

            <OtpModal
                show={showOtpModal}
                onClose={() => setShowOtpModal(false)}
                onSubmitOtp={handleSubmitOtp}
                isLoading={otpLoading}
                errorMessage={otpError}
            />

            <ChangePasswordModal
                show={showChangePasswordModal}
                onClose={() => setShowChangePasswordModal(false)}
                onSubmit={handleChangePassword}
                isLoading={changePasswordLoading}
                errorMessage={changePasswordError}
            />

            <Footer />
        </div>
    );
}

export default UserProfile;