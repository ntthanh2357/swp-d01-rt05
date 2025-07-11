import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/organizationCard.css';

/**
 * OrganizationCard component
 * Props:
 *  - organization: {
 *      organizationId, name, logoUrl, country, worldRank, organizationType, numberStudent, websiteUrl, description
 *    }
 */
function OrganizationCard({ organization }) {
    const navigate = useNavigate();

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Không rõ';
        try {
            const date = new Date(dateStr);
            return date.toLocaleDateString('vi-VN');
        } catch {
            return 'Không rõ';
        }
    };

    const formatNumber = (num) => {
        if (num == null) return 'Không rõ';
        return num.toLocaleString('vi-VN');
    };

    const formatAmount = (amount) => {
        if (amount == null) return 'Không rõ';
        return amount.toLocaleString('vi-VN') + ' USD/năm';
    };

    const truncateText = (text, maxLength = 50) => {
        if (!text) return 'Không có mô tả';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const getWebsiteDomain = (url) => {
        if (!url) return 'Không rõ';
        try {
            const domain = new URL(url).hostname;
            return domain.replace('www.', '');
        } catch {
            return url.length > 20 ? url.substring(0, 20) + '...' : url;
        }
    };

    return (
        <div className="card organization-card h-100 shadow-sm border-2 rounded-4 p-3 d-flex flex-column">
            {/* Header với logo và tên trường */}
            <div className="d-flex align-items-start mb-3">
                <img
                    src={organization.logoUrl || '/images/logo.png'}
                    alt={organization.name || 'Tên trường'}
                    className="me-3 flex-shrink-0"
                    style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 8, background: '#fff', border: '1px solid #e9ecef' }}
                    onError={(e) => {
                        e.target.src = '/images/logo.png';
                    }}
                />
                <div className="flex-grow-1">
                    <h5 className="fw-bold mb-1" style={{ cursor: 'pointer', fontSize: '1.1rem', lineHeight: '1.3' }}
                        onClick={() => navigate(`/organization/${organization.organizationId}`, { state: { organization } })}>
                        {truncateText(organization.name || 'Tên trường', 40)}
                    </h5>
                    <div className="text-muted small mb-1">
                        <i className="fas fa-map-marker-alt me-1"></i>
                        {organization.country || 'Quốc gia'}
                    </div>
                    <div className="text-muted small">
                        <i className="fas fa-university me-1"></i>
                        {organization.organizationType || 'Loại trường'}
                    </div>
                </div>
            </div>

            <hr className="my-3" />

            {/* Thông tin chính */}
            <div className="flex-grow-1">
                <div className="row g-2 mb-3">
                    <div className="col-6">
                        <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-trophy me-2 text-warning"></i>
                            <small className="fw-semibold">Xếp hạng: {formatNumber(organization.worldRank)}</small>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-users me-2 text-info"></i>
                            <small className="fw-semibold">{formatNumber(organization.numberStudent)} sinh viên</small>
                        </div>
                    </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="mb-3">
                    {organization.avgCostLiving && (
                        <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-coins me-2 text-success"></i>
                            <small className="flex-grow-1">
                                <strong>Chi phí sinh hoạt:</strong> {formatAmount(organization.avgCostLiving)}
                            </small>
                        </div>
                    )}
                    
                    {organization.websiteUrl && (
                        <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-globe me-2 text-primary"></i>
                            <small className="flex-grow-1">
                                <strong>Website:</strong> 
                                <a 
                                    href={organization.websiteUrl} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-decoration-none ms-1"
                                    title={organization.websiteUrl}
                                >
                                    {getWebsiteDomain(organization.websiteUrl)}
                                </a>
                            </small>
                        </div>
                    )}

                    {organization.isVerified !== undefined && (
                        <div className="d-flex align-items-center mb-2">
                            <i className={`fas fa-check-circle me-2 ${organization.isVerified ? 'text-success' : 'text-muted'}`}></i>
                            <small className="fw-semibold">
                                {organization.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                            </small>
                        </div>
                    )}
                </div>

                {/* Mô tả */}
                {organization.description && (
                    <div className="mb-3">
                        <small className="text-muted">
                            {truncateText(organization.description, 80)}
                        </small>
                    </div>
                )}
            </div>

            {/* Button xem chi tiết */}
            <div className="mt-auto">
                <button
                    className="btn btn-outline-primary rounded-pill w-100"
                    onClick={() => navigate(`/organization/${organization.organizationId}`, { state: { organization } })}
                >
                    Xem chi tiết
                </button>
            </div>
        </div>
    );
}

export default OrganizationCard;
