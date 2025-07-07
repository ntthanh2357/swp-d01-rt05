import { User as UserIcon, Phone, Mail, Calendar, ShieldBan } from "lucide-react";
import moment from "moment";

function UserCard({ user, onBan }) {
    // Định dạng ngày sinh
    const dob = user.dateOfBirth
        ? moment(user.dateOfBirth).format("DD-MM-YYYY")
        : <span className="fst-italic">Chưa cập nhật</span>;

    return (
        <div className="card shadow-sm border-0 rounded-4 mb-4 px-2 py-3" style={{ maxWidth: 370 }}>
            <div className="d-flex align-items-center mb-3">
                <div className="me-3">
                    <div
                        className="bg-light rounded-circle d-flex align-items-center justify-content-center"
                        style={{ width: 60, height: 60 }}
                    >
                        <UserIcon size={36} className="text-secondary" />
                    </div>
                </div>
                <div>
                    <div className="fw-semibold">{user.name}</div>
                    <div className="text-muted small d-flex align-items-center">
                        <Mail size={15} className="me-2" />
                        {user.email}
                    </div>
                </div>
            </div>
            <div className="mb-2 d-flex align-items-center">
                <span className="badge bg-secondary me-2">{user.role}</span>
                <span className="badge bg-light text-dark border">{user.userId}</span>
            </div>
            <div className="mb-2 d-flex align-items-center text-muted">
                <Phone size={16} className="me-2" /> {user.phone || <span className="fst-italic">Chưa cập nhật</span>}
            </div>
            <div className="mb-2 d-flex align-items-center text-muted">
                <Calendar size={16} className="me-2" /> {dob}
            </div>
            <div className="d-grid mt-3">
                <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => onBan && onBan(user)}
                >
                    <ShieldBan size={16} className="me-2" /> Ban
                </button>
            </div>
        </div>
    );
}

export default UserCard;