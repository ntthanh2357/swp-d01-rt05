import React from 'react';
import { Modal, Table } from 'react-bootstrap';

const ActiveSeekersModal = ({ show, onHide, seekers, loading }) => {
    return (
        <Modal show={show} onHide={onHide} size="md" centered>
            <Modal.Header closeButton>
                <Modal.Title>Danh sách Seeker đang tư vấn</Modal.Title>
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
                                {seekers.map((seeker, index) => (
                                    <tr key={seeker.id || index}>
                                        <td className="text-center">{index + 1}</td>
                                        <td>{seeker.name || `Seeker ${seeker.id}`}</td>
                                    </tr>
                                ))}
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