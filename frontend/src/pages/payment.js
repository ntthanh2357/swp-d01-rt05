import React from "react";
import "../css/payment.css";

const packages = [
  {
    id: "basic",
    name: "GÓI HỖ TRỢ ĐƠN GIẢN",
    description: "Phù hợp với người có thể tự làm, chỉ cần hướng dẫn đúng lộ trình.",
    price: "10.000 VNĐ",
    amount: 10000,
    features: [
      "Định hướng chọn ngành, trường, học bổng phù hợp.",
      "Checklist hồ sơ cần chuẩn bị.",
      "Mẫu CV, SOP, thư giới thiệu.",
      "Nhận xét nhanh 1 lần trên hồ sơ.",
      "Không bao gồm: sửa bài luận, hỗ trợ nộp hồ sơ hoặc visa.",
    ],
  },
  {
    id: "premium",
    name: "GÓI TOÀN DIỆN",
    description: "Phù hợp với người cần hỗ trợ đầy đủ toàn bộ quy trình.",
    price: "50.000 VNĐ",
    amount: 50000,
    features: [
      "Tư vấn chiến lược toàn diện về ngành học và quốc gia.",
      "Sửa CV, bài luận, thư giới thiệu không giới hạn.",
      "Hướng dẫn và đồng hành nộp hồ sơ học bổng, visa.",
      "Ưu tiên phản hồi nhanh và tư vấn 1:1.",
    ],
  },
];

export default function PaymentPage() {
  const handlePayment = async (selectedPackage) => {
    try {
      const response = await fetch("/api/payos/create-payment-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedPackage.amount,
          description: selectedPackage.name,
        }),
      });

      const data = await response.json();
      if (data.success && data.checkoutUrl) {
        // Redirect to PayOS hosted payment page
        window.location.href = data.checkoutUrl;
      } else {
        alert("Không thể tạo link thanh toán: " + (data.message || "Lỗi không xác định"));
      }
    } catch (error) {
      alert("Lỗi kết nối server.");
      console.error(error);
    }
  };
  

  return (
    <div className="container py-5">
      <h2 className="text-center mb-4">Chọn Gói Học Bổng</h2>
      <div className="row">
        {packages.map((pkg) => (
          <div key={pkg.id} className="col-md-6 mb-4">
            <div className="card h-100">
              <div className="card-body">
                <h5 className="card-title">{pkg.name}</h5>
                <p className="card-text">{pkg.description}</p>
                <ul>
                  {pkg.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                <h6 className="mt-3">Giá: {pkg.price}</h6>
                <button
                  className="btn btn-primary mt-2"
                  onClick={() => handlePayment(pkg)}
                >
                  Thanh toán
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
