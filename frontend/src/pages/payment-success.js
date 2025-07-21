// Import React hooks và utilities cần thiết
import { useEffect, useState, useContext } from 'react';
// Import React Router hooks để điều hướng và lấy URL parameters
import { useNavigate, useSearchParams } from 'react-router-dom';
// Import UserContext để cập nhật thông tin gói đã mua
import { UserContext } from '../contexts/UserContext';

/**
 * Component PaymentSuccess - Trang xử lý thành công thanh toán
 * Chức năng:
 * - Xử lý callback từ cổng thanh toán PayOS
 * - Xác nhận thanh toán thành công với backend
 * - Cập nhật gói dịch vụ đã mua cho user
 * - Hiển thị thông báo thành công và chuyển hướng
 */
export default function PaymentSuccess() {
  const navigate = useNavigate(); // Hook để điều hướng
  const [searchParams] = useSearchParams(); // Hook để lấy query parameters từ URL
  
  // State management cho component
  const [processing, setProcessing] = useState(true); // Trạng thái đang xử lý
  const [message, setMessage] = useState('Đang xử lý thanh toán...'); // Thông báo hiển thị
  const { updatePurchasedPackage } = useContext(UserContext); // Function cập nhật gói đã mua

  // Effect để xử lý thanh toán khi component mount
  useEffect(() => {
    /**
     * Hàm xử lý thanh toán thành công
     * - Lấy orderCode và status từ URL params
     * - Gọi API backend để xác nhận thanh toán
     * - Cập nhật gói dịch vụ trong UserContext
     */
    const handlePaymentSuccess = async () => {
      try {
        // Lấy thông tin thanh toán từ URL parameters
        const orderCode = searchParams.get('orderCode'); // Mã đơn hàng từ PayOS
        const status = searchParams.get('status'); // Trạng thái thanh toán
        
        if (orderCode && status === 'PAID') {
          // Gọi backend để xác nhận thanh toán thành công
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
            
            // Cập nhật purchased package trong UserContext
            const pendingPayment = localStorage.getItem('pendingPayment');
            if (pendingPayment) {
              try {
                const paymentInfo = JSON.parse(pendingPayment);
                // Cập nhật gói đã mua trong context
                updatePurchasedPackage(paymentInfo.packageId);
              } catch (e) {
                console.error('Error parsing pending payment:', e);
              }
            }
            
            // Dọn dẹp localStorage sau khi xử lý thành công
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
        setProcessing(false); // Tắt trạng thái processing
        
        // Tự động chuyển hướng về trang thanh toán sau 3 giây
        const timer = setTimeout(() => {
          navigate('/payment');
        }, 3000);
        
        return () => clearTimeout(timer); // Cleanup timer
      }
    };

    handlePaymentSuccess();
  }, [navigate, searchParams, updatePurchasedPackage]);

  // Render giao diện trang thanh toán thành công
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      {processing ? (
        // Hiển thị khi đang xử lý thanh toán
        <>
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 style={{ color: '#0d6efd', marginBottom: 16 }}>{message}</h4>
        </>
      ) : (
        // Hiển thị khi đã xử lý xong thanh toán
        <>
          <h2 style={{ color: 'green', marginBottom: 16 }}>{message}</h2>
          <p>Bạn sẽ được chuyển về trang thanh toán trong giây lát...</p>
        </>
      )}
    </div>
  );
}
