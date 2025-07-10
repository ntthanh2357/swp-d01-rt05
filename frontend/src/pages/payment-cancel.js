import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancel() {
  const navigate = useNavigate();

  const handleBackToPayment = () => {
    navigate('/payment');
  };

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card text-center">
            <div className="card-body">
              <div className="text-warning mb-3">
                <i className="fas fa-exclamation-triangle fa-4x"></i>
              </div>
              <h2 className="text-warning">Thanh toán đã bị hủy</h2>
              <p className="text-muted">
                Giao dịch thanh toán của bạn đã bị hủy. Bạn có thể thử lại hoặc liên hệ với chúng tôi nếu cần hỗ trợ.
              </p>
              
              <div className="mt-4">
                <button 
                  className="btn btn-primary me-3"
                  onClick={handleBackToPayment}
                >
                  Thử lại thanh toán
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleBackToHome}
                >
                  Về trang chủ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
