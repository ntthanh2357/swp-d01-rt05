import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "react-toastify/dist/ReactToastify.css";
import '../css/scholarshipCard.css';

/**
 * ScholarshipCard component
 * Props:
 *  - scholarship: {
 *      scholarshipId, title, organizationName, organizationWorldRank, featured,
 *      fieldsOfStudy, countries, applicationDeadline, languageRequirements,
 *      amount, currency, ...
 *    }
 */
function ScholarshipCard({ scholarship }) {
    const [liked, setLiked] = useState(false);
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

    const formatAmount = (amount, currency) => {
        if (amount == null) return 'Không rõ';
        return amount.toLocaleString('vi-VN') + (currency ? ` ${currency}` : '');
    };

    const parseJson = (jsonStr) => {
        if (!jsonStr) return 'Không rõ';
        try {
            const arr = JSON.parse(jsonStr);
            if (Array.isArray(arr)) return arr.join(', ');
            return jsonStr;
        } catch {
            return jsonStr;
        }
    };

    const truncateText = (text, maxLength = 50) => {
        if (!text) return 'Không rõ';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    return (
        <div className="card scholarship-card h-100 shadow-sm border-2 rounded-4 p-3 d-flex flex-column">
            {/* Header với badge và like button */}
            <div className="d-flex justify-content-between align-items-start mb-3">
                <div className="flex-grow-1 me-2">
                    {scholarship?.featured && (
                        <span className="badge bg-warning text-dark mb-2 d-inline-block">Nổi bật</span>
                    )}
                    <h5 className="fw-bold mb-1" style={{ cursor: 'pointer', fontSize: '1.1rem', lineHeight: '1.3' }}
                        onClick={() => navigate(`/detailRoute/${scholarship.scholarshipId}`, {
                            state: { scholarship }
                        })}>
                        {truncateText(scholarship?.title || 'Tên học bổng', 60)}
                    </h5>
                    <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                        {truncateText(scholarship?.organizationName || 'Đơn vị tài trợ', 40)}
                    </p>
                </div>
                <i
                    className={`fa${liked ? 's' : 'r'} fa-heart fa-lg flex-shrink-0`}
                    style={{ color: liked ? 'hotpink' : 'gray', cursor: 'pointer', marginTop: '2px' }}
                    onClick={() => setLiked(!liked)}
                    title={liked ? "Bỏ yêu thích" : "Yêu thích"}
                ></i>
            </div>

            <hr className="my-3" />

            {/* Thông tin chính */}
            <div className="flex-grow-1">
                <div className="row g-2 mb-3">
                    <div className="col-6">
                        <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-dollar-sign me-2 text-success"></i>
                            <small className="fw-semibold">{formatAmount(scholarship?.amount, scholarship?.currency)}</small>
                        </div>
                    </div>
                    <div className="col-6">
                        <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-calendar-alt me-2 text-danger"></i>
                            <small className="fw-semibold">{formatDate(scholarship?.applicationDeadline)}</small>
                        </div>
                    </div>
                </div>

                {/* Thông tin chi tiết */}
                <div className="mb-3">
                    <div className="d-flex align-items-start mb-2">
                        <i className="fas fa-graduation-cap me-2 text-primary mt-1"></i>
                        <small className="flex-grow-1">
                            <strong>Lĩnh vực:</strong> {truncateText(parseJson(scholarship?.fieldsOfStudy), 35)}
                        </small>
                    </div>
                    <div className="d-flex align-items-start mb-2">
                        <i className="fas fa-map-marker-alt me-2 text-info mt-1"></i>
                        <small className="flex-grow-1">
                            <strong>Quốc gia:</strong> {truncateText(parseJson(scholarship?.countries), 35)}
                        </small>
                    </div>
                    {scholarship?.organizationWorldRank && (
                        <div className="d-flex align-items-center mb-2">
                            <i className="fas fa-trophy me-2 text-warning"></i>
                            <small className="fw-semibold">Xếp hạng: {scholarship.organizationWorldRank}</small>
                        </div>
                    )}
                </div>
            </div>

            {/* Button xem chi tiết */}
            <div className="mt-auto">
                <button
                    className="btn btn-outline-primary rounded-pill w-100"
                    onClick={() => navigate(`/detailRoute/${scholarship.scholarshipId}`, {
                        state: { scholarship }
                    })}
                >
                    Xem chi tiết
                </button>
            </div>
        </div>
    );
}

export default ScholarshipCard;