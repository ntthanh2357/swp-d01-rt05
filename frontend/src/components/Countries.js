import React, { useState } from 'react';
import '../css/countries.css';
import { useNavigate } from 'react-router-dom';


const countries = [
    {
        name: 'Australia',
        image: 'https://vj-prod-website-cms.s3.ap-southeast-1.amazonaws.com/1178445745-copy-1674668916271.jpg',
        title: 'Úc: Trung tâm học thuật hàng đầu',
        content: 'Trải nghiệm nền giáo dục hàng đầu thế giới trong một môi trường đa văn hóa và năng động, mở ra cho bạn một tương lai thành công.',
        button: 'Du học tại Úc'
    },
    {
        name: 'Canada',
        image: 'https://newocean.edu.vn/wp-content/uploads/2024/03/tong-quan-dat-nuoc-Canada-min.jpg',
        title: 'Canada: Cánh cửa đến nền giáo dục chất lượng',
        content: 'Du học tại Canada giúp bạn tiếp cận chương trình giáo dục tiên tiến với mức chi phí hợp lý và môi trường sống an toàn.',
        button: 'Du học tại Canada'
    },
    {
        name: 'United Kingdom',
        image: 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/14/10/2f/fe/united-kingdom.jpg?w=1200&h=700&s=1',
        title: 'Anh Quốc: Nơi truyền thống gặp hiện đại',
        content: 'Nền giáo dục đẳng cấp thế giới tại Vương quốc Anh sẽ là bàn đạp giúp bạn phát triển tư duy toàn cầu.',
        button: 'Du học tại Anh'
    },
    {
        name: 'United States',
        image: 'https://ditrumyfcg.com/wp-content/uploads/2024/04/cap-nhat-danh-sach-cac-tieu-bang-my-giau-hien-nay.jpg',
        title: 'Mỹ: Trung tâm sáng tạo toàn cầu',
        content: 'Cơ hội học tập tại các trường đại học danh tiếng, thúc đẩy nghiên cứu và đổi mới sáng tạo.',
        button: 'Du học tại Mỹ'
    },
    {
        name: 'New Zealand',
        image: 'https://www.insidehook.com/wp-content/uploads/2021/10/New-Zealand.png?fit=1200%2C800',
        title: 'New Zealand: Môi trường học tập an toàn và thân thiện',
        content: 'Du học tại đất nước yên bình với chất lượng đào tạo vượt trội và phong cảnh tuyệt đẹp.',
        button: 'Du học tại New Zealand'
    },
    {
        name: 'Ireland',
        image: 'https://www.embassyofireland.vn/wp-content/uploads/2023/12/du-hoc-Ireland-2.jpg',
        title: 'Ireland: Nơi hội tụ tri thức và văn hóa',
        content: 'Nền giáo dục chất lượng cao kết hợp với sự thân thiện và hiếu khách của người Ireland.',
        button: 'Du học tại Ireland'
    },
];

export default function Countries() {
    const navigate = useNavigate();

    const handleStudyAbroadClick = (countryName) => {
        navigate(`/search?country=${encodeURIComponent(countryName)}`);
    };

    return (
        <section className="container-fluid bg-custom-gray py-5 mt-5">
            <h3 className="fw-bold mb-2 text-center mb-4">Hành trình du học mơ ước của bạn đang sẵn sàng</h3>
            <p className="text-muted mb-4 text-center mb-4">
                Hãy bắt đầu hành trình tri thức của bạn tại các điểm đến du học thú vị và thân thiện này!
            </p>

            <div className="row">
                {countries.map((c, index) => (
                    <div key={index} className="col-md-4 mb-4">
                        <div className="country-card">
                            <img src={c.image} alt={c.name} className="img-fluid rounded" />
                            <div className="overlay">
                                <h6 className="text-primary fw-bold">{c.title}</h6>
                                <p className="text-white small">{c.content}</p>
                                <button className="btn btn-primary btn-sm" onClick={() => handleStudyAbroadClick(c.name)}>
                                    {c.button}
                                </button>
                            </div>
                            <div className="label">{c.name}</div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}