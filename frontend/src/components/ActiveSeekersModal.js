import React from 'react';
import { Modal, Table } from 'react-bootstrap';

const ActiveSeekersModal = ({ show, onHide, seekers, loading, onSeekerClick }) => {
    // Hàm lấy đúng seekerId
    const getSeekerId = (seeker) => seeker.seeker_id || seeker.user_id || seeker.id;

    return (
        <Modal show={show} onHide={onHide} size="md" centered>
            <Modal.Header closeButton>
                <Modal.Title>Danh sách Seeker</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <div className="text-center py-3">
                        <div className="spinner-border text-primary" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </div>
                    </div>
                ) : seekers && seekers.length > 0 ? (
                    <div className="table-responsive">
                        <table className="table table-hover">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ width: '60px' }}>STT</th>
                                    <th>Tên Seeker</th>
                                </tr>
                            </thead>
                            <tbody>
                                {seekers.map((seeker, index) => {
                                    const seekerId = getSeekerId(seeker);
                                    return (
                                        <tr key={seekerId || index}>
                                            <td className="text-center">{index + 1}</td>
                                            <td>
                                                <button 
                                                    className="btn btn-link p-0 text-decoration-none"
                                                    onClick={() => {
                                                        if (!seekerId) {
                                                            alert("Không tìm thấy ID của seeker!");
                                                            return;
                                                        }
                                                        onSeekerClick({ ...seeker, seeker_id: seekerId });
                                                    }}
                                                    style={{ cursor: 'pointer' }}
                                                >
                                                    {seeker.name || `Seeker ${seekerId || index}`}
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-4 text-muted">
                        <div className="mb-2">👥</div>
                        <div>Không có seeker nào đang tư vấn</div>
                        <small>Danh sách sẽ cập nhật khi có seeker mới</small>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={onHide}>
                    Đóng
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default ActiveSeekersModal; 