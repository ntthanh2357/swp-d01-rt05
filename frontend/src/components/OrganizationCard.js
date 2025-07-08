import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/register.css';

/**
 * OrganizationCard component
 * Props:
 *  - organization: {
 *      organizationId, name, logoUrl, country, worldRank, organizationType, numberStudent, websiteUrl, description
 *    }
 */
function OrganizationCard({ organization }) {
    const navigate = useNavigate();

    return (
        <div className="card organization-card h-100 shadow-sm border-2 rounded-4 p-3">
            <div className="d-flex align-items-center mb-3">
                <img
                    src={organization.logoUrl || '/images/logo.png'}
                    alt={organization.name}
                    className="me-3"
                    style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8, background: '#fff' }}
                />
                <div>
                    <h5 className="fw-bold mb-1" style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/organization/${organization.organizationId}`, { state: { organization } })}>
                        {organization.name || 'Tên trường'}
                    </h5>
                    <div className="text-muted small">{organization.country || 'Quốc gia'} | {organization.organizationType || 'Loại trường'}</div>
                </div>
            </div>
            <ul className="list-unstyled mb-3">
                <li><i className="fas fa-trophy me-2"></i>Xếp hạng: {organization.worldRank ?? 'Không rõ'}</li>
                <li><i className="fas fa-users me-2"></i>Số sinh viên: {organization.numberStudent ?? 'Không rõ'}</li>
                <li><i className="fas fa-globe me-2"></i>Website: {organization.websiteUrl ? <a href={organization.websiteUrl} target="_blank" rel="noopener noreferrer">{organization.websiteUrl}</a> : 'Không rõ'}</li>
                <li><i className="fas fa-coins me-2"></i>Chi phí sinh hoạt TB: {organization.avgCostLiving ? organization.avgCostLiving + ' USD/năm' : 'Không rõ'}</li>
                <li><i className="fas fa-check-circle me-2"></i>Đã xác thực: {organization.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}</li>
                <li><i className="fas fa-calendar-plus me-2"></i>Ngày tạo: {organization.createdAt ? new Date(organization.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}</li>
                <li><i className="fas fa-calendar-alt me-2"></i>Ngày cập nhật: {organization.updatedAt ? new Date(organization.updatedAt).toLocaleDateString('vi-VN') : 'Không rõ'}</li>
                <li><i className="fas fa-university me-2"></i>Loại trường: {organization.organizationType || 'Không rõ'}</li>
            </ul>
            <div className="mb-2 text-truncate" title={organization.description}>{organization.description || 'Không có mô tả'}</div>
            <div className="d-grid gap-2">
                <button
                    className="btn btn-outline-dark rounded-pill"
                    onClick={() => navigate(`/organization/${organization.organizationId}`, { state: { organization } })}
                >
                    Xem chi tiết
                </button>
            </div>
        </div>
    );
}

export default OrganizationCard;
