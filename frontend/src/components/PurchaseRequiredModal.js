import React from 'react';
import { Link } from 'react-router-dom';
import '../css/PurchaseRequiredModal.css';

const PurchaseRequiredModal = ({ show, onClose }) => {
    if (!show) return null;

    return (
        <div className="modal fade show purchase-required-modal" style={{ display: 'block' }} tabIndex="-1">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            <i className="fas fa-lock me-2"></i>
                            Yêu cầu mua gói dịch vụ
                        </h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={onClose}
                            aria-label="Close"
                        ></button>
                    </div>
                    <div className="modal-body text-center">
                        <div className="purchase-icon mb-3">
                            <i className="fas fa-shopping-cart fa-3x text-primary"></i>
                        </div>
                        <h6 className="mb-3">Để sử dụng tính năng nhắn tin</h6>
                        <p className="text-muted mb-4">
                            Bạn cần mua một trong các gói dịch vụ của chúng tôi để có thể 
                            nhắn tin và tư vấn trực tiếp với các chuyên gia.
                        </p>
                        <div className="benefits-list text-start mb-4">
                            <h6>Lợi ích khi mua gói:</h6>
                            <ul className="list-unstyled">
                                <li><i className="fas fa-check text-success me-2"></i>Tư vấn trực tiếp với chuyên gia</li>
                                <li><i className="fas fa-check text-success me-2"></i>Hỗ trợ 24/7 qua tin nhắn</li>
                                <li><i className="fas fa-check text-success me-2"></i>Tài liệu và mẫu đơn độc quyền</li>
                                <li><i className="fas fa-check text-success me-2"></i>Theo dõi tiến độ cá nhân hóa</li>
                            </ul>
                        </div>
                    </div>
                    <div className="modal-footer justify-content-center">
                        <button
                            type="button"
                            className="btn btn-secondary me-2"
                            onClick={onClose}
                        >
                            Đóng
                        </button>
                        <Link
                            to="/payment"
                            className="btn btn-primary"
                            onClick={onClose}
                        >
                            <i className="fas fa-shopping-cart me-2"></i>
                            Xem gói dịch vụ
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PurchaseRequiredModal;
