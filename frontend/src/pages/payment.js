// src/pages/payment.js

import React, { useState } from 'react'; // Import useState
import { Link } from 'react-router-dom';
import axios from 'axios'; // Import axios để gọi API
import '../css/payment.css'; // Import CSS tùy chỉnh của bạn

// Định nghĩa các gói dịch vụ
const packages = [
    {
        id: 'basic',
        name: 'GÓI HỖ TRỢ ĐƠN GIẢN',
        description: 'Phù hợp với người có thể tự làm, chỉ cần hướng dẫn đúng lộ trình.',
        price: '10.000', // Giá hiển thị
        amount: 10000, // Số tiền thực tế gửi ZaloPay (ví dụ: 10,000 VNĐ)
        features: [
            { text: 'Định hướng chọn ngành, trường, học bổng phù hợp.', type: 'check' },
            { text: 'Checklist hồ sơ cần chuẩn bị.', type: 'check' },
            { text: 'Mẫu CV, SOP, thư giới thiệu.', type: 'check' },
            { text: 'Nhận xét nhanh 1 lần trên hồ sơ.', type: 'check' },
            { text: 'Không bao gồm: sửa bài luận, hỗ trợ nộp hồ sơ hoặc visa.', type: 'times' },
        ],
        color: 'success', // Dùng cho class CSS Bootstrap và tùy chỉnh
    },
    {
        id: 'premium',
        name: 'GÓI TƯ VẤN CAO CẤP',
        description: 'Dành cho người cần người đồng hành sát sao trong từng bước xin học bổng.',
        price: '20.000',
        amount: 20000,
        features: [
            { text: 'Tư vấn chọn chiến lược học bổng & trường.', type: 'check' },
            { text: 'Sửa chi tiết CV, SOP, thư giới thiệu nhiều vòng.', type: 'check' },
            { text: 'Luyện phỏng vấn học bổng 1:1.', type: 'check' },
            { text: 'Theo dõi toàn bộ quy trình nộp hồ sơ.', type: 'check' },
        ],
        color: 'warning',
    },
    {
        id: 'ultimate',
        name: 'GÓI CHUYÊN SÂU TOÀN DIỆN',
        description: 'Phù hợp với người cần “kết quả”, không có thời gian hoặc muốn đảm bảo hiệu quả cao.',
        price: '30.000',
        amount: 30000,
        features: [
            { text: 'Làm việc 1-1 với chuyên gia từng đạt học bổng lớn.', type: 'check' },
            { text: 'Viết, chỉnh sửa SOP, CV, thư giới thiệu từ A-Z.', type: 'check' },
            { text: 'Nộp hồ sơ hộ, hỗ trợ xin visa, liên hệ trường.', type: 'check' },
            { text: 'Hướng dẫn trước khi bay, chọn chỗ ở, lên kế hoạch tài chính.', type: 'check' },
            { text: 'Ưu tiên xử lý hồ sơ sớm.', type: 'check' },
        ],
        color: 'danger',
    },
];

export default function Payment() {
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [orderInfo, setOrderInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChoosePackage = async (packageItem) => {
        setLoading(true);
        setError('');
        setQrCodeUrl('');
        setOrderInfo(null);

        try {
            // *** THAY ĐỔI QUAN TRỌNG ***
            // Thay đổi URL API trỏ đến backend Spring Boot của bạn
            const response = await axios.post('http://localhost:8080/api/zalopay/create-order', {
                amount: packageItem.amount,
                description: `Thanh toán gói ${packageItem.name} Heatwave Scholarship`,
            });
            
            // ZaloPay API v2 trả về 'order_url' và 'zp_trans_token'
            if (response.data && response.data.order_url) { 
                setQrCodeUrl(response.data.order_url);
                setOrderInfo({
                    name: packageItem.name,
                    amount: packageItem.price,
                    // Lưu lại app_trans_id để có thể kiểm tra trạng thái đơn hàng sau này
                    orderId: response.data.app_trans_id, 
                });
            } else {
                // Hiển thị thông báo lỗi từ backend nếu có
                const errorMessage = response.data.sub_message || response.data.message || 'Không nhận được thông tin QR Code từ máy chủ.';
                setError(errorMessage);
            }
        } catch (err) {
            console.error('Lỗi khi tạo đơn hàng ZaloPay:', err);
            let errorMessage = 'Có lỗi xảy ra khi yêu cầu thanh toán. Vui lòng thử lại sau.';
            if (err.response && err.response.data && err.response.data.message) {
                 // Hiển thị lỗi cụ thể từ Spring Boot
                errorMessage = err.response.data.message;
            }
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container payment-container"> {/* Thêm class payment-container */}
            <h1 className="text-center mb-4 display-4 text-primary fw-bold">Trang Thanh Toán Dịch Vụ Học Bổng</h1>
            <p className="lead text-center mb-5 text-muted">
                Chào mừng bạn đến với trang thanh toán của Heatwave Scholarship.
                Tại đây, bạn có thể xem các gói dịch vụ hỗ trợ săn học bổng và tiến hành thanh toán.
            </p>

            <div className="row justify-content-center g-4">
                {packages.map((pkg) => (
                    <div className="col-md-4" key={pkg.id}>
                        <div className={`card h-100 shadow-lg plan-card plan-${pkg.color}`}>
                            <div className={`card-header text-white text-center py-3`}> {/* Bỏ bg-success/warning/danger ở đây, đã xử lý trong CSS */}
                                <h3 className="mb-0">{pkg.name}</h3>
                            </div>
                            <div className="card-body d-flex flex-column">
                                <p className="card-text text-center text-muted mb-3 flex-grow-1">
                                    {pkg.description}
                                </p>
                                <h4 className="text-center mb-3"> {/* Bỏ text-success/warning/danger ở đây */}
                                    Giá tham khảo: {pkg.price} VNĐ
                                </h4>
                                <ul className="list-unstyled text-start mb-4">
                                    {pkg.features.map((feature, index) => (
                                        <li key={index} className={`mb-2 ${feature.type === 'times' ? 'text-danger' : ''}`}>
                                            <i className={`fas ${feature.type === 'check' ? `fa-check-circle text-${pkg.color}` : 'fa-times-circle text-danger'} me-2`}></i>
                                            {feature.text}
                                        </li>
                                    ))}
                                </ul>
                                <div className="text-center mt-auto">
                                    <button
                                        className={`btn btn-outline-${pkg.color} btn-lg`}
                                        onClick={() => handleChoosePackage(pkg)}
                                        disabled={loading} // Vô hiệu hóa nút khi đang tải
                                    >
                                        {loading ? 'Đang xử lý...' : 'Chọn Gói Này'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Phần hiển thị QR Code và thông báo */}
            {loading && (
                <div className="text-center mt-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Đang tạo mã QR ZaloPay...</p>
                </div>
            )}

            {error && (
                <div className="alert alert-danger text-center mt-5" role="alert">
                    {error}
                </div>
            )}

            {qrCodeUrl && orderInfo && (
                <div className="card mt-5 p-4 shadow-lg text-center mx-auto" style={{ maxWidth: '400px' }}>
                    <h4 className="mb-3 text-primary">Thông tin Thanh toán ZaloPay</h4>
                    <p className="mb-2"><strong>Gói dịch vụ:</strong> {orderInfo.name}</p>
                    <p className="mb-2"><strong>Số tiền:</strong> {orderInfo.amount} VNĐ</p>
                    <p className="mb-3"><strong>Mã đơn hàng:</strong> {orderInfo.orderId}</p>
                    <p className="text-muted">Quét mã QR bằng ứng dụng ZaloPay để thanh toán.</p>
                    {/* ZaloPay API sẽ trả về order_url. Bạn có thể sử dụng service như qrcode.show để tạo ảnh QR từ URL đó, hoặc ZaloPay có thể trả về base64 QR. */}
                    <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrCodeUrl)}`}
                        alt="ZaloPay QR Code"
                        className="img-fluid border rounded"
                        style={{ maxWidth: '250px', height: 'auto', margin: '0 auto' }}
                    />
                    <p className="mt-3">
                        Hoặc click vào đây để thanh toán: <a href={qrCodeUrl} target="_blank" rel="noopener noreferrer">Thanh toán qua ZaloPay</a>
                    </p>
                    <button className="btn btn-secondary mt-3" onClick={() => { setQrCodeUrl(''); setOrderInfo(null); }}>
                        Thanh toán gói khác
                    </button>
                </div>
            )}

            <p className="text-center mt-5 text-muted">
                Chúng tôi chấp nhận thanh toán qua ZaloPay và các hình thức khác.
            </p>

            <div className="text-center mt-4">
                <Link to="/contact" className="btn btn-contact"> {/* Đảm bảo sử dụng class 'btn-contact' cho nút này */}
                    Có câu hỏi? Liên hệ chúng tôi
                </Link>
            </div>
        </div>
    );
}