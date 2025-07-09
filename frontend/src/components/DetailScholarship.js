import { useState, useEffect } from 'react';
import { useLocation, useParams, useNavigate, Link } from 'react-router-dom';
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
    const navigate = useNavigate();

    const [scholarship, setScholarship] = useState(location.state?.scholarship || null);
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

    const getFirstCountry = () => {
        if (!scholarship?.countries) return 'Quốc gia';
        try {
            const countries = JSON.parse(scholarship.countries);
            return Array.isArray(countries) ? countries[0] : countries;
        } catch {
            return scholarship.countries;
        }
    };

    const getFirstField = () => {
        if (!scholarship?.fieldsOfStudy) return 'Lĩnh vực';
        try {
            const fields = JSON.parse(scholarship.fieldsOfStudy);
            return Array.isArray(fields) ? fields[0] : fields;
        } catch {
            return scholarship.fieldsOfStudy;
        }
    };

    // Nếu không có scholarship trong state, lấy qua API bằng id
    useEffect(() => {
        if (!scholarship) {
            axios.get(`/api/scholarships/${scholarshipId}`)
                .then(res => setScholarship(res.data))
                .catch(err => console.error("Lỗi khi tải học bổng:", err));
        }
    }, [scholarship, scholarshipId]);

    useEffect(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    return (
        <>
            <Header />

            <div className="bg-light py-4">
                <Container>
                   {/* Title + Image */}
                    <div className="position-relative bg-white p-4 rounded shadow-sm">
                        <div
                            className="scholarship-hero text-white"
                            style={{
                                backgroundImage: `url(${scholarship?.image || "/images/scholarshipdetail.jpg"})`,
                            }}
                        >
                            <Container className="d-flex flex-column justify-content-center h-100">
                                <div className="breadcrumb-navigation mb-3">
                                    <Link to="/" className="breadcrumb-nav-link">Home</Link>
                                    <span className="breadcrumb-separator">/</span>
                                    <Link 
                                        to={`/search-scholarships?countries=${encodeURIComponent(scholarship?.organization?.country || '')}`}
                                        className="breadcrumb-nav-link"
                                    >
                                        {scholarship?.organization?.country || 'Quốc gia'}
                                    </Link>
                                    <span className="breadcrumb-separator">/</span>
                                    <span className="breadcrumb-current">{scholarship?.title || 'Học bổng'}</span>
                                </div>
                                <h1 className="display-5 fw-bold scholarship-title">{scholarship?.title || 'Học bổng'}</h1>
                                {scholarship?.organizationName && (
                                  <div className="scholarship-org-link mb-3">
                                    <Link 
                                      to={`/organization/${scholarship?.organizationId || ''}`}
                                      className="organization-link"
                                      style={{ fontWeight: 600, fontSize: '1.15rem', color: 'white', textDecoration: 'underline' }}
                                    >
                                      {scholarship.organizationName}
                                    </Link>
                                  </div>
                                )}
                                <div className="scholarship-actions d-flex gap-3">
                                    <button className="btn btn-primary px-4 rounded-pill action-btn" onClick={toggleRegisterForm}>
                                        <i className="fas fa-phone me-2"></i>
                                        Tư vấn ngay
                                    </button>
                                    <Button variant="outline-light" className="rounded-pill action-btn">
                                        <i className="fas fa-share-alt"></i>
                                    </Button>
                                    <Button variant="outline-light" className="rounded-pill action-btn">
                                        <i className="fas fa-heart"></i>
                                    </Button>
                                </div>
                            </Container>
                        </div>

                        {/* Grid Info */}
                        <Row className="mt-4 text-center border-top pt-3 scholarship-info-grid">
                            <Col md={2} className="info-item">
                                <div className="info-icon">
                                    <i className="fas fa-map-marker-alt text-primary"></i>
                                </div>
                                <strong>Vị trí</strong>
                                <div className="info-value">{scholarship?.organization?.country || 'Không rõ'}</div>
                            </Col>
                            <Col md={2} className="info-item">
                                <div className="info-icon">
                                    <i className="fas fa-graduation-cap text-success"></i>
                                </div>
                                <strong>Trình độ</strong>
                                <div className="info-value">{parseJson(scholarship?.educationLevels) || 'Không rõ'}</div>
                            </Col>
                            <Col md={2} className="info-item">
                                <div className="info-icon">
                                    <i className="fas fa-university text-info"></i>
                                </div>
                                <strong>Tài trợ</strong>
                                <div className="info-value">{scholarship?.organizationName || 'Fee waiver/discount'}</div>
                            </Col>
                            <Col md={2} className="info-item">
                                <div className="info-icon">
                                    <i className="fas fa-calendar-alt text-warning"></i>
                                </div>
                                <strong>Hạn chót</strong>
                                <div className="info-value">{formatDate(scholarship?.applicationDeadline)}</div>
                            </Col>
                            <Col md={4} className="info-item">
                                <div className="info-icon">
                                    <i className="fas fa-dollar-sign text-danger"></i>
                                </div>
                                <strong>Giá trị học bổng</strong>
                                <div className="info-value scholarship-amount">
                                    {scholarship?.amount ? `${scholarship.amount.toLocaleString('vi-VN')} ${scholarship.currency}` : 'Không rõ'}
                                </div>
                            </Col>
                        </Row>
                    </div>

                    {/* Accordion */}
                    <div className="bg-white p-4 rounded shadow-sm mt-4 scholarship-details">
                        <h5 className="fw-bold mb-3 section-title">
                            <i className="fas fa-info-circle me-2 text-primary"></i>
                            Thông tin về học bổng
                        </h5>
                        <Accordion flush defaultActiveKey="0" className="scholarship-accordion">
                            {/* Tổng quan */}
                            <Accordion.Item eventKey="0" className="accordion-item">
                                <Accordion.Header className="accordion-header">
                                    <i className="fas fa-eye me-2"></i>
                                    Tổng quan
                                </Accordion.Header>
                                <Accordion.Body className="accordion-body">
                                    {scholarship ? (
                                        <Row className="gy-3">
                                            <Col md={6} className="detail-item">
                                                <strong>Trường cung cấp học bổng:</strong>
                                                <div className="detail-value">{parseJson(scholarship?.countries)}</div>
                                            </Col>
                                            <Col md={6} className="detail-item">
                                                <strong>Số hồ sơ ứng tuyển trung bình mỗi năm:</strong>
                                                <div className="detail-value">{scholarship?.applicationsCount || 'Không được chỉ định'}</div>
                                            </Col>
                                            <Col md={6} className="detail-item">
                                                <strong>Yêu cầu:</strong>
                                                <div className="detail-value">
                                                    {(() => {
                                                        try {
                                                            const val = scholarship?.eligibilityCriteria;
                                                            if (!val) return 'Không được chỉ định';
                                                            const obj = JSON.parse(val);
                                                            if (typeof obj === 'object' && obj !== null) {
                                                                return (
                                                                    <ul className="requirement-list">
                                                                        {Object.entries(obj).map(([k, v]) => (
                                                                            <li key={k}>
                                                                                <strong>{k.charAt(0).toUpperCase() + k.slice(1)}:</strong> {v}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                );
                                                            }
                                                            return val;
                                                        } catch {
                                                            return scholarship?.eligibilityCriteria || 'Không được chỉ định';
                                                        }
                                                    })()}
                                                </div>
                                            </Col>
                                            <Col md={6} className="detail-item">
                                                <strong>Số lượng học bổng có sẵn:</strong>
                                                <div className="detail-value">{scholarship?.viewsCount || 'Không được chỉ định'}</div>
                                            </Col>
                                            <Col md={6} className="detail-item">
                                                <strong>Giá trị học bổng:</strong>
                                                <div className="detail-value">{scholarship?.amount ? `${scholarship.amount.toLocaleString('vi-VN')} ${scholarship.currency}` : 'Không được chỉ định'}</div>
                                            </Col>
                                            <Col md={6} className="detail-item">
                                                <strong>Áp dụng cho kỳ nhập học:</strong>
                                                <div className="detail-value">{parseJson(scholarship?.applicableIntake) || 'Liên hệ với trường đại học'}</div>
                                            </Col>
                                            <Col md={12} className="detail-item">
                                                <strong>Chi tiết học bổng:</strong>
                                                <div className="detail-value description-text">{scholarship?.description}</div>
                                            </Col>
                                            <Col md={6} className="detail-item">
                                                <strong>Hình thức học tập:</strong>
                                                <div className="detail-value">{parseJson(scholarship?.fieldsOfStudy) || 'Không được chỉ định'}</div>
                                            </Col>
                                            <Col md={6} className="detail-item">
                                                <strong>Hình thức tài trợ:</strong>
                                                <div className="detail-value">{scholarship?.fundingType || 'Không được chỉ định'}</div>
                                            </Col>
                                            <Col md={6} className="detail-item">
                                                <strong>Hạn chót đăng ký khóa học/ưu đãi:</strong>
                                                <div className="detail-value">{formatDate(scholarship?.applicationDeadline) || 'Liên hệ với trường đại học'}</div>
                                            </Col>
                                        </Row>
                                    ) : (
                                        <div className="loading-state">
                                            <i className="fas fa-spinner fa-spin me-2"></i>
                                            Đang tải dữ liệu...
                                        </div>
                                    )}
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Yêu cầu đầu vào */}
                            <Accordion.Item eventKey="1" className="accordion-item">
                                <Accordion.Header className="accordion-header">
                                    <i className="fas fa-clipboard-list me-2"></i>
                                    Yêu cầu đầu vào
                                </Accordion.Header>
                                <Accordion.Body className="accordion-body">
                                    <Row className="gy-3">
                                        <Col md={6} className="detail-item">
                                            <strong>Trình độ chuyên môn:</strong>
                                            <div className="detail-value">
                                                {(() => {
                                                    try {
                                                        const val = scholarship?.eligibilityCriteria;
                                                        if (!val) return 'Không được chỉ định';
                                                        const obj = JSON.parse(val);
                                                        if (typeof obj === 'object' && obj !== null) {
                                                            return (
                                                                <ul className="requirement-list">
                                                                    {Object.entries(obj).map(([k, v]) => (
                                                                        <li key={k}>
                                                                            <strong>{k.charAt(0).toUpperCase() + k.slice(1)}:</strong> {v}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            );
                                                        }
                                                        return val;
                                                    } catch {
                                                        return scholarship?.eligibilityCriteria || 'Không được chỉ định';
                                                    }
                                                })()}
                                            </div>
                                        </Col>
                                        <Col md={6} className="detail-item">
                                            <strong>Yêu cầu ngôn ngữ:</strong>
                                            <div className="detail-value">{parseJson(scholarship?.languageRequirements) || 'Không rõ'}</div>
                                        </Col>
                                        <Col md={6} className="detail-item">
                                            <strong>Cấp độ học:</strong>
                                            <div className="detail-value">{parseJson(scholarship?.educationLevels) || 'Không rõ'}</div>
                                        </Col>
                                        <Col md={6} className="detail-item">
                                            <strong>Ngành học:</strong>
                                            <div className="detail-value">{parseJson(scholarship?.fieldsOfStudy) || 'Không rõ'}</div>
                                        </Col>
                                    </Row>
                                </Accordion.Body>
                            </Accordion.Item>

                            {/* Hướng dẫn đăng ký */}
                            <Accordion.Item eventKey="2" className="accordion-item">
                                <Accordion.Header className="accordion-header">
                                    <i className="fas fa-edit me-2"></i>
                                    Làm sao để đăng ký
                                </Accordion.Header>
                                <Accordion.Body className="accordion-body">
                                    <div className="registration-guide">
                                        <p>Liên hệ với trường hoặc nhấn nút "Tư vấn ngay" để được hướng dẫn chi tiết.</p>
                                        <div className="contact-options mt-3">
                                            <button className="btn btn-primary me-2" onClick={toggleRegisterForm}>
                                                <i className="fas fa-phone me-2"></i>
                                                Tư vấn miễn phí
                                            </button>
                                            <a href={`mailto:${scholarship?.organizationEmail || 'info@example.com'}`} className="btn btn-outline-primary">
                                                <i className="fas fa-envelope me-2"></i>
                                                Gửi email
                                            </a>
                                        </div>
                                    </div>
                                </Accordion.Body>
                            </Accordion.Item>
                        </Accordion>
                    </div>
                </Container>
            </div>

            {/* Register popup */}
            {showRegisterForm && (
                <div className="register-popup-overlay" onClick={toggleRegisterForm}>
                    <div className="register-form-popup" onClick={e => e.stopPropagation()}>
                        <button className="close-form" onClick={toggleRegisterForm}>×</button>
                        <RegisterForm />
                    </div>
                </div>
            )}

            <Footer />
        </>
    );
}

export default DetailScholarship;
