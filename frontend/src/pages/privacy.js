import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <div className="legal-page-container">
        <h1>Chính Sách Quyền Riêng Tư</h1>
        <p className="legal-date">Cập nhật: Tháng 6/2024</p>
        <div className="legal-toc">
          <strong>Mục lục:</strong>
          <ul>
            <li><a href="#gioi-thieu">Giới thiệu</a></li>
            <li><a href="#thong-tin-thu-thap">Thông tin chúng tôi thu thập</a></li>
            <li><a href="#muc-dich">Mục đích sử dụng thông tin</a></li>
            <li><a href="#bao-mat">Bảo mật & An toàn</a></li>
            <li><a href="#quyen-cua-ban">Quyền của bạn</a></li>
            <li><a href="#lien-he">Liên hệ</a></li>
          </ul>
        </div>
        <h2 id="gioi-thieu">Giới thiệu</h2>
        <p>
          Heatwave Education cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của bạn. Chính sách này giải thích cách chúng tôi thu thập, sử dụng, lưu trữ và bảo vệ thông tin của bạn khi bạn sử dụng nền tảng của chúng tôi.
        </p>
        <h2 id="thong-tin-thu-thap">Thông tin chúng tôi thu thập</h2>
        <ul>
          <li><strong>Thông tin cá nhân:</strong> Họ tên, email, số điện thoại, thông tin học vấn, tài khoản đăng nhập, v.v.</li>
          <li><strong>Thông tin sử dụng:</strong> Lịch sử truy cập, thao tác trên website, phản hồi, đánh giá, v.v.</li>
          <li><strong>Cookie & công nghệ theo dõi:</strong> Để tối ưu trải nghiệm và cá nhân hóa dịch vụ.</li>
        </ul>
        <h2 id="muc-dich">Mục đích sử dụng thông tin</h2>
        <ul>
          <li>Cung cấp, duy trì và nâng cao chất lượng dịch vụ của Heatwave Education.</li>
          <li>Cá nhân hóa trải nghiệm, đề xuất học bổng và chương trình phù hợp.</li>
          <li>Liên hệ, hỗ trợ, gửi thông báo về các cập nhật, sự kiện, hoặc thay đổi chính sách.</li>
          <li>Đáp ứng yêu cầu pháp lý hoặc bảo vệ quyền lợi hợp pháp của Heatwave Education và người dùng.</li>
        </ul>
        <h2 id="bao-mat">Bảo mật & An toàn</h2>
        <p>
          Chúng tôi áp dụng các biện pháp kỹ thuật và quản lý hiện đại để bảo vệ thông tin cá nhân khỏi truy cập trái phép, mất mát hoặc tiết lộ không mong muốn. Mọi dữ liệu được lưu trữ an toàn và chỉ nhân viên có thẩm quyền mới được truy cập.
        </p>
        <h2 id="quyen-cua-ban">Quyền của bạn</h2>
        <ul>
          <li>Truy cập, chỉnh sửa hoặc yêu cầu xóa thông tin cá nhân của mình.</li>
          <li>Yêu cầu hạn chế hoặc phản đối việc xử lý dữ liệu cá nhân.</li>
          <li>Rút lại sự đồng ý hoặc khiếu nại về việc sử dụng thông tin.</li>
        </ul>
        <h2 id="lien-he">Liên hệ</h2>
        <p>
          Nếu bạn có bất kỳ câu hỏi hoặc yêu cầu nào liên quan đến quyền riêng tư, vui lòng liên hệ với chúng tôi qua email <a href="mailto:namdeptrai@heatwave.edu.vn">namdeptrai@heatwave.edu.vn</a>. Đội ngũ Heatwave Education luôn sẵn sàng hỗ trợ bạn.
        </p>
      </div>
      <Footer />
    </>
  );
} 