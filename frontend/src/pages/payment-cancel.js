import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PaymentCancel() {
  const navigate = useNavigate();
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/payment');
    }, 2000); // 2 giây
    return () => clearTimeout(timer);
  }, [navigate]);
  return (
    <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h2 style={{ color: 'red', marginBottom: 16 }}>Thanh toán đã bị hủy!</h2>
      <p>Bạn sẽ được chuyển về trang thanh toán trong giây lát...</p>
    </div>
  );
}
