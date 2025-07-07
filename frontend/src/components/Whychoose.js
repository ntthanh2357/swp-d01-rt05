import React from 'react';
import { FaGraduationCap, FaUsers, FaGlobe, FaCheckCircle, FaUniversity } from 'react-icons/fa';
import '../css/countries.css';
const reasons = [
    {
        icon: <FaGraduationCap size={28} />,
        title: 'Hơn 55 kinh nghiệm',
        text: 'Với 55 năm kinh nghiệm, chúng tôi đã truyền cảm hứng cho hàng triệu sinh viên tạo nên những dấu ấn đáng nhớ trên...',
        link: 'Tìm hiểu thêm',
    },
    {
        icon: <FaUsers size={28} />,
        title: 'Thay đổi tương lai:',
        text: 'Heatwave đồng hành cùng hàng triệu sinh viên và đã biến giấc mơ du học tại các trường Đại học hàng đầu trở thành hiện thực.',
        link: 'Trò chuyện với tư vấn',
    },
    {
        icon: <FaGlobe size={28} />,
        title: 'Mạng lưới toàn cầu, hỗ trợ cá nhân hóa:',
        text: 'Với 210 văn phòng và 2.200 tư vấn viên tại 35 quốc gia, IDP cam kết hỗ trợ hành trình của bạn.',
        link: 'Liên hệ ngay',
    }
];

export default function WhyChoose() {
    return (
        <section className="container-fluid bg-custom-gray py-5 mt-5">
            <div className="container">
                <h3 className="text-center mb-4">Chọn Heatwave ngay hôm nay</h3>
                <div className="row">
                    {reasons.map((reason, index) => (
                        <div key={index} className="col-md-4 mb-4 d-flex align-items-stretch">
                            <div className="card shadow-sm p-3 w-100">
                                <div className="text-primary mb-2">{reason.icon}</div>
                                <h5 className="fw-bold">{reason.title}</h5>
                                <p className="text-muted">{reason.text}</p>
                                <a href="#" className="text-primary fw-semibold">{reason.link} &rsaquo;</a>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>

    );
}
