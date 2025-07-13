import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/payment.css";

const packages = [
  {
    id: "basic",
    name: "GÓI HỖ TRỢ ĐƠN GIẢN",
    description: "Phù hợp với người có thể tự làm, chỉ cần hướng dẫn đúng lộ trình.",
    price: "10.000 VNĐ",
    amount: 10000,
    features: [
      "Định hướng chọn ngành, trường, học bổng phù hợp.",
      "Checklist hồ sơ cần chuẩn bị.",
      "Mẫu CV, SOP, thư giới thiệu.",
      "Nhận xét nhanh 1 lần trên hồ sơ.",
      "Không bao gồm: sửa bài luận, hỗ trợ nộp hồ sơ hoặc visa.",
    ],
    color: "primary",
    icon: "fas fa-star"
  },
  {
    id: "premium",
    name: "GÓI TOÀN DIỆN",
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
    popular: true
  },
];

export default function PaymentPage() {
  const handlePayment = async (selectedPackage) => {
    try {
      const response = await fetch("/api/payos/create-payment-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedPackage.amount,
          description: selectedPackage.name,
        }),
      });

      const data = await response.json();
      if (data.success && data.checkoutUrl) {
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
      </div>
      
      <Footer />
    </div>
  );
}
