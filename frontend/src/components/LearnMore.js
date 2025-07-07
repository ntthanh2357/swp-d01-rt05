import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const LearnMore = () => {
  const [expandedItems, setExpandedItems] = useState([]);

  const learnMoreData = [
    {
      id: 1,
      title: "Vì sao nên chọn Heatwave?",
      content: "Heatwave mang đến giải pháp giáo dục công nghệ hiện đại với đội ngũ chuyên gia hàng đầu."
    },
    {
      id: 2,
      title: "Chúng tôi làm gì",
      content: "Cung cấp các khóa học công nghệ chất lượng cao, tư vấn du học và hỗ trợ xin học bổng."
    },
     {
    id: 3,
    title: "Sự kiện",
    content: "Tham gia các hội thảo trực tuyến và offline về công nghệ mới nhất, gặp gỡ chuyên gia và cơ hội nhận học bổng giá trị."
  },
  {
    id: 4,
    title: "Tư vấn du học",
    content: "Đội ngũ tư vấn viên giàu kinh nghiệm sẽ giúp bạn lựa chọn trường học, ngành học phù hợp với năng lực và nguyện vọng."
  },
  {
    id: 5,
    title: "Cách tìm khóa học",
    content: "Hệ thống tìm kiếm thông minh của Heatwave giúp bạn dễ dàng tìm được khóa học phù hợp dựa trên trình độ, ngân sách và định hướng nghề nghiệp."
  },
  {
    id: 6,
    title: "Hỗ trợ xin thị thực",
    content: "Hỗ trợ chuẩn bị hồ sơ xin visa du học với tỷ lệ thành công cao. Tư vấn các thủ tục cần thiết và chuẩn bị phỏng vấn."
  },
  {
    id: 7,
    title: "Hỗ trợ trước khi khởi hành",
    content: "Cung cấp thông tin về nhà ở, bảo hiểm, phương tiện đi lại và các chuẩn bị cần thiết trước khi lên đường du học."
  },
  {
    id: 8,
    title: "Hỗ trợ sinh sống ở nước ngoài",
    content: "Đội ngũ hỗ trợ học viên tại nước ngoài luôn sẵn sàng giúp đỡ bạn trong suốt quá trình học tập và sinh sống."
  }
];
  

  const toggleItem = (id) => {
    setExpandedItems(prev => 
      prev.includes(id) 
        ? prev.filter(itemId => itemId !== id) 
        : [...prev, id]
    );
  };

  return (
    <div className="container py-5 bg-light">
      <h3 className="text-center mb-4 fw-bold position-relative">
        Tìm hiểu thêm
        <span className="position-absolute bottom-0 start-50 translate-middle-x bg-primary" 
              style={{ width: '80px', height: '3px' }}></span>
      </h3>
      
      <div className="row g-4">
        {learnMoreData.map((item) => (
          <div key={item.id} className="col-md-6 col-lg-4">
            <div className="card h-100 shadow-sm border-0 overflow-hidden">
              <div 
                className="card-header bg-white d-flex justify-content-between align-items-center cursor-pointer"
                onClick={() => toggleItem(item.id)}
                style={{ cursor: 'pointer' }}
              >
                <h5 className="mb-0 fw-semibold">{item.title}</h5>
                <span className={`fs-4 transition-all ${expandedItems.includes(item.id) ? 'rotate-180' : ''}`}>
                  {expandedItems.includes(item.id) ? '−' : '+'}
                </span>
              </div>
              
              {expandedItems.includes(item.id) && (
                <div className="card-body bg-light">
                  <p className="mb-0">{item.content}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LearnMore;