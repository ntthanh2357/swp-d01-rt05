import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button } from 'react-bootstrap';
import Header from './Header';
import Footer from './Footer';
import axios from 'axios';
import '../css/register.css';

function DetailOrganization() {
    const location = useLocation();
    const { organizationId } = useParams();
    const navigate = useNavigate();
    const [organization, setOrganization] = useState(location.state?.organization || null);

    useEffect(() => {
        if (!organization) {
            axios.get(`/api/organizations/${organizationId}`)
                .then(res => setOrganization(res.data))
                .catch(err => console.error('Lỗi khi tải thông tin trường:', err));
        }
    }, [organization, organizationId]);

    return (
        <>
            <Header />
            <div className="bg-light py-4">
                <Container>
                    <div className="position-relative bg-white p-4 rounded shadow-sm">
                        <Row className="align-items-center mb-4">
                            <Col md={2} className="text-center">
                                <img
                                    src={organization?.logoUrl || '/images/logo.png'}
                                    alt={organization?.name}
                                    style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 12, background: '#fff' }}
                                />
                            </Col>
                            <Col md={7}>
                                <h2 className="fw-bold mb-1">{organization?.name || 'Tên trường'}</h2>
                                <div className="text-muted mb-2">{organization?.country || 'Quốc gia'} | {organization?.organizationType || 'Loại trường'}</div>
                                <div className="mb-2">Xếp hạng thế giới: <strong>{organization?.worldRank ?? 'Không rõ'}</strong></div>
                                <div className="mb-2">Số sinh viên: <strong>{organization?.numberStudent ?? 'Không rõ'}</strong></div>
                                <div className="mb-2">Website: {organization?.websiteUrl ? <a href={organization.websiteUrl} target="_blank" rel="noopener noreferrer">{organization.websiteUrl}</a> : 'Không rõ'}</div>
                                <div className="mb-2">Chi phí sinh hoạt TB: <strong>{organization?.avgCostLiving ? organization.avgCostLiving + ' USD/năm' : 'Không rõ'}</strong></div>
                                <div className="mb-2">Đã xác thực: <strong>{organization?.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}</strong></div>
                                <div className="mb-2">Ngày tạo: <strong>{organization?.createdAt ? new Date(organization.createdAt).toLocaleDateString('vi-VN') : 'Không rõ'}</strong></div>
                                <div className="mb-2">Ngày cập nhật: <strong>{organization?.updatedAt ? new Date(organization.updatedAt).toLocaleDateString('vi-VN') : 'Không rõ'}</strong></div>
                            </Col>
                            <Col md={3} className="d-flex flex-column gap-2 align-items-end">
                                <Button variant="primary" className="rounded-pill px-4 mb-2">Tư vấn ngay</Button>
                                <Button variant="outline-dark" className="rounded-pill px-4" onClick={() => navigate(`/scholarships?organizationId=${organization?.organizationId}`)}>
                                    Xem tất cả các học bổng
                                </Button>
                            </Col>
                        </Row>
                        <hr />
                        <h5 className="fw-bold mb-3">Tổng quan về trường</h5>
                        <div className="mb-3">{organization?.description || 'Không có mô tả về trường.'}</div>
                        <Row>
                            <Col md={4}><strong>Chi phí sinh hoạt trung bình:</strong><br />{organization?.avgCostLiving ? organization.avgCostLiving + ' USD/năm' : 'Không rõ'}</Col>
                            <Col md={4}><strong>Đã xác thực:</strong><br />{organization?.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}</Col>
                            <Col md={4}><strong>Ngày cập nhật:</strong><br />{organization?.updatedAt ? new Date(organization.updatedAt).toLocaleDateString('vi-VN') : 'Không rõ'}</Col>
                        </Row>
                    </div>
                </Container>
            </div>
            <Footer />
        </>
    );
}

export default DetailOrganization;
