import React from 'react';
import { Modal, Row, Col, Badge } from 'react-bootstrap';

const SeekerDetailModal = ({ show, onHide, seeker, loading }) => {
    if (!seeker) return null;

    // Debug: In ra console để kiểm tra dữ liệu
    console.log('SeekerDetailModal - seeker data:', seeker);

    const formatDate = (dateString) => {
        if (!dateString) return 'Chưa cập nhật';
        return new Date(dateString).toLocaleDateString('vi-VN');
    };

    const getEducationLevelText = (level) => {
        switch (level) {
            case 'high_school': return 'Trung học phổ thông';
            case 'undergraduate': return 'Đại học';
            case 'graduate': return 'Thạc sĩ';
            case 'postgraduate': return 'Tiến sĩ';
            default: return 'Chưa cập nhật';
        }
    };

    const getFinancialNeedText = (level) => {
        switch (level) {
            case 'low': return 'Thấp';
            case 'medium': return 'Trung bình';
            case 'high': return 'Cao';
            default: return 'Chưa cập nhật';
        }
    };

    const parseJsonField = (jsonString) => {
        if (!jsonString) return [];
        try {
            return JSON.parse(jsonString);
        } catch (e) {
            return [];
        }
    };

    return (
        <Modal show={show} onHide={onHide} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>
                    <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                             style={{ width: '40px', height: '40px' }}>
                            {seeker.name ? seeker.name.charAt(0).toUpperCase() : 'S'}
                        </div>
                        <div>
                            <div className="fw-bold">{seeker.name || 'Thông tin Seeker'}</div>
                            <small className="text-muted">ID: {seeker.seeker_id || seeker.user_id}</small>
                        </div>
                    </div>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-4">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : (
                    <div className="seeker-detail-content">
                        {/* Thông tin cơ bản */}
                        <Row className="mb-4">
                            <Col md={6}>
                                <h6 className="text-primary mb-3">📋 Thông tin cơ bản</h6>
                                <div className="mb-2">
                                    <strong>Họ và tên:</strong> {seeker.name || 'Chưa cập nhật'}
                                </div>
                                <div className="mb-2">
                                    <strong>Email:</strong> {seeker.email || 'Chưa cập nhật'}
                                </div>
                                <div className="mb-2">
                                    <strong>Số điện thoại:</strong> {seeker.phone || 'Chưa cập nhật'}
                                </div>
                                <div className="mb-2">
                                    <strong>Ngày sinh:</strong> {formatDate(seeker.date_of_birth)}
                                </div>
                                <div className="mb-2">
                                    <strong>Giới tính:</strong> {seeker.gender === 'male' ? 'Nam' : seeker.gender === 'female' ? 'Nữ' : 'Khác'}
                                </div>
                            </Col>
                            <Col md={6}>
                                <h6 className="text-primary mb-3">🎓 Thông tin học vấn</h6>
                                <div className="mb-2">
                                    <strong>Cấp độ học vấn hiện tại:</strong> {getEducationLevelText(seeker.current_education_level)}
                                </div>
                                <div className="mb-2">
                                    <strong>Ngành học:</strong> {seeker.field_of_study || seeker.major || 'Chưa cập nhật'}
                                </div>
                                <div className="mb-2">
                                    <strong>Major (từ form):</strong> {seeker.major || 'Chưa cập nhật'}
                                </div>
                                <div className="mb-2">
                                    <strong>GPA:</strong> {seeker.gpa ? `${seeker.gpa}/4.0` : 'Chưa cập nhật'}
                                </div>
                                <div className="mb-2">
                                    <strong>Bằng cấp mục tiêu:</strong> {seeker.target_degree || 'Chưa cập nhật'}
                                </div>
                            </Col>
                        </Row>

                        {/* Thông tin du học */}
                        <Row className="mb-4">
                            <Col md={6}>
                                <h6 className="text-primary mb-3">🌍 Thông tin du học</h6>
                                <div className="mb-2">
                                    <strong>Quốc gia mục tiêu:</strong>
                                    <div className="mt-1">
                                        {parseJsonField(seeker.target_countries).length > 0 ? (
                                            parseJsonField(seeker.target_countries).map((country, index) => (
                                                <Badge key={index} bg="info" className="me-1 mb-1">
                                                    {country}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-muted">Chưa cập nhật</span>
                                        )}
                                    </div>
                                </div>
                                <div className="mb-2">
                                    <strong>Thành phố:</strong> {seeker.city || 'Chưa cập nhật'}
                                </div>
                                <div className="mb-2">
                                    <strong>Thời gian dự định:</strong> {seeker.study_time || 'Chưa cập nhật'}
                                </div>
                                <div className="mb-2">
                                    <strong>Advice Type:</strong> {seeker.advice_type || 'Chưa cập nhật'}
                                </div>
                            </Col>
                            <Col md={6}>
                                <h6 className="text-primary mb-3">💬 Thông tin tư vấn</h6>
                                <div className="mb-2">
                                    <strong>Hình thức tư vấn:</strong> {seeker.advice_type || 'Chưa cập nhật'}
                                </div>
                                <div className="mb-2">
                                    <strong>Mục tiêu học bổng:</strong> {seeker.scholarship_goal || 'Chưa cập nhật'}
                                </div>
                                <div className="mb-2">
                                    <strong>Scholarship Goal (raw):</strong> {seeker.scholarship_goal || 'Chưa cập nhật'}
                                </div>
                                <div className="mb-2">
                                    <strong>Mức độ cần hỗ trợ tài chính:</strong> {getFinancialNeedText(seeker.financial_need_level)}
                                </div>
                            </Col>
                        </Row>

                        {/* Ngôn ngữ và ghi chú */}
                        <Row className="mb-4">
                            <Col md={6}>
                                <h6 className="text-primary mb-3">🗣️ Ngôn ngữ ưa thích</h6>
                                <div className="mb-2">
                                    {parseJsonField(seeker.preferred_languages).length > 0 ? (
                                        parseJsonField(seeker.preferred_languages).map((lang, index) => (
                                            <Badge key={index} bg="success" className="me-1 mb-1">
                                                {lang}
                                            </Badge>
                                        ))
                                    ) : (
                                        <span className="text-muted">Chưa cập nhật</span>
                                    )}
                                </div>
                            </Col>
                            <Col md={6}>
                                <h6 className="text-primary mb-3">📝 Ghi chú</h6>
                                <div className="mb-2">
                                    <strong>Ghi chú:</strong>
                                    <div className="mt-1 p-2 bg-light rounded">
                                        {seeker.note || seeker.bio || 'Không có ghi chú'}
                                    </div>
                                </div>
                            </Col>
                        </Row>

                        {/* Thông tin bổ sung */}
                        <Row className="mb-4">
                            <Col md={6}>
                                <h6 className="text-primary mb-3">📞 Liên hệ</h6>
                                <div className="mb-2">
                                    <strong>Nhận tin khuyến mãi:</strong>
                                    <Badge bg={seeker.receive_promotions ? "success" : "secondary"} className="ms-2">
                                        {seeker.receive_promotions ? "Có" : "Không"}
                                    </Badge>
                                </div>
                            </Col>
                            <Col md={6}>
                                <h6 className="text-primary mb-3">📅 Thông tin hệ thống</h6>
                                <div className="mb-2">
                                    <strong>Ngày tạo:</strong> {formatDate(seeker.created_at)}
                                </div>
                                <div className="mb-2">
                                    <strong>Cập nhật lần cuối:</strong> {formatDate(seeker.updated_at)}
                                </div>
                                <div className="mb-2">
                                    <strong>Staff được phân công:</strong> {seeker.assigned_staff_id || 'Chưa phân công'}
                                </div>
                            </Col>
                        </Row>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={onHide}>
                    Đóng
                </button>
                <button className="btn btn-primary">
                    <i className="fas fa-comments me-2"></i>
                    Bắt đầu tư vấn
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default SeekerDetailModal; 