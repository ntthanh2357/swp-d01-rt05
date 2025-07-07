import { useState, useEffect } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { Container, Row, Col, Accordion, Button } from 'react-bootstrap';
import '../css/register.css';
import "../css/DetailScholarship.css";
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegisterForm from "./Register-book";
import axios from 'axios';

function DetailScholarship() {
    const location = useLocation();
    const { scholarshipId } = useParams();

    const [scholarship, setScholarship] = useState(location.state?.scholarship || null);
    const [overviewData, setOverviewData] = useState(null);
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    const toggleRegisterForm = () => setShowRegisterForm(!showRegisterForm);

    const formatDate = (dateStr) => {
        if (!dateStr) return 'Không rõ';
        const date = new Date(dateStr);
        return date.toLocaleDateString('vi-VN');
    };
    const parseJson = (jsonStr) => {
        try {
            const arr = JSON.parse(jsonStr);
            if (Array.isArray(arr)) return arr.join(', ');
            return jsonStr;
        } catch {
            return jsonStr;
        }
    };

    // Nếu không có scholarship trong state, lấy qua API bằng id
    useEffect(() => {
        if (!scholarship) {
            axios.get(`/api/scholarship/${scholarshipId}`)
                .then(res => setScholarship(res.data))
                .catch(err => console.error("Lỗi khi tải học bổng:", err));
        }
    }, [scholarship, scholarshipId]);

    // Lấy dữ liệu overview nếu có scholarship.id
    useEffect(() => {
        if (scholarship?.id) {
            axios.get(`/api/scholarship/${scholarship.id}/overview`)
                .then(res => setOverviewData(res.data))
                .catch(err => console.error("Lỗi khi tải overview:", err));
        }
    }, [scholarship]);

    return (
        <>
            <Header />

            <div className="bg-light py-4">
                <Container>
                    {/* Breadcrumb */}
                    <p className="text-white-important mb-2">
                        Home / Cao đẳng và Đại học / {scholarship?.location || 'Địa điểm'} / {scholarship?.university || 'Trường'} / {scholarship?.title || 'Học bổng'}
                    </p>

                    {/* Title + Image */}
                    <div className="position-relative bg-white p-4 rounded shadow-sm">
                        <div
                            className="scholarship-hero text-white"
                            style={{
                                backgroundImage: `url(${scholarship?.image || "/images/scholarshipdetail.jpg"})`,
                            }}
                        >
                            <Container className="d-flex flex-column justify-content-center h-100">
                                <p className="breadcrumb text-uppercase mb-2 small">
                                    Education / {scholarship?.location || 'Địa điểm'} / {scholarship?.university || 'Trường'} / {scholarship?.title || 'Học bổng'}
                                </p>
                                <h1 className="display-5 fw-bold">{scholarship?.title || 'Học bổng'}</h1>
                                <p className="lead mb-4 text-white-important">
                                    At {scholarship?.university || 'Trường'}
                                </p>
                                <div className="d-flex gap-3">
                                    <button className="btn btn-primary px-4 rounded-pill" onClick={toggleRegisterForm}>
                                        Tư vấn ngay
                                    </button>
                                    <Button variant="outline-light" className="rounded-pill">
                                        <i className="fas fa-share-alt"></i>
                                    </Button>
                                </div>
                            </Container>
                        </div>

                        {/* Grid Info */}
                        <Row className="mt-4 text-center border-top pt-3">
                            <Col md={2}><strong>Vị trí</strong><div>{parseJson(scholarship?.countries) || 'Không rõ'}</div></Col>
                            <Col md={2}><strong>Trình độ</strong><div>{parseJson(scholarship?.fieldsOfStudy) || 'Không rõ'}</div></Col>
                            <Col md={2}><strong>Tài trợ</strong><div>{scholarship?.funding_type || 'Fee waiver/discount'}</div></Col>
                            <Col md={2}><strong>Hạn chót</strong><div>{formatDate(scholarship?.applicationDeadline)}</div></Col>
                            <Col md={4}><strong>Giá trị học bổng</strong><div>{scholarship?.amount ? `${scholarship.amount} ${scholarship.currency}` : 'Không rõ'}</div></Col>
                        </Row>

                    </div>

                    {/* Accordion */}
                    <div className="bg-white p-4 rounded shadow-sm mt-4">
                        <h5 className="fw-bold mb-3">Thông tin về học bổng</h5>
                        <Accordion flush defaultActiveKey="0">
                            {/* Tổng quan */}
                            <Accordion.Item eventKey="0">
                                <Accordion.Header>Tổng quan</Accordion.Header>
                                <Accordion.Body>
                                    {overviewData ? (
                                        <Row className="gy-3">
                                            <Col md={6}><strong>Trường cung cấp học bổng:</strong><br />{overviewData.university}</Col>
                                            <Col md={6}><strong>Số hồ sơ ứng tuyển trung bình mỗi năm:</strong><br />{overviewData.average_applications_per_year || 'Không được chỉ định'}</Col>
                                            <Col md={6}><strong>Trình độ chuyên môn:</strong><br />{overviewData.level || 'Không được chỉ định'}</Col>
                                            <Col md={6}><strong>Số lượng học bổng có sẵn:</strong><br />{overviewData.number_of_scholarships || 'Không được chỉ định'}</Col>
                                            <Col md={6}><strong>Giá trị học bổng:</strong><br />{overviewData.value || 'Không được chỉ định'}</Col>
                                            <Col md={6}><strong>Áp dụng cho kỳ nhập học:</strong><br />{overviewData.intake || 'Liên hệ với trường đại học'}</Col>
                                            <Col md={12}><strong>Chi tiết học bổng:</strong><br />{overviewData.details}</Col>
                                            <Col md={6}><strong>Hình thức học tập:</strong><br />{overviewData.study_mode || 'Không được chỉ định'}</Col>
                                            <Col md={6}><strong>Hình thức tài trợ:</strong><br />{overviewData.funding_type || 'Không được chỉ định'}</Col>
                                            <Col md={6}><strong>Hạn chót đăng ký khóa học/ưu đãi:</strong><br />{overviewData.deadline || 'Liên hệ với trường đại học'}</Col>
                                            <Col md={6}><strong>Hình thức tài trợ:</strong><br />{overviewData.funding_form || 'Fee waiver/discount'}</Col>
                                        </Row>
                                    ) : (
                                        <p>Đang tải dữ liệu...</p>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Yêu cầu đầu vào */}
                            <Accordion.Item eventKey="1">
                                <Accordion.Header>Entry requirements</Accordion.Header>
                                <Accordion.Body>
                                    {scholarship?.requirements ? (
                                        <Row className="gy-3">
                                            <Col md={6}><strong>Phân bổ học bổng:</strong><br />{scholarship.requirements.distribution || 'Không rõ'}</Col>
                                            <Col md={6}><strong>Các khía cạnh khác được cân nhắc:</strong><br />{scholarship.requirements.considerations || 'Không rõ'}</Col>
                                            <Col md={6}><strong>Học bổng / Ưu đãi được sử dụng cho:</strong><br />{scholarship.requirements.usage || 'Không rõ'}</Col>
                                            <Col md={6}><strong>Yêu cầu về giới tính:</strong><br />{scholarship.requirements.gender || 'Không rõ'}</Col>
                                            <Col md={6}><strong>Yêu cầu về quốc tịch:</strong><br />{scholarship.requirements.nationality || 'Không rõ'}</Col>
                                            <Col md={6}><strong>Môn học bạn đang đăng ký:</strong><br />{scholarship.requirements.subjects?.join(', ') || 'Không rõ'}</Col>
                                            <Col md={6}><strong>Cơ sở lựa chọn:</strong><br />{scholarship.requirements.selectionBasis || 'Không rõ'}</Col>
                                            <Col md={6}><strong>Tiêu chí lựa chọn:</strong><br />{scholarship.requirements.criteria || 'Không rõ'}</Col>
                                            <Col md={6}><strong>Yêu cầu chi tiết cho từng hồ sơ:</strong><br />{scholarship.requirements.individualRequirements || 'Không rõ'}</Col>
                                            <Col md={6}><strong>Cấp độ học bạn đang đăng ký:</strong><br />{scholarship.requirements.level || 'Không rõ'}</Col>
                                            {scholarship.requirements.note && (
                                                <Col xs={12}>
                                                    <div className="mt-2 text-muted fst-italic">
                                                        {scholarship.requirements.note}
                                                    </div>
                                                </Col>
                                            )}
                                        </Row>
                                    ) : (
                                        <div>Đang tải dữ liệu...</div>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Hướng dẫn đăng ký */}
                            <Accordion.Item eventKey="2">
                                <Accordion.Header>Làm sao để đăng ký</Accordion.Header>
                                <Accordion.Body>
                                    Liên hệ với trường hoặc nhấn nút "Tư vấn ngay" để được hướng dẫn chi tiết.
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </Container>
            </div>

            {/* Register popup */}
            {showRegisterForm && (
                <div className="register-form-popup">
                    <button className="close-form" onClick={toggleRegisterForm}>×</button>
                    <RegisterForm />
                </div>
            )}

            <Footer />
        </>
    );
}

export default DetailScholarship;
