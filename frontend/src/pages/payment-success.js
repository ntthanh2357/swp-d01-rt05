import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

export default function PaymentSuccess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [paymentInfo, setPaymentInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const orderCode = searchParams.get('orderCode');
    const status = searchParams.get('status');
    
    if (orderCode && status === 'PAID') {
      // Fetch payment details from backend
      fetch(`/api/payos/payment-info/${orderCode}`)
        .then(response => response.json())
        .then(data => {
          if (data.success) {
            setPaymentInfo(data.paymentInfo);
          }
          setLoading(false);
        })
        .catch(error => {
          console.error('Error fetching payment info:', error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [searchParams]);

  const handleBackToHome = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3">Đang xác nhận thanh toán...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card text-center">
            <div className="card-body">
              <div className="text-success mb-3">
                <i className="fas fa-check-circle fa-4x"></i>
              </div>
              <h2 className="text-success">Thanh toán thành công!</h2>
              <p className="text-muted">
                Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.
              </p>
              
              {paymentInfo && (
                <div className="mt-4">
                  <h5>Chi tiết thanh toán:</h5>
                  <div className="text-start">
                    <p><strong>Mã đơn hàng:</strong> {paymentInfo.orderCode}</p>
                    <p><strong>Số tiền:</strong> {paymentInfo.amount?.toLocaleString()} VNĐ</p>
                    <p><strong>Mô tả:</strong> {paymentInfo.description}</p>
                    <p><strong>Trạng thái:</strong> <span className="text-success">Đã thanh toán</span></p>
                  </div>
                </div>
              )}
              
              <button 
                className="btn btn-primary mt-3"
                onClick={handleBackToHome}
              >
                Về trang chủ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
