import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/organizationCard.css'; // Tạm dùng lại style card đẹp

function StaffCard({ staff }) {
    const navigate = useNavigate();

    const truncateText = (text, maxLength = 40) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="card organization-card h-100 shadow-sm border-2 rounded-4 p-3 d-flex flex-column">
            <div className="d-flex align-items-start mb-3">
                <div className="avatar-circle me-3 flex-shrink-0" style={{ width: 60, height: 60, borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 700 }}>
                    {staff.name ? staff.name.charAt(0).toUpperCase() : staff.staffId.charAt(0).toUpperCase()}
                </div>
                <div className="flex-grow-1">
                    <h5 className="fw-bold mb-1" style={{ cursor: 'pointer', fontSize: '1.1rem', lineHeight: '1.3' }}
                        onClick={() => navigate(`/detail-staff/${staff.staffId}`)}>
                        {truncateText(staff.name || staff.staffId, 40)}
                    </h5>
                    <div className="text-muted small mb-1">
                        <i className="fas fa-user-graduate me-1"></i>
                        {staff.specialization || 'Chuyên môn chưa cập nhật'}
                    </div>
                    <div className="text-muted small">
                        <i className="fas fa-graduation-cap me-1"></i>
                        {staff.educationLevel || 'Trình độ chưa cập nhật'}
                    </div>
                </div>
            </div>

            <hr className="my-3" />

            <div className="flex-grow-1">
                <div className="row g-2 mb-3">
                    <div className="col-6">
                        <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-briefcase me-2 text-info"></i>
                            <small className="fw-semibold">Kinh nghiệm: {staff.experienceYears || 0} năm</small>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-users me-2 text-success"></i>
                            <small className="fw-semibold">Đã hỗ trợ: {staff.currentSeekerCount || 0}</small>
                        </div>
                    </div>
                </div>
                <div className="mb-3">
                    <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-star me-2 text-warning"></i>
                        <small className="fw-semibold">Rating: {staff.rating ? staff.rating.toFixed(1) : 'Chưa có'}</small>
                    </div>
                    <div className="d-flex align-items-center mb-2">
                        <i className="fas fa-comment-dots me-2 text-primary"></i>
                        <small className="fw-semibold">{staff.totalReviews || 0} đánh giá</small>
                    </div>
                </div>
            </div>

            <div className="mt-auto">
                <button
                    className="btn btn-outline-primary rounded-pill w-100"
                    onClick={() => navigate(`/detail-staff/${staff.staffId}`)}
                >
                    Xem chi tiết
                </button>
            </div>
        </div>
    );
}

export default StaffCard; 