import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/countries.css';

const FlywireAd = () => {
  const [showDetails, setShowDetails] = useState(false);

  const handleLearnMore = () => {
    setShowDetails(!showDetails);
    toast.info(showDetails ? 'Đã ẩn thông tin chi tiết' : 'Đang hiển thị thông tin chi tiết...', {
      position: "top-center",
      autoClose: 1000,
    });
  };

  return (
    <div className="container my-5">
      <ToastContainer />
      
      <div className="flywire-ad p-4 rounded shadow">
        <h1 className="text-primary mb-4">Thanh toán quốc tế dễ dàng hơn với dịch vụ Flywire cùng Heatwave</h1>
        
        <p className="lead mb-4">
          Bạn cần chuyển tiền học phí, tiền nhà hoặc chi phí sinh hoạt tại Úc, Anh, Mỹ hay bất kỳ quốc gia nào? 
          Cùng Flywire và Heatwave nhận ngay giải thưởng <span className="fw-bold text-danger">3.000 USD</span> và trải nghiệm dịch vụ chuyển tiền quốc tế!
        </p>
        
        <div className="text-center my-4">
          <img 
            src="https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2024/03/loi-chuc-tot-nghiep-dai-hoc-anh-dai-dien.jpg" 
            alt="Flywire Payment" 
            className="img-fluid rounded mb-4"
          />
        </div>
        
        <div className="text-center">
          <button 
            onClick={handleLearnMore}
            className="btn btn-primary btn-lg px-5 mb-3"
          >
            {showDetails ? 'Ẩn thông tin' : 'Tìm hiểu ngay'}
          </button>
        </div>
        
        {showDetails && (
          <div className="additional-info p-3 mt-3 bg-light rounded animate-fade-in">
            <h3 className="text-success">✨ Ưu đãi đặc biệt từ Heatwave</h3>
            <ul className="mt-3">
              <li>Miễn phí chuyển tiền lần đầu cho khách hàng mới</li>
              <li>Tỷ giá cạnh tranh, không phí ẩn</li>
              <li>Hỗ trợ 24/7 từ đội ngũ chuyên gia tài chính</li>
              <li>Quy trình đơn giản chỉ với 3 bước</li>
              <li>Bảo mật tuyệt đối với công nghệ mã hóa tiên tiến</li>
            </ul>
            <p className="mt-3 fst-italic">"Heatwave cam kết mang đến giải pháp chuyển tiền quốc tế nhanh chóng, an toàn và tiết kiệm nhất cho cộng đồng du học sinh Việt Nam."</p>
          </div>
        )}
        
        <h2 className="text-center mt-5 text-muted">Giúp ước mơ của bạn bay xa</h2>
      </div>
    </div>
  );
};

export default FlywireAd;