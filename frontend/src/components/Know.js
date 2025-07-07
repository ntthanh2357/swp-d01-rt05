import React, { useState } from 'react';
import '../css/know.css';

const knowList = [ 
  {
    id: 1,
    image: 'https://www.dinhcutoancau.vn/wp-content/uploads/2018/08/uastralia-map.png',
    title: 'Trường Đại học hàng đầu tại Úc',
    desc: 'Úc là điểm đến của nhiều trường đại học hàng đầu thế giới. Cùng IDP khám phá danh sách những trường đại học hàng đầu tại Úc nhé!',
    content: 'Danh sách gồm: University of Melbourne, University of Sydney, ANU, UNSW... và các tiêu chí chọn trường phù hợp.',
    button: 'Đọc ngay'
  },
  {
    id: 2,
    image: 'https://vn.ivyglobalschool.org/media/eiup30kw/visa-du-hoc-toan-phan.jpg?width=500&height=333.3333333333333',
    title: 'Visa du học Mỹ (Cập nhật mới nhất)',
    desc: 'Cập nhật mới về visa du học Mỹ tháng 5 năm 2025',
    content: 'Visa F1 yêu cầu I-20, chứng minh tài chính mạnh. Thời gian xử lý: 2–6 tuần. Cần đặt lịch hẹn phỏng vấn sớm.',
    button: 'Tìm hiểu ngay'
  },
  {
    id: 3,
    image: 'https://westepglobal.edu.vn/wp-content/uploads/2023/04/hoc-bong-thumb-900x600.jpg',
    title: 'Học bổng du học các nước mới nhất',
    desc: 'Bạn muốn tiết kiệm chi phí khi du học? Khám phá ngay những học bổng mới nhất năm 2025 tại Úc, Anh, Mỹ, Canada và New Zealand.',
    content: 'Học bổng chính phủ, trường đại học, và tổ chức hỗ trợ: học bổng toàn phần, bán phần, và hỗ trợ chi phí sinh hoạt.',
    button: 'Tìm hiểu ngay'
  },
  {
    id: 4,
    image: 'https://westepglobal.edu.vn/wp-content/uploads/2023/05/Cam-nang-du-hoc.jpg',
    title: 'Hồ sơ du học',
    desc: 'Chuẩn bị hồ sơ là bước quan trọng trong hành trình du học. Với hơn 55 năm kinh nghiệm, IDP sẽ giúp bạn tìm hiểu chi tiết.',
    content: 'Hồ sơ bao gồm: học bạ, bảng điểm, thư giới thiệu, bài luận cá nhân, chứng chỉ IELTS/TOEFL, hồ sơ tài chính...',
    button: 'Đọc ngay'
  },
];

export default function Know() {
  const [expandedId, setExpandedId] = useState(null);

  const toggleContent = (id) => {
    setExpandedId(prevId => (prevId === id ? null : id));
  };

  return (
    <div className="container my-5">
      <h3 className="fw-bold mb-4 title-underline">Bạn nên biết</h3>
      {knowList.map(item => (
        <div key={item.id} className="know-card">
          <div className="d-flex align-items-start">
            <img src={item.image} alt={item.title} className="thumb-img me-3" />
            <div className="flex-grow-1">
              <h6 className="fw-bold">{item.title}</h6>
              <p className="text-muted mb-2">{item.desc}</p>
            </div>
            <button className="btn btn-outline-dark rounded-pill" onClick={() => toggleContent(item.id)}>
              {item.button} <span className="ms-1">›</span>
            </button>
          </div>
          {expandedId === item.id && (
            <div className="mt-3 p-3 bg-light border rounded content-box">
              <p className="mb-0">{item.content}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
