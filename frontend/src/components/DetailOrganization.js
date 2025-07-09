import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';
import { getOrganizationById } from '../services/organizationApi';
import RegisterForm from './Register-book';
import '../css/register.css';

function DetailOrganization() {
    const location = useLocation();
    const { organizationId } = useParams();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState(location.state?.organization || null);
    const [loading, setLoading] = useState(!location.state?.organization);
    const [showRegisterForm, setShowRegisterForm] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

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

    useEffect(() => {
        if (!organization) {
            setLoading(true);
            getOrganizationById(organizationId)
                .then(res => setOrganization(res.data))
                .catch(err => {
                    console.error('Lỗi khi tải thông tin trường:', err);
                    setOrganization(null);
                })
                .finally(() => setLoading(false));
        }
    }, [organization, organizationId]);

    if (loading) {
        return (
            <>
                <Header />
                <div className="bg-light py-4">
                    <Container>
                        <div className="text-center my-5">Đang tải thông tin trường...</div>
                    </Container>
                </div>
                <Footer />
            </>
        );
    }

    if (!organization) {
        return (
            <>
                <Header />
                <div className="bg-light py-4">
                    <Container>
                        <div className="text-center my-5">Không tìm thấy thông tin trường.</div>
                    </Container>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Header />
            <div className="bg-light py-4">
                <Container>
                    <div className="position-relative bg-white p-4 rounded shadow-sm">
                        <Row className="align-items-center mb-4">
                            <Col md={2} className="text-center">
                                <img
                                    src={organization.logoUrl && organization.logoUrl !== 'null' ? organization.logoUrl : '/images/logo.png'}
                                    alt={organization.name || 'Tên trường'}
                                    style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 12, background: '#fff' }}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = '/images/logo.png';
                                    }}
                                />
                            </Col>
                            <Col md={7}>
                                <h2 className="fw-bold mb-1">{organization.name || 'Tên trường'}</h2>
                                <div className="text-muted mb-2">
                                    {organization.country || 'Quốc gia'} | {organization.organizationType || 'Loại trường'}
                                </div>
                                <div className="mb-2">Xếp hạng thế giới: <strong>{formatNumber(organization.worldRank)}</strong></div>
                                <div className="mb-2">Số sinh viên: <strong>{formatNumber(organization.numberStudent)}</strong></div>
                                <div className="mb-2">Website: {organization.websiteUrl ? <a href={organization.websiteUrl} target="_blank" rel="noopener noreferrer">{organization.websiteUrl}</a> : 'Không rõ'}</div>
                                <div className="mb-2">Chi phí sinh hoạt TB: <strong>{formatAmount(organization.avgCostLiving)}</strong></div>
                                <div className="mb-2">Đã xác thực: <strong>{organization.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}</strong></div>
                                <div className="mb-2">Ngày cập nhật: <strong>{formatDate(organization.updatedAt)}</strong></div>
                            </Col>
                            <Col md={3} className="d-flex flex-column gap-2 align-items-end">
                                <Button variant="primary" className="rounded-pill px-4 mb-2" onClick={() => setShowRegisterForm(true)}>Tư vấn ngay</Button>
                                <Button variant="outline-dark" className="rounded-pill px-4" onClick={() => navigate(`/search-scholarships?organizationName=${encodeURIComponent(organization.name)}`)}>
                                    Xem tất cả các học bổng
                                </Button>
                            </Col>
                        </Row>
                        <hr />
                        <h5 className="fw-bold mb-3">Tổng quan về trường</h5>
                        <div className="mb-3">{organization.description || 'Không có mô tả về trường.'}</div>
                        <Row>
                            <Col md={4}><strong>Chi phí sinh hoạt trung bình:</strong><br />{formatAmount(organization.avgCostLiving)}</Col>
                            <Col md={4}><strong>Đã xác thực:</strong><br />{organization.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}</Col>
                            <Col md={4}><strong>Ngày cập nhật:</strong><br />{formatDate(organization.updatedAt)}</Col>
                        </Row>
                    </div>
                </Container>
            </div>
            {showRegisterForm && (
                <div className="register-popup-overlay" onClick={() => setShowRegisterForm(false)}>
                    <div className="register-form-popup" onClick={e => e.stopPropagation()}>
                        <button className="close-form" onClick={() => setShowRegisterForm(false)}>×</button>
                        <RegisterForm />
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}

export default DetailOrganization;
