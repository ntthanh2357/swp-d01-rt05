import { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { UserContext } from '../contexts/UserContext';
import { useFavorites } from '../contexts/FavoriteContext';
import { addFavoriteScholarship, removeFavoriteScholarship } from '../services/seekerApi';
import "react-toastify/dist/ReactToastify.css";
import '../css/scholarshipCard.css';

/**
 * ScholarshipCard component
 * Props:
 *  - scholarship: { ... }
 *  - liked: boolean (optional)
 *  - onLikeChange: function (optional)
 */
function ScholarshipCard({ scholarship, liked: likedProp, onLikeChange }) {
    const { user } = useContext(UserContext);
    const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    // Sử dụng context hoặc prop, ưu tiên context
    const liked = likedProp !== undefined ? likedProp : isFavorite(scholarship?.scholarshipId);

    const handleLike = async () => {
        if (!user || !user.isLoggedIn) {
            toast.info('Bạn cần đăng nhập để sử dụng chức năng này!');
            return;
        }
        if (loading) return;
        setLoading(true);
        try {
            if (!liked) {
                console.log('Adding to favorites:', scholarship.scholarshipId);
                await addFavoriteScholarship(user.accessToken, scholarship.scholarshipId);
                addToFavorites(scholarship.scholarshipId);
                toast.success('Đã thêm vào mục yêu thích!');
                if (onLikeChange) onLikeChange(true);
            } else {
                console.log('Removing from favorites:', scholarship.scholarshipId);
                const response = await removeFavoriteScholarship(user.accessToken, scholarship.scholarshipId);
                console.log('Remove response:', response);
                removeFromFavorites(scholarship.scholarshipId);
                toast.info('Đã bỏ khỏi mục yêu thích!');
                if (onLikeChange) onLikeChange(false);
            }
        } catch (err) {
            console.error('Error handling like:', err);
            console.error('Error response:', err.response?.data);
            toast.error('Có lỗi xảy ra, vui lòng thử lại!');
        }
        setLoading(false);
    };

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
                    style={{ color: liked ? 'hotpink' : 'gray', cursor: loading ? 'wait' : 'pointer', marginTop: '2px' }}
                    onClick={handleLike}
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