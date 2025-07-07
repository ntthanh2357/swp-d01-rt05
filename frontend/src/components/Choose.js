import React from 'react';
import '../css/countries.css';

const chooseData = [
    {
        icon: '⚡',
        title: 'Nhanh chóng hiện thực hóa giấc mơ du học',
        description: 'Sử dụng tính năng IDP FastLane để kiểm tra nhanh chóng xem bạn có đủ điều kiện xét tuyển các khóa học.',
        link: '#'
    },
    {
        icon: '🎓',
        title: 'Học bổng – hơn 5.100 cơ hội đang chờ đón',
        description: 'Giới thiệu các cơ hội học bổng từ hơn 370 tổ chức trên toàn thế giới và từng bước thực hiện để biến ước mơ của bạn thành hiện thực.',
        link: '#'
    },
    {
        icon: '🧮',
        title: 'Công cụ tính toán chi phí',
        description: 'Công cụ này giúp sinh viên quốc tế quản lý ngân sách của mình dễ dàng với tiện ích tính chi phí tiện lợi.',
        link: '#'
    },
    {
        icon: '📱',
        title: 'IDP trong tầm tay bạn',
        description: 'Ứng dụng IDP Live cho phép người dùng tìm kiếm các khóa học, nộp đơn hồ sơ vào các trường Đại học và theo dõi tiến trình của mình.',
        link: '#'
    },
    {
        icon: '🏠',
        title: 'Những điều cần thiết cho sinh viên',
        description: 'Cung cấp các dịch vụ hỗ trợ cho nhiều khía cạnh khác nhau của việc du học, bao gồm visa, chỗ ở và bảo hiểm sức khỏe.',
        link: '#'
    },
    {
        icon: '👨‍🎓',
        title: 'Tư vấn chuyên nghiệp',
        description: 'Hướng dẫn tận tâm từ các chuyên gia tư vấn, những người có thể hỗ trợ sinh viên trong suốt hành trình du học của mình.',
        link: '#'
    }
];

export default function Choose() {
    return (
        <section className="container-fluid bg-custom-gray py-5">
            <div className="container">
            <h2 className="fw-bold mb-4 text-center mb-4">Heatwave có thể hỗ trợ bạn</h2>
            <div className="row">
                {chooseData.map((item, index) => (
                    <div className="col-md-4 mb-4" key={index}>
                        <div className="card h-100 shadow-sm">
                            <div className="card-body">
                                <div className="mb-3" style={{ fontSize: '30px' }}>{item.icon}</div>
                                <h5 className="card-title fw-bold">{item.title}</h5>
                                <p className="card-text">{item.description}</p>
                                <a href={item.link} className="text-primary fw-bold">Learn More &gt;</a>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
        </section>
    );
}
