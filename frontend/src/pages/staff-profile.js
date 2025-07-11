import { useEffect, useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { UserContext } from "../contexts/UserContext";
import {
    getStaffProfile,
    updateStaffProfile,
    sendUpdateStaffProfileOtp,
    verifyUpdateStaffProfileOtp
} from "../services/staffApi";
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
    date_of_birth: yup.string().required("Vui lòng chọn ngày sinh"),
    gender: yup.string().oneOf(["male", "female", ""], "Giới tính không hợp lệ"),
    email: yup.string().email("Email không hợp lệ").required("Vui lòng nhập email"),
});

const professionalSchema = yup.object().shape({
    education_level: yup.string().required("Vui lòng chọn trình độ học vấn"),
    experience_years: yup.number().min(0, "Số năm kinh nghiệm không hợp lệ").required("Vui lòng nhập số năm kinh nghiệm"),
    specialization: yup.string().required("Vui lòng nhập chuyên môn"),
});

function StaffProfile() {
    const { user } = useContext(UserContext);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [editPersonal, setEditPersonal] = useState(false);
    const [editProfessional, setEditProfessional] = useState(false);
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

    const {
        register: registerProfessional,
        handleSubmit: handleSubmitProfessional,
        setValue: setValueProfessional,
        reset: resetProfessional,
        getValues: getValuesProfessional,
        formState: { errors: errorsProfessional }
    } = useForm({
        resolver: yupResolver(professionalSchema),
        defaultValues: {}
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                if (!user || !user.accessToken) {
                    setLoading(false);
                    return;
                }
                const response = await getStaffProfile({ token: user.accessToken });
                if (response.status !== 200) {
                    throw new Error("Failed to fetch profile");
                }
                setProfile(response.data);
                // Map dateOfBirthString to date_of_birth for form
                const formData = {
                    ...response.data,
                    date_of_birth: response.data.dateOfBirthString
                };
                reset(formData);
                
                // Reset professional form
                const professionalFormData = {
                    education_level: response.data.educationLevel,
                    experience_years: response.data.experienceYears,
                    specialization: response.data.specialization
                };
                resetProfessional(professionalFormData);
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

    const onSendOtp = async (data, type = "personal") => {
        setOtpError("");
        setOtpLoading(true);
        try {
            await sendUpdateStaffProfileOtp({ email: data.email || profile.email });
            setShowOtpModal(true);
            setPendingUpdateType(type);
            setFormData(data);
        } catch (err) {
            setOtpError("Không gửi được OTP. Vui lòng thử lại.");
        }
        setOtpLoading(false);
    };

    const handleSubmitForm = (data) => {
        onSendOtp(data);
    };

    const handleSubmitProfessionalForm = (data) => {
        onSendOtp(data, "professional");
    };

    const handleSubmitOtp = async (otp) => {
        setOtpLoading(true);
        setOtpError("");
        try {
            const data = formData || getValues();
            const res = await verifyUpdateStaffProfileOtp({ email: data.email || profile.email, otp });

            if (res.status !== 200) throw new Error();

            if (pendingUpdateType === "personal") {
                await updateStaffProfile({
                    education_level: profile.educationLevel,
                    experience_years: profile.experienceYears,
                    specialization: profile.specialization,
                    name: data.name,
                    phone: data.phone,
                    date_of_birth: data.date_of_birth,
                    gender: data.gender,
                    email: data.email,
                    token: user.accessToken
                });
            } else if (pendingUpdateType === "professional") {
                await updateStaffProfile({
                    education_level: data.education_level,
                    experience_years: data.experience_years,
                    specialization: data.specialization,
                    name: profile.name,
                    phone: profile.phone,
                    date_of_birth: profile.dateOfBirthString,
                    gender: profile.gender,
                    email: profile.email,
                    token: user.accessToken
                });
            }

            toast.success("Cập nhật thông tin thành công!");

            setShowOtpModal(false);
            setEditPersonal(false);
            setEditProfessional(false);
            setFormData(null);

            const response = await getStaffProfile({ token: user.accessToken });
            setProfile(response.data);
            // Map dateOfBirthString to date_of_birth for form
            const formData = {
                ...response.data,
                date_of_birth: response.data.dateOfBirthString
            };
            reset(formData);
            
            // Reset professional form
            const professionalFormData = {
                education_level: response.data.educationLevel,
                experience_years: response.data.experienceYears,
                specialization: response.data.specialization
            };
            resetProfessional(professionalFormData);
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
                <h2 className="page-title">Thông tin nhân viên</h2>

                <div className="user-id-display">
                    <span className="label">ID nhân viên:</span>
                    <span className="value">{profile.staffId || "Chưa cập nhật"}</span>
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
                                            // Map dateOfBirthString to date_of_birth for form
                                            const formData = {
                                                ...profile,
                                                date_of_birth: profile.dateOfBirthString
                                            };
                                            reset(formData);
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
                                                {errors.name && <span className="text-danger">{errors.name.message}</span>}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Email</td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    {...register("email")}
                                                    disabled
                                                    style={{ backgroundColor: "#f8f9fa" }}
                                                />
                                                {errors.email && <span className="text-danger">{errors.email.message}</span>}
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
                                                {errors.phone && <span className="text-danger">{errors.phone.message}</span>}
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
                                                {errors.gender && <span className="text-danger">{errors.gender.message}</span>}
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
                                        <td>{profile.dateOfBirthString || "Chưa cập nhật"}</td>
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

                <div className="profile-section">
                    <div className="profile-header">
                        <h5>Thông tin chuyên môn</h5>
                        <div>
                            {editProfessional ? (
                                <>
                                    <button
                                        className="btn btn-success me-2"
                                        onClick={handleSubmitProfessional(handleSubmitProfessionalForm)}
                                        disabled={otpLoading}
                                    >
                                        {otpLoading ? "Đang xử lý..." : "Lưu thay đổi"}
                                    </button>
                                    <button
                                        className="btn btn-outline-secondary"
                                        type="button"
                                        onClick={() => {
                                            setEditProfessional(false);
                                            const professionalFormData = {
                                                education_level: profile.educationLevel,
                                                experience_years: profile.experienceYears,
                                                specialization: profile.specialization
                                            };
                                            resetProfessional(professionalFormData);
                                        }}
                                    >
                                        Hủy
                                    </button>
                                </>
                            ) : (
                                <button
                                    className="btn btn-primary"
                                    type="button"
                                    onClick={() => setEditProfessional(true)}
                                >
                                    Chỉnh sửa
                                </button>
                            )}
                        </div>
                    </div>

                    <div className="profile-content">
                        {editProfessional ? (
                            <form id="professional-form">
                                <table className="table profile-table">
                                    <tbody>
                                        <tr>
                                            <td>Trình độ học vấn</td>
                                            <td>
                                                <select
                                                    className="form-select"
                                                    {...registerProfessional("education_level")}
                                                >
                                                    <option value="">Chọn trình độ</option>
                                                    <option value="Cử nhân">Cử nhân</option>
                                                    <option value="Thạc sĩ">Thạc sĩ</option>
                                                    <option value="Tiến sĩ">Tiến sĩ</option>
                                                    <option value="Khác">Khác</option>
                                                </select>
                                                {errorsProfessional.education_level && (
                                                    <span className="text-danger">{errorsProfessional.education_level.message}</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Số năm kinh nghiệm</td>
                                            <td>
                                                <input
                                                    className="form-control"
                                                    type="number"
                                                    min="0"
                                                    {...registerProfessional("experience_years")}
                                                    placeholder="Nhập số năm kinh nghiệm"
                                                />
                                                {errorsProfessional.experience_years && (
                                                    <span className="text-danger">{errorsProfessional.experience_years.message}</span>
                                                )}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>Chuyên môn</td>
                                            <td>
                                                <textarea
                                                    className="form-control"
                                                    rows="3"
                                                    {...registerProfessional("specialization")}
                                                    placeholder="Nhập chuyên môn của bạn"
                                                />
                                                {errorsProfessional.specialization && (
                                                    <span className="text-danger">{errorsProfessional.specialization.message}</span>
                                                )}
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </form>
                        ) : (
                            <table className="table profile-table">
                                <tbody>
                                    <tr>
                                        <td>Trình độ học vấn</td>
                                        <td>{profile.educationLevel || "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td>Số năm kinh nghiệm</td>
                                        <td>{profile.experienceYears !== null ? profile.experienceYears : "Chưa cập nhật"}</td>
                                    </tr>
                                    <tr>
                                        <td>Chuyên môn</td>
                                        <td>{profile.specialization || "Chưa cập nhật"}</td>
                                    </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>

                <div className="profile-section">
                    <div className="profile-header">
                        <h5>Thống kê & Đánh giá</h5>
                    </div>
                    <div className="profile-content">
                        <div className="row">
                            <div className="col-md-6 mb-3">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <div className="mb-2">
                                            <span className="text-warning fs-1">⭐</span>
                                        </div>
                                        <div className="fw-bold fs-3 text-primary">
                                            {profile.rating !== null ? profile.rating.toFixed(1) : "0.0"}
                                        </div>
                                        <div className="text-muted small">Điểm đánh giá trung bình</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 mb-3">
                                <div className="card border-0 shadow-sm h-100">
                                    <div className="card-body text-center">
                                        <div className="mb-2">
                                            <span className="text-info fs-1">📊</span>
                                        </div>
                                        <div className="fw-bold fs-3 text-primary">
                                            {profile.totalReviews !== null ? profile.totalReviews : "0"}
                                        </div>
                                        <div className="text-muted small">Tổng số đánh giá</div>
                                    </div>
                                </div>
                            </div>
                        </div>
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

export default StaffProfile;
