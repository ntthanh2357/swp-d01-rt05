import React, { useContext, useEffect, useState } from "react";
import StaffActivityChart from "../components/StaffActivityChart";
import { getStaffOverview, getStaffFeedback } from "../services/staffApi";
import { UserContext } from "../contexts/UserContext";
import { Card, Row, Col, Spinner, Table, Container, Button } from "react-bootstrap";
import { User, Mail, Clock, Award } from "lucide-react";
import Header from '../components/Header';
import "../css/staff-dashboard.css"; // import CSS hiệu ứng

function StaffDashboard({ staffId }) {
    const { user: contextUser, logout } = useContext(UserContext);
    const [overview, setOverview] = useState(null);
    const [chartData, setChartData] = useState(null);
    const [feedback, setFeedback] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

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
                        <Card className="text-center border-0 shadow-sm">
                            <Card.Body>
                                <User size={22} className="mb-2 text-primary" />
                                <div className="fw-semibold">Seeker đang tư vấn</div>
                                <div className="fs-4">{overview.activeSeekers}</div>
                            </Card.Body>
                        </Card>
                    </Col>
                    <Col md={3} xs={6} className="mb-3">
                        <Card className="text-center border-0 shadow-sm">
                            <Card.Body>
                                <Mail size={22} className="mb-2 text-primary" />
                                <div className="fw-semibold">Tin nhắn chưa đọc</div>
                                <div className="fs-4">{overview.unreadMessages}</div>
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

                <Card className="border-0 shadow-sm mb-4 fade-in" style={{ animationDelay: "0.4s" }}>
                    <Card.Header className="bg-white fw-semibold">Đánh giá từ người dùng</Card.Header>
                    <Card.Body>
                        <Table striped bordered hover responsive>
                            <thead>
                                <tr>
                                    <th>Seeker</th>
                                    <th>Rating</th>
                                    <th>Nội dung</th>
                                    <th>Ẩn danh</th>
                                    <th>Ngày</th>
                                </tr>
                            </thead>
                            <tbody>
                                {feedback.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="text-center text-muted">Chưa có đánh giá</td>
                                    </tr>
                                ) : feedback.map((fb, idx) => (
                                    <tr key={idx}>
                                        <td>{fb.seekerId}</td>
                                        <td>{fb.rating}</td>
                                        <td>{fb.reviewContent}</td>
                                        <td>{fb.isAnonymous ? "Có" : "Không"}</td>
                                        <td>{fb.createdAt ? new Date(fb.createdAt).toLocaleString() : ""}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            </Container>
        </>
    );
}

export default StaffDashboard;