// Import React hooks cần thiết
import { useEffect } from 'react';
// Import React Router hook để điều hướng
import { useNavigate } from 'react-router-dom';

/**
 * Component PaymentCancel - Trang xử lý hủy thanh toán
 * Chức năng:
 * - Hiển thị thông báo thanh toán bị hủy
 * - Tự động chuyển hướng về trang thanh toán sau 2 giây
 * - Dọn dẹp các thông tin thanh toán tạm thời (nếu có)
 */
export default function PaymentCancel() {
  const navigate = useNavigate(); // Hook để điều hướng
  
  // Effect để tự động chuyển hướng
  useEffect(() => {
    // Dọn dẹp localStorage nếu có thông tin thanh toán pending
    localStorage.removeItem('pendingPayment');
    
    // Tự động chuyển về trang thanh toán sau 2 giây
    const timer = setTimeout(() => {
      navigate('/payment');
    }, 2000);
    
    // Cleanup timer khi component unmount
    return () => clearTimeout(timer);
  }, [navigate]);
  
  // Render giao diện trang hủy thanh toán
  return (
    <div style={{ 
      minHeight: '60vh', 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center' 
    }}>
      {/* Thông báo thanh toán bị hủy */}
      <h2 style={{ color: 'red', marginBottom: 16 }}>
        Thanh toán đã bị hủy!
      </h2>
      
      {/* Thông báo chuyển hướng */}
      <p>Bạn sẽ được chuyển về trang thanh toán trong giây lát...</p>
    </div>
  );
}
