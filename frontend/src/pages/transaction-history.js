import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import '../css/transaction-history.css';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        // Mock data
        const mockTransactions = [
            {
                id: 1,
                transactionId: 'TXN001',
                package: 'Premium',
                amount: 299000,
                status: 'SUCCESS',
                date: '2024-01-15',
                time: '14:30:25',
                paymentMethod: 'Banking',
                description: 'Premium Package Purchase'
            },
            {
                id: 2,
                transactionId: 'TXN002',
                package: 'Basic',
                amount: 99000,
                status: 'SUCCESS',
                date: '2024-01-10',
                time: '09:15:42',
                paymentMethod: 'E-Wallet',
                description: 'Basic Package Purchase'
            },
            {
                id: 3,
                transactionId: 'TXN003',
                package: 'Professional',
                amount: 499000,
                status: 'FAILED',
                date: '2024-01-05',
                time: '16:45:10',
                paymentMethod: 'Credit Card',
                description: 'Professional Package Purchase'
            },
            {
                id: 4,
                transactionId: 'TXN004',
                package: 'Premium',
                amount: 299000,
                status: 'PENDING',
                date: '2024-01-20',
                time: '11:20:33',
                paymentMethod: 'Banking',
                description: 'Premium Package Purchase'
            }
        ];

        // Simulate loading
        setTimeout(() => {
            setTransactions(mockTransactions);
            setLoading(false);
        }, 1000);
    }, []);

    const getStatusBadge = (status) => {
        const statusClasses = {
            SUCCESS: 'badge-success',
            FAILED: 'badge-danger',
            PENDING: 'badge-warning',
            CANCELLED: 'badge-secondary'
        };
        return statusClasses[status] || 'badge-secondary';
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const showTransactionDetail = (transaction) => {
        setSelectedTransaction(transaction);
        setShowModal(true);
    };

    if (loading) {
        return (
            <div className="transaction-history-page">
                <Header />
                <div className="loading-container">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p>Đang tải lịch sử giao dịch...</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="transaction-history-page">
            <Header />
            
            <div className="transaction-container">
                <div className="container my-5">
                    {/* Header Section */}
                    <div className="page-header text-center">
                        <h1 className="page-title">
                            <i className="fas fa-history"></i>
                            Lịch Sử Giao Dịch
                        </h1>
                        <p className="page-subtitle">
                            Quản lý và theo dõi tất cả các giao dịch của bạn
                        </p>
                    </div>

                    {/* Statistics Cards */}
                    <div className="row mb-4">
                        <div className="col-md-3">
                            <div className="stats-card">
                                <div className="stats-icon">
                                    <i className="fas fa-chart-line"></i>
                                </div>
                                <div className="stats-content">
                                    <h3>4</h3>
                                    <p>Tổng Giao Dịch</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="stats-card success">
                                <div className="stats-icon">
                                    <i className="fas fa-check-circle"></i>
                                </div>
                                <div className="stats-content">
                                    <h3>2</h3>
                                    <p>Thành Công</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="stats-card warning">
                                <div className="stats-icon">
                                    <i className="fas fa-clock"></i>
                                </div>
                                <div className="stats-content">
                                    <h3>1</h3>
                                    <p>Đang Xử Lý</p>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="stats-card amount">
                                <div className="stats-icon">
                                    <i className="fas fa-wallet"></i>
                                </div>
                                <div className="stats-content">
                                    <h3>{formatCurrency(398000)}</h3>
                                    <p>Tổng Tiền</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction Table */}
                    <div className="transaction-table">
                        <div className="card">
                            <div className="card-header">
                                <h5 className="mb-0">
                                    <i className="fas fa-list"></i>
                                    Danh Sách Giao Dịch ({transactions.length})
                                </h5>
                            </div>
                            <div className="card-body p-0">
                                <div className="table-responsive">
                                    <table className="table table-hover mb-0">
                                        <thead>
                                            <tr>
                                                <th>Mã Giao Dịch</th>
                                                <th>Gói Dịch Vụ</th>
                                                <th>Số Tiền</th>
                                                <th>Trạng Thái</th>
                                                <th>Ngày/Giờ</th>
                                                <th>Phương Thức</th>
                                                <th>Thao Tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {transactions.map(transaction => (
                                                <tr key={transaction.id}>
                                                    <td>
                                                        <span className="transaction-id">
                                                            {transaction.transactionId}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="package-name">
                                                            {transaction.package}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className="amount">
                                                            {formatCurrency(transaction.amount)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getStatusBadge(transaction.status)}`}>
                                                            {transaction.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <div className="datetime">
                                                            <div>{transaction.date}</div>
                                                            <small className="text-muted">{transaction.time}</small>
                                                        </div>
                                                    </td>
                                                    <td>
                                                        <span className="payment-method">
                                                            {transaction.paymentMethod}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <button
                                                            className="btn btn-sm btn-outline-primary"
                                                            onClick={() => showTransactionDetail(transaction)}
                                                        >
                                                            <i className="fas fa-eye"></i>
                                                            Chi Tiết
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Transaction Detail Modal */}
            {showModal && selectedTransaction && (
                <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">
                                    <i className="fas fa-receipt"></i>
                                    Chi Tiết Giao Dịch
                                </h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>
                            </div>
                            <div className="modal-body">
                                <div className="transaction-detail">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <label>Mã Giao Dịch:</label>
                                                <span>{selectedTransaction.transactionId}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <label>Trạng Thái:</label>
                                                <span className={`badge ${getStatusBadge(selectedTransaction.status)}`}>
                                                    {selectedTransaction.status}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <label>Gói Dịch Vụ:</label>
                                                <span>{selectedTransaction.package}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <label>Số Tiền:</label>
                                                <span className="amount">{formatCurrency(selectedTransaction.amount)}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <label>Phương Thức:</label>
                                                <span>{selectedTransaction.paymentMethod}</span>
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="detail-item">
                                                <label>Ngày/Giờ:</label>
                                                <span>{selectedTransaction.date} {selectedTransaction.time}</span>
                                            </div>
                                        </div>
                                        <div className="col-12">
                                            <div className="detail-item">
                                                <label>Mô Tả:</label>
                                                <span>{selectedTransaction.description}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Đóng
                                </button>
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={() => alert('Tính năng tải hóa đơn đang phát triển')}
                                >
                                    <i className="fas fa-download"></i>
                                    Tải Hóa Đơn
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default TransactionHistory;
