import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [processing, setProcessing] = useState(true);
  const [message, setMessage] = useState('Đang xử lý thanh toán...');

  useEffect(() => {
    const handlePaymentSuccess = async () => {
      try {
        const orderCode = searchParams.get('orderCode');
        const status = searchParams.get('status');
        
        if (orderCode && status === 'PAID') {
          // Call backend to confirm payment success
          const response = await fetch('/api/payos/payment-success', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              orderCode: orderCode,
              status: status
            }),
          });

          const data = await response.json();
          
          if (data.success) {
            setMessage('Thanh toán thành công! Gói dịch vụ đã được kích hoạt.');
            
            // Clean up localStorage
            localStorage.removeItem('pendingPayment');
          } else {
            setMessage('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng liên hệ hỗ trợ.');
          }
        } else {
          setMessage('Thông tin thanh toán không hợp lệ.');
        }
      } catch (error) {
        console.error('Error processing payment success:', error);
        setMessage('Có lỗi xảy ra khi xử lý thanh toán. Vui lòng liên hệ hỗ trợ.');
      } finally {
        setProcessing(false);
        
        // Redirect after 3 seconds
        const timer = setTimeout(() => {
          navigate('/payment');
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    };

    handlePaymentSuccess();
  }, [navigate, searchParams]);

  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {processing ? (
        <>
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 style={{ color: '#0d6efd', marginBottom: 16 }}>{message}</h4>
        </>
      ) : (
        <>
          <h2 style={{ color: 'green', marginBottom: 16 }}>{message}</h2>
          <p>Bạn sẽ được chuyển về trang thanh toán trong giây lát...</p>
        </>
      )}
    </div>
  );
}
