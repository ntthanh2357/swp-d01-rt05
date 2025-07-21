// Import React hooks và components cần thiết
import React, { useState, useEffect, useContext } from "react";
// Import các component layout
import Header from "../components/Header";
import Footer from "../components/Footer";
// Import UserContext để quản lý thông tin người dùng
import { UserContext } from "../contexts/UserContext";
// Import CSS styling cho trang thanh toán
import "../css/payment.css";

// Định nghĩa các gói dịch vụ tư vấn học bổng
const packages = [
  {
    id: "basic",
    name: "GÓI HỖ TRỢ ĐƠN GIẢN", // Tên gói cơ bản
    description: "Phù hợp với người có thể tự làm, chỉ cần hướng dẫn đúng lộ trình.",
    price: "10.000 VNĐ", // Giá hiển thị
    amount: 10000, // Số tiền thực tế
    features: [
      "Định hướng chọn ngành, trường, học bổng phù hợp.",
      "Checklist hồ sơ cần chuẩn bị.",
      "Mẫu CV, SOP, thư giới thiệu.",
      "Nhận xét nhanh 1 lần trên hồ sơ.",
      "Không bao gồm: sửa bài luận, hỗ trợ nộp hồ sơ hoặc visa.",
    ],
    color: "primary", // Màu theme của gói
    icon: "fas fa-star" // Icon hiển thị
  },
  {
    id: "premium",
    name: "GÓI TOÀN DIỆN", // Tên gói cao cấp
    description: "Phù hợp với người cần hỗ trợ đầy đủ toàn bộ quy trình.",
    price: "50.000 VNĐ",
    amount: 50000,
    features: [
      "Tư vấn chiến lược toàn diện về ngành học và quốc gia.",
      "Sửa CV, bài luận, thư giới thiệu không giới hạn.",
      "Hướng dẫn và đồng hành nộp hồ sơ học bổng, visa.",
      "Ưu tiên phản hồi nhanh và tư vấn 1:1.",
    ],
    color: "success",
    icon: "fas fa-crown",
    popular: true // Đánh dấu gói phổ biến
  },
];

/**
 * Component PaymentPage - Trang thanh toán và lịch sử giao dịch
 * Chức năng:
 * - Hiển thị các gói dịch vụ có sẵn
 * - Cho phép chọn và thanh toán gói dịch vụ
 * - Hiển thị lịch sử giao dịch của người dùng
 * - Quản lý các trạng thái thanh toán
 */
export default function PaymentPage() {
  const { user } = useContext(UserContext); // Lấy thông tin user từ context
  
  // State management cho component
  const [activeTab, setActiveTab] = useState('payment'); // Tab hiện tại (payment/history)
  const [transactions, setTransactions] = useState([]); // Danh sách giao dịch
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [selectedTransaction, setSelectedTransaction] = useState(null); // Giao dịch được chọn
  const [showModal, setShowModal] = useState(false); // Trạng thái hiển thị modal

  // Effect để load dữ liệu khi thay đổi tab
  useEffect(() => {
    // Load lịch sử giao dịch khi chuyển sang tab history
    if (activeTab === 'history') {
      fetchTransactionHistory();
    }
  }, [activeTab]);

  /**
   * Hàm lấy lịch sử giao dịch của người dùng
   * Hiện tại sử dụng mock data để demo
   */
  const fetchTransactionHistory = async () => {
    setLoading(true); // Bật trạng thái loading
    try {
      // Mock data for demonstration - sẽ thay thế bằng API call thực tế
      const mockTransactions = [
        {
          id: 1,
          transactionId: 'TXN001', // Mã giao dịch
          package: 'GÓI TOÀN DIỆN', // Tên gói đã mua
          amount: 50000, // Số tiền
          status: 'SUCCESS', // Trạng thái giao dịch
          date: '2024-01-15', // Ngày giao dịch
          time: '14:30:25', // Thời gian giao dịch
          paymentMethod: 'Banking', // Phương thức thanh toán
          description: 'Premium Package Purchase' // Mô tả giao dịch
        },
        {
          id: 2,
          transactionId: 'TXN002',
          package: 'GÓI HỖ TRỢ ĐƠN GIẢN',
          amount: 10000,
          status: 'SUCCESS',
          date: '2024-01-10',
          time: '09:15:42',
          paymentMethod: 'E-Wallet',
          description: 'Basic Package Purchase'
        },
        {
          id: 3,
          transactionId: 'TXN003',
          package: 'GÓI TOÀN DIỆN',
          amount: 50000,
          status: 'FAILED', // Giao dịch thất bại
          date: '2024-01-05',
          time: '16:45:10',
          paymentMethod: 'Credit Card',
          description: 'Premium Package Purchase'
        }
      ];
      
      // Simulate API delay
      setTimeout(() => {
        setTransactions(mockTransactions);
        setLoading(false); // Tắt trạng thái loading
      }, 1000);
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      SUCCESS: 'badge bg-success',
      FAILED: 'badge bg-danger',
      PENDING: 'badge bg-warning',
      CANCELLED: 'badge bg-secondary'
    };
    return statusClasses[status] || 'badge bg-secondary';
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
  const handlePayment = async (selectedPackage) => {
    try {
      // Check if user is logged in
      if (!user || !user.accessToken) {
        alert("Vui lòng đăng nhập để thực hiện thanh toán.");
        return;
      }

      const response = await fetch("/api/payos/create-payment-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify({
          amount: selectedPackage.amount,
          description: selectedPackage.name,
          packageId: selectedPackage.id,
        }),
      });

      const data = await response.json();
      if (data.success && data.checkoutUrl) {
        // Store package info in localStorage for payment success page
        localStorage.setItem('pendingPayment', JSON.stringify({
          packageId: selectedPackage.id,
          packageName: selectedPackage.name,
          orderCode: data.orderCode,
          paymentId: data.paymentId
        }));
        
        // Redirect to PayOS hosted payment page
        window.location.href = data.checkoutUrl;
      } else {
        alert("Không thể tạo link thanh toán: " + (data.message || "Lỗi không xác định"));
      }
    } catch (error) {
      alert("Lỗi kết nối server.");
      console.error(error);
    }
  };

  return (
    <div className="payment-page">
      <Header />
      
      <div className="payment-container">
        <div className="container py-5">
          {/* Tab Navigation */}
          <div className="row mb-4">
            <div className="col-12">
              <ul className="nav nav-pills nav-justified" role="tablist">
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'payment' ? 'active' : ''}`}
                    onClick={() => setActiveTab('payment')}
                    type="button"
                    role="tab"
                  >
                    <i className="fas fa-credit-card me-2"></i>
                    Thanh Toán
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className={`nav-link ${activeTab === 'history' ? 'active' : ''}`}
                    onClick={() => setActiveTab('history')}
                    type="button"
                    role="tab"
                  >
                    <i className="fas fa-history me-2"></i>
                    Lịch Sử Giao Dịch
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Tab Content */}
          {activeTab === 'payment' && (
            <div className="tab-content">
              <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-primary mb-3">
                  <i className="fas fa-credit-card me-3"></i>
                  Chọn Gói Học Bổng
                </h1>
                <p className="lead text-muted">
                  Chọn gói dịch vụ phù hợp với nhu cầu của bạn để nhận được sự hỗ trợ tốt nhất
                </p>
              </div>
              
              <div className="row justify-content-center">
                {packages.map((pkg) => (
                  <div key={pkg.id} className="col-lg-5 col-md-6 mb-4">
                    <div className={`card payment-card h-100 ${pkg.popular ? 'popular-card' : ''}`}>
                      {pkg.popular && (
                        <div className="popular-badge">
                          <span>PHỔ BIẾN NHẤT</span>
                        </div>
                      )}
                      
                      <div className={`card-header text-white bg-${pkg.color}`}>
                        <div className="d-flex justify-content-between align-items-center">
                          <h4 className="card-title mb-0">
                            <i className={`${pkg.icon} me-2`}></i>
                            {pkg.name}
                          </h4>
                        </div>
                      </div>
                      
                      <div className="card-body">
                        <p className="card-text text-muted mb-4">{pkg.description}</p>
                        
                        <div className="price-section mb-4">
                          <h2 className={`price-text text-${pkg.color}`}>
                            {pkg.price}
                          </h2>
                        </div>
                        
                        <div className="features-section">
                          <h6 className="features-title mb-3">
                            <i className="fas fa-check-circle me-2"></i>
                            Tính năng bao gồm:
                          </h6>
                          <ul className="features-list">
                            {pkg.features.map((feature, index) => (
                              <li key={index} className="feature-item">
                                <i className="fas fa-check text-success me-2"></i>
                                {feature}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                      
                      <div className="card-footer bg-transparent border-0">
                        <button
                          className={`btn btn-${pkg.color} btn-lg w-100 payment-btn`}
                          onClick={() => handlePayment(pkg)}
                        >
                          <i className="fas fa-shopping-cart me-2"></i>
                          Thanh toán ngay
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="text-center mt-5">
                <div className="payment-info">
                  <h5 className="mb-3">
                    <i className="fas fa-shield-alt me-2"></i>
                    Thanh toán an toàn và bảo mật
                  </h5>
                  <p className="text-muted mb-4">
                    Chúng tôi sử dụng công nghệ mã hóa SSL và đối tác thanh toán uy tín để bảo vệ thông tin của bạn
                  </p>
                  <div className="payment-methods">
                    <img src="/images/payment-methods.png" alt="Payment Methods" className="payment-methods-img" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Transaction History Tab Content */}
          {activeTab === 'history' && (
            <div className="tab-content">
              <div className="text-center mb-5">
                <h1 className="display-4 fw-bold text-primary mb-3">
                  <i className="fas fa-history me-3"></i>
                  Lịch Sử Giao Dịch
                </h1>
                <p className="lead text-muted">
                  Xem tất cả các giao dịch đã thực hiện
                </p>
              </div>

              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3">Đang tải lịch sử giao dịch...</p>
                </div>
              ) : (
                <div className="row">
                  <div className="col-12">
                    <div className="card">
                      <div className="card-header">
                        <h5 className="mb-0">
                          <i className="fas fa-list me-2"></i>
                          Danh Sách Giao Dịch ({transactions.length})
                        </h5>
                      </div>
                      <div className="card-body p-0">
                        {transactions.length === 0 ? (
                          <div className="text-center py-5">
                            <i className="fas fa-receipt fa-3x text-muted mb-3"></i>
                            <h5>Chưa có giao dịch nào</h5>
                            <p className="text-muted">Bạn chưa thực hiện giao dịch nào.</p>
                          </div>
                        ) : (
                          <div className="table-responsive">
                            <table className="table table-hover mb-0">
                              <thead className="table-light">
                                <tr>
                                  <th>Mã Giao Dịch</th>
                                  <th>Gói Dịch Vụ</th>
                                  <th>Số Tiền</th>
                                  <th>Trạng Thái</th>
                                  <th>Ngày/Giờ</th>
                                  <th>Thao Tác</th>
                                </tr>
                              </thead>
                              <tbody>
                                {transactions.map(transaction => (
                                  <tr key={transaction.id}>
                                    <td>
                                      <span className="fw-bold text-primary">
                                        {transaction.transactionId}
                                      </span>
                                    </td>
                                    <td>{transaction.package}</td>
                                    <td className="fw-bold text-success">
                                      {formatCurrency(transaction.amount)}
                                    </td>
                                    <td>
                                      <span className={getStatusBadge(transaction.status)}>
                                        {transaction.status}
                                      </span>
                                    </td>
                                    <td>
                                      <div>
                                        <div>{transaction.date}</div>
                                        <small className="text-muted">{transaction.time}</small>
                                      </div>
                                    </td>
                                    <td>
                                      <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() => showTransactionDetail(transaction)}
                                      >
                                        <i className="fas fa-eye me-1"></i>
                                        Chi Tiết
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Transaction Detail Modal */}
      {showModal && selectedTransaction && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  <i className="fas fa-receipt me-2"></i>
                  Chi Tiết Giao Dịch
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6">
                    <strong>Mã Giao Dịch:</strong>
                    <p>{selectedTransaction.transactionId}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Trạng Thái:</strong>
                    <p>
                      <span className={getStatusBadge(selectedTransaction.status)}>
                        {selectedTransaction.status}
                      </span>
                    </p>
                  </div>
                  <div className="col-md-6">
                    <strong>Gói Dịch Vụ:</strong>
                    <p>{selectedTransaction.package}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Số Tiền:</strong>
                    <p className="fw-bold text-success">
                      {formatCurrency(selectedTransaction.amount)}
                    </p>
                  </div>
                  <div className="col-md-6">
                    <strong>Phương Thức:</strong>
                    <p>{selectedTransaction.paymentMethod}</p>
                  </div>
                  <div className="col-md-6">
                    <strong>Ngày/Giờ:</strong>
                    <p>{selectedTransaction.date} {selectedTransaction.time}</p>
                  </div>
                  <div className="col-12">
                    <strong>Mô Tả:</strong>
                    <p>{selectedTransaction.description}</p>
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
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
