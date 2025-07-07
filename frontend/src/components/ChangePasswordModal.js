import React from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";

const schema = yup.object().shape({
    old_password: yup.string().required("Vui lòng nhập mật khẩu hiện tại"),
    new_password: yup
        .string()
        .required("Vui lòng nhập mật khẩu mới")
        .min(6, "Mật khẩu mới phải có ít nhất 6 ký tự"),
    confirm_password: yup
        .string()
        .oneOf([yup.ref("new_password")], "Mật khẩu xác nhận không khớp")
        .required("Vui lòng xác nhận mật khẩu mới"),
});

function ChangePasswordModal({ show, onClose, onSubmit, isLoading, errorMessage }) {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            old_password: "",
            new_password: "",
            confirm_password: ""
        }
    });

    // Reset form when modal closes
    React.useEffect(() => {
        if (!show) reset();
    }, [show, reset]);

    if (!show) return null;

    return (
        <div className="modal show d-block" tabIndex="-1" style={{ background: "rgba(0,0,0,0.3)" }}>
            <div className="modal-dialog">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Đổi mật khẩu</h5>
                            <button type="button" className="btn-close" onClick={onClose}></button>
                        </div>
                        <div className="modal-body">
                            <div className="mb-3">
                                <label className="form-label">Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.old_password ? "is-invalid" : ""}`}
                                    {...register("old_password")}
                                />
                                <div className="invalid-feedback">{errors.old_password?.message}</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.new_password ? "is-invalid" : ""}`}
                                    {...register("new_password")}
                                />
                                <div className="invalid-feedback">{errors.new_password?.message}</div>
                            </div>
                            <div className="mb-3">
                                <label className="form-label">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    className={`form-control ${errors.confirm_password ? "is-invalid" : ""}`}
                                    {...register("confirm_password")}
                                />
                                <div className="invalid-feedback">{errors.confirm_password?.message}</div>
                            </div>
                            {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isLoading}>
                                Hủy
                            </button>
                            <button type="submit" className="btn btn-primary" disabled={isLoading}>
                                {isLoading ? "Đang lưu..." : "Đổi mật khẩu"}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default ChangePasswordModal;