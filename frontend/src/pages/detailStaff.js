import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPublicStaffProfile, postStaffReview } from '../services/staffApi';
import { UserContext } from '../contexts/UserContext';

function DetailStaff() {
    const { staffId } = useParams();
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);
    const [reviewForm, setReviewForm] = useState({ rating: 5, reviewContent: '', isAnonymous: false });
    const [submitting, setSubmitting] = useState(false);
    // Thay đổi: rating bằng icon sao lớn, hover/chọn trực tiếp
    const [hoverRating, setHoverRating] = useState(0);
    const maxReviewLength = 500;

    useEffect(() => {
        setLoading(true);
        getPublicStaffProfile(staffId)
            .then(res => {
                setProfile(res.data.profile);
                setReviews(res.data.reviews);
            })
            .catch(() => {
                setProfile(null);
                setReviews([]);
            })
            .finally(() => setLoading(false));
    }, [staffId]);

    const handleReviewChange = (e) => {
        const { name, value, type, checked } = e.target;
        setReviewForm(f => ({ ...f, [name]: type === 'checkbox' ? checked : value }));
    };
    const handleSubmitReview = async (e) => {
        e.preventDefault();
        if (!user || !user.isLoggedIn || user.role !== 'seeker') {
            alert('Bạn cần đăng nhập bằng tài khoản seeker để đánh giá!');
            return;
        }
        setSubmitting(true);
        try {
            await postStaffReview({
                token: user.accessToken,
                staffId,
                rating: Number(reviewForm.rating),
                reviewContent: reviewForm.reviewContent,
                isAnonymous: reviewForm.isAnonymous
            });
            setReviewForm({ rating: 5, reviewContent: '', isAnonymous: false });
            // Reload review
            const res = await getPublicStaffProfile(staffId);
            setReviews(res.data.reviews);
        } catch (err) {
            alert('Gửi đánh giá thất bại!');
        }
        setSubmitting(false);
    };

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <i
                    key={i}
                    className={`fa-star ${i <= rating ? 'fas text-warning' : 'far text-secondary'}`}
                    style={{ marginRight: 2 }}
                />
            );
        }
        return stars;
    };

    return (
        <>
            <Header />
            <main className="container py-5">
                {loading ? (
                    <div className="text-center my-5">Đang tải thông tin nhân viên...</div>
                ) : !profile ? (
                    <div className="text-center my-5">Không tìm thấy nhân viên.</div>
                ) : (
                    <div className="row justify-content-center">
                        <div className="col-lg-8">
                            <div className="card shadow-lg border-0 mb-4">
                                <div className="card-body p-4">
                                    <div className="d-flex align-items-center mb-4">
                                        <div className="avatar-circle me-4" style={{ width: 80, height: 80, borderRadius: '50%', background: '#e9ecef', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 700 }}>
                                            {profile.name ? profile.name.charAt(0).toUpperCase() : profile.staffId.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-grow-1">
                                            <h2 className="fw-bold mb-1" style={{ fontSize: '2rem' }}>{profile.name || profile.staffId}</h2>
                                            <div className="d-flex align-items-center mb-1">
                                                {renderStars(profile.rating || 0)}
                                                <span className="ms-2 text-warning fw-semibold">{profile.rating ? profile.rating.toFixed(1) : 'Chưa có'}</span>
                                                <span className="ms-3 text-muted">({profile.totalReviews || 0} đánh giá)</span>
                                            </div>
                                            <div className="text-muted">{profile.specialization || 'Chuyên môn chưa cập nhật'}</div>
                                        </div>
                                    </div>
                                    <div className="row mb-3">
                                        <div className="col-md-6 mb-2">
                                            <i className="fas fa-graduation-cap me-2 text-primary"></i>
                                            <strong>Trình độ:</strong> {profile.educationLevel || 'Chưa cập nhật'}
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <i className="fas fa-briefcase me-2 text-info"></i>
                                            <strong>Kinh nghiệm:</strong> {profile.experienceYears || 0} năm
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <i className="fas fa-users me-2 text-success"></i>
                                            <strong>Đang hỗ trợ:</strong> {profile.currentSeekerCount || 0}
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <i className="fas fa-envelope me-2 text-secondary"></i>
                                            <strong>Email:</strong> {profile.email || 'Chưa cập nhật'}
                                        </div>
                                        <div className="col-md-6 mb-2">
                                            <i className="fas fa-phone me-2 text-secondary"></i>
                                            <strong>Số điện thoại:</strong> {profile.phone || 'Chưa cập nhật'}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="card shadow-sm border-0 mb-4">
                                <div className="card-body p-4">
                                    <h4 className="fw-bold mb-3"><i className="fas fa-comments me-2 text-primary"></i>Đánh giá từ người dùng</h4>
                                    {reviews.length === 0 ? (
                                        <div className="text-muted">Chưa có đánh giá nào.</div>
                                    ) : (
                                        <div className="list-group mb-4">
                                            {reviews.map((review, idx) => (
                                                <div className="list-group-item border-0 border-bottom" key={idx}>
                                                    <div className="d-flex align-items-center mb-1">
                                                        <div className="avatar-circle me-3" style={{ width: 36, height: 36, borderRadius: '50%', background: '#f3f3f3', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 600 }}>
                                                            {review.isAnonymous ? <i className="fas fa-user-secret text-secondary"></i> : (review.seekerName ? review.seekerName.charAt(0).toUpperCase() : 'U')}
                                                        </div>
                                                        <span className="fw-semibold">
                                                            {review.isAnonymous ? 'Ẩn danh' : (review.seekerName ? review.seekerName : review.seekerId)}
                                                        </span>
                                                        <span className="ms-3">{renderStars(review.rating)}</span>
                                                        <span className="ms-2 text-warning">{review.rating}</span>
                                                        <span className="ms-auto text-muted" style={{ fontSize: '0.95em' }}>
                                                            {review.createdAt ? new Date(review.createdAt).toLocaleString('vi-VN') : ''}
                                                        </span>
                                                    </div>
                                                    <div className="mb-1 ps-5">{review.reviewContent}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {/* Form gửi đánh giá */}
                                    {user && user.isLoggedIn && user.role === 'seeker' && (
                                        <form onSubmit={handleSubmitReview} className="border rounded p-3 bg-light">
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Chọn số sao:</label>
                                                <div style={{ fontSize: 28 }}>
                                                    {[1,2,3,4,5].map(star => (
                                                        <i
                                                            key={star}
                                                            className={`fa-star ${star <= (hoverRating || reviewForm.rating) ? 'fas text-warning' : 'far text-secondary'}`}
                                                            style={{ cursor: 'pointer', marginRight: 4, transition: 'color 0.2s' }}
                                                            onMouseEnter={() => setHoverRating(star)}
                                                            onMouseLeave={() => setHoverRating(0)}
                                                            onClick={() => setReviewForm(f => ({ ...f, rating: star }))}
                                                        />
                                                    ))}
                                                    <span className="ms-2 fw-bold text-warning">{reviewForm.rating} sao</span>
                                                </div>
                                            </div>
                                            <div className="mb-3">
                                                <label className="form-label fw-semibold">Nội dung đánh giá:</label>
                                                <textarea
                                                    className="form-control"
                                                    name="reviewContent"
                                                    value={reviewForm.reviewContent}
                                                    onChange={handleReviewChange}
                                                    rows={4}
                                                    required
                                                    maxLength={maxReviewLength}
                                                    style={{ borderColor: '#ffc107', boxShadow: '0 0 0 0.1rem #ffc10733' }}
                                                    placeholder="Hãy chia sẻ trải nghiệm của bạn về nhân viên này..."
                                                />
                                                <div className="text-end small text-muted">
                                                    {reviewForm.reviewContent.length}/{maxReviewLength} ký tự
                                                </div>
                                            </div>
                                            <div className="form-check mb-3">
                                                <input className="form-check-input" type="checkbox" name="isAnonymous" id="isAnonymous" checked={reviewForm.isAnonymous} onChange={handleReviewChange} />
                                                <label className="form-check-label" htmlFor="isAnonymous">Ẩn danh</label>
                                            </div>
                                            <button className="btn btn-primary btn-lg px-4" type="submit" disabled={submitting}>{submitting ? 'Đang gửi...' : 'Gửi đánh giá'}</button>
                                        </form>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}

export default DetailStaff; 