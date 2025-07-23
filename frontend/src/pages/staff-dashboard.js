import React, { useContext, useEffect, useState } from "react";
import StaffActivityChart from "../components/StaffActivityChart";
import ActiveSeekersModal from "../components/ActiveSeekersModal";
import SeekerDetailModal from "../components/SeekerDetailModal";
import { getStaffOverview, getStaffFeedback, getActiveSeekers, getSeekerDetail } from "../services/staffApi";
import { UserContext } from "../contexts/UserContext";
import { Card, Row, Col, Spinner, Table, Container, Button } from "react-bootstrap";
import { User, Mail, Clock, Award, Route } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from '../components/Header';
import "../css/staff-dashboard.css"; // import CSS hiệu ứng

function StaffDashboard({ staffId }) {
    const { user: contextUser, logout } = useContext(UserContext);
    const navigate = useNavigate();
    const [overview, setOverview] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [ratingFilter, setRatingFilter] = useState('all');

    // State cho modal active seekers
    const [showActiveSeekersModal, setShowActiveSeekersModal] = useState(false);
    const [activeSeekers, setActiveSeekers] = useState([]);
    const [loadingSeekers, setLoadingSeekers] = useState(false);

    // State cho modal seeker detail
    const [showSeekerDetailModal, setShowSeekerDetailModal] = useState(false);
    const [selectedSeeker, setSelectedSeeker] = useState(null);
    const [loadingSeekerDetail, setLoadingSeekerDetail] = useState(false);

    useEffect(() => {
        setLoading(true);
        setError(null);
        if (contextUser.accessToken === null && !contextUser.isLoggedIn) {
            setLoading(false);
            setError("Bạn chưa đăng nhập!");
            return;
        }
        const fetchData = async () => {
            try {
                const response = await getStaffOverview({ staffId, token: contextUser.accessToken });
                setOverview(response.data);
            } catch (error) {
                setError("Đã xảy ra lỗi khi lấy dữ liệu tổng quan.");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [staffId, contextUser.accessToken]);

    useEffect(() => {
        if (!contextUser.accessToken) return;
        const fetchFeedback = async () => {
            try {
                const res = await getStaffFeedback({ token: contextUser.accessToken });
                setFeedback(res.data);
            } catch (err) {
                setFeedback([]);
            }
        };
        fetchFeedback();
    }, [contextUser]);

    if (error) {
        return (<div className="alert alert-danger">{error}</div>);
    }

    // Tính toán thống kê đánh giá
    const getRatingStats = () => {
        if (feedback.length === 0) return { avgRating: 0, totalReviews: 0, ratingDistribution: {} };

        const avgRating = (feedback.reduce((sum, fb) => sum + fb.rating, 0) / feedback.length).toFixed(1);
        const totalReviews = feedback.length;

        const ratingDistribution = {};
        for (let i = 1; i <= 5; i++) {
            ratingDistribution[i] = feedback.filter(fb => fb.rating === i).length;
        }

        return { avgRating, totalReviews, ratingDistribution };
    };

    // Lọc đánh giá theo rating
    const filteredFeedback = ratingFilter === 'all'
        ? feedback
        : feedback.filter(fb => fb.rating === parseInt(ratingFilter));

    const ratingStats = getRatingStats();

    // Function để mở modal và lấy danh sách active seekers
    const handleShowActiveSeekers = async () => {
        setShowActiveSeekersModal(true);
        setLoadingSeekers(true);
        try {
            const response = await getActiveSeekers({
                staffId,
                token: contextUser.accessToken
            });
            setActiveSeekers(response.data || []);
        } catch (error) {
            console.error('Error fetching active seekers:', error);
            setActiveSeekers([]);
        } finally {
            setLoadingSeekers(false);
        }
    };

    // Function để xem chi tiết seeker
    const handleSeekerClick = async (seeker) => {
        // Lấy đúng seekerId (ưu tiên các trường phổ biến)
        const seekerId = seeker.seeker_id || seeker.user_id || seeker.id;
        setSelectedSeeker(seeker);
        setShowSeekerDetailModal(true);
        setLoadingSeekerDetail(true);

        try {
            // SỬA: chỉ truyền seekerId (string) vào getSeekerDetail
            const response = await getSeekerDetail(seekerId);
            setSelectedSeeker(response.data || response || seeker);
        } catch (error) {
            console.error('Error fetching seeker detail:', error);
            // Nếu không lấy được chi tiết, vẫn hiển thị thông tin cơ bản
        } finally {
            setLoadingSeekerDetail(false);
        }
    };

    // Function để chuyển đến trang consultation roadmap staff
    const handleConsultationRoadmap = () => {
        navigate('/staff/consultation-roadmap');
    };

    if (loading || !overview) return (
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh" }}>
            <Spinner animation="border" />
        </div>
    );

    return (
        <>
            {/* Header */}
            <Header title="Staff Dashboard">
                <div className="d-none d-md-block position-absolute end-0 me-4">
                    <span className="me-3 text-muted">
                        Xin chào, {contextUser?.name || "Staff"}
                    </span>
                    <Button variant="outline-secondary" size="sm" onClick={logout}>
                        Đăng xuất
                    </Button>
                </div>
            </Header>

            <Container className="pt-5">
                <h2 className="mb-4 fade-in text-center mb-5">Staff Dashboard</h2>
                <Row className="mb-4 fade-in">
                    <Col md={3} xs={6} className="mb-3">
                        <Card
                            className="text-center border-0 shadow-sm cursor-pointer"
                            style={{ cursor: 'pointer' }}
                            onClick={handleShowActiveSeekers}
                        >
                            <Card.Body>
                                <User size={22} className="mb-2 text-primary" />
                                <div className="fw-semibold">Seeker đang chờ phản hồi</div>
                                <div className="fs-4">{overview.activeSeekers}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} xs={6} className="mb-3">
                        <Card
                            className="text-center border-0 shadow-sm cursor-pointer"
                            style={{ cursor: 'pointer' }}
                            onClick={handleConsultationRoadmap}
                        >
                            <Card.Body>
                                <Route size={22} className="mb-2 text-success" />
                                <div className="fw-semibold">Lộ trình tư vấn</div>
                                <div className="fs-4">{overview.premiumSeekers || 0}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} xs={6} className="mb-3">
                        <Card className="text-center border-0 shadow-sm">
                            <Card.Body>
                                <Clock size={22} className="mb-2 text-primary" />
                                <div className="fw-semibold">Case chờ xử lý</div>
                                <div className="fs-4">{overview.pendingCases}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} xs={6} className="mb-3">
                        <Card className="text-center border-0 shadow-sm">
                            <Card.Body>
                                <Award size={22} className="mb-2 text-primary" />
                                <div className="fw-semibold">Học bổng mới</div>
                                <div className="fs-4">{overview.newScholarships}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                <Row className="mb-4 fade-in" style={{ animationDelay: "0.2s" }}>
                    <Col md={6} className="mb-3">
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <div className="mb-2">
                                    <span className="fw-semibold">Cuộc trò chuyện hoàn thành:</span> {overview.completedChats}
                                </div>
                                <div>
                                    <span className="fw-semibold">Thời gian phản hồi TB:</span> {overview.avgResponseTime || 0} phút
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={6} className="mb-3">
                        <Card className="border-0 shadow-sm">
                            <Card.Body>
                                <div className="fw-semibold mb-2">Biểu đồ hoạt động</div>
                                <StaffActivityChart chartData={chartData} />
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Thống kê đánh giá */}
                {feedback.length > 0 && (
                    <Row className="mb-4 fade-in" style={{ animationDelay: "0.3s" }}>
                        <Col md={6} className="mb-3">
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="d-flex align-items-center justify-content-between">
                                        <div>
                                            <div className="fw-semibold mb-1">Điểm đánh giá trung bình</div>
                                            <div className="fs-3 fw-bold text-primary">{ratingStats.avgRating} ⭐</div>
                                            <div className="text-muted small">Từ {ratingStats.totalReviews} đánh giá</div>
                                        </div>
                                        <div className="text-center">
                                            <div className="text-warning fs-1">📊</div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={6} className="mb-3">
                            <Card className="border-0 shadow-sm">
                                <Card.Body>
                                    <div className="fw-semibold mb-2">Phân bố đánh giá</div>
                                    {[5, 4, 3, 2, 1].map(rating => (
                                        <div key={rating} className="d-flex align-items-center mb-1">
                                            <div className="me-2" style={{ width: '20px' }}>
                                                {rating}⭐
                                            </div>
                                            <div className="flex-grow-1 me-2">
                                                <div className="progress" style={{ height: '8px' }}>
                                                    <div
                                                        className="progress-bar bg-warning"
                                                        style={{
                                                            width: `${ratingStats.totalReviews > 0 ? (ratingStats.ratingDistribution[rating] / ratingStats.totalReviews) * 100 : 0}%`
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                            <div className="text-muted small" style={{ width: '30px' }}>
                                                {ratingStats.ratingDistribution[rating] || 0}
                                            </div>
                                        </div>
                                    ))}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}

                <Card className="border-0 shadow-sm mb-4 fade-in" style={{ animationDelay: "0.4s" }}>
                    <Card.Header className="bg-white fw-semibold">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <span>Đánh giá từ người dùng</span>
                            <div className="d-flex align-items-center">
                                <span className="me-2 text-muted">Tổng: {feedback.length}</span>
                                {feedback.length > 0 && (
                                    <span className="badge bg-primary">
                                        {ratingStats.avgRating}⭐
                                    </span>
                                )}
                            </div>
                        </div>
                        {feedback.length > 0 && (
                            <div className="d-flex align-items-center">
                                <label className="me-2 small text-muted">Lọc theo đánh giá:</label>
                                <select
                                    className="form-select form-select-sm"
                                    style={{ width: 'auto' }}
                                    value={ratingFilter}
                                    onChange={(e) => setRatingFilter(e.target.value)}
                                >
                                    <option value="all">Tất cả ({feedback.length})</option>
                                    <option value="5">5 sao ({ratingStats.ratingDistribution[5] || 0})</option>
                                    <option value="4">4 sao ({ratingStats.ratingDistribution[4] || 0})</option>
                                    <option value="3">3 sao ({ratingStats.ratingDistribution[3] || 0})</option>
                                    <option value="2">2 sao ({ratingStats.ratingDistribution[2] || 0})</option>
                                    <option value="1">1 sao ({ratingStats.ratingDistribution[1] || 0})</option>
                                </select>
                            </div>
                        )}
                    </Card.Header>
                    <Card.Body>
                        {filteredFeedback.length === 0 ? (
                            <div className="text-center text-muted py-4">
                                <div className="mb-2">📝</div>
                                <div>{feedback.length === 0 ? 'Chưa có đánh giá nào' : 'Không có đánh giá phù hợp với bộ lọc'}</div>
                                <small>
                                    {feedback.length === 0
                                        ? 'Đánh giá sẽ xuất hiện khi người dùng đánh giá dịch vụ của bạn'
                                        : 'Thử thay đổi bộ lọc để xem thêm đánh giá'
                                    }
                                </small>
                            </div>
                        ) : (
                            <div className="row">
                                {filteredFeedback.map((fb, idx) => (
                                    <div key={idx} className="col-md-6 col-lg-4 mb-3">
                                        <div className="card h-100 border-0 shadow-sm">
                                            <div className="card-body">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                                                            style={{ width: '32px', height: '32px', fontSize: '14px' }}>
                                                            {fb.isAnonymous ? 'A' : fb.seekerId?.slice(-2) || 'U'}
                                                        </div>
                                                        <div>
                                                            <div className="fw-semibold small">
                                                                {fb.isAnonymous
                                                                    ? 'Người dùng ẩn danh'
                                                                    : fb.seekerName || `Seeker ${fb.seekerId}`
                                                                }
                                                            </div>
                                                            <div className="text-muted small">
                                                                {fb.createdAt ? new Date(fb.createdAt).toLocaleDateString('vi-VN') : ''}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="text-warning">
                                                        {'⭐'.repeat(fb.rating)}
                                                        <span className="text-muted ms-1">({fb.rating}/5)</span>
                                                    </div>
                                                </div>
                                                <div className="review-content">
                                                    {fb.reviewContent ? (
                                                        <p className="mb-0 small" style={{ lineHeight: '1.4' }}>
                                                            "{fb.reviewContent}"
                                                        </p>
                                                    ) : (
                                                        <p className="mb-0 small text-muted">Không có nội dung đánh giá</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </Card.Body>
                </Card>
            </Container>

            {/* Modal hiển thị danh sách active seekers */}
            <ActiveSeekersModal
                show={showActiveSeekersModal}
                onHide={() => setShowActiveSeekersModal(false)}
                seekers={activeSeekers}
                loading={loadingSeekers}
                onSeekerClick={handleSeekerClick}
            />

            {/* Modal hiển thị chi tiết seeker */}
            <SeekerDetailModal
                show={showSeekerDetailModal}
                onHide={() => setShowSeekerDetailModal(false)}
                seeker={selectedSeeker}
                loading={loadingSeekerDetail}
            />
        </>
    );
}

export default StaffDashboard;