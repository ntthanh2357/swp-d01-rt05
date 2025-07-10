import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function TermsOfUse() {
  return (
    <>
      <Header />
      <div className="legal-page-container">
        <h1>Điều Khoản Sử Dụng</h1>
        <p className="legal-date">Cập nhật: Tháng 6/2024</p>
        <div className="legal-toc">
          <strong>Mục lục:</strong>
          <ul>
            <li><a href="#chap-nhan">Chấp nhận điều khoản</a></li>
            <li><a href="#su-dung">Quy định sử dụng website</a></li>
            <li><a href="#so-huu">Quyền sở hữu trí tuệ</a></li>
            <li><a href="#mien-tru">Miễn trừ trách nhiệm</a></li>
            <li><a href="#thay-doi">Thay đổi điều khoản</a></li>
            <li><a href="#lien-he">Liên hệ</a></li>
          </ul>
        </div>
        <h2 id="chap-nhan">Chấp nhận điều khoản</h2>
        <p>Khi truy cập hoặc sử dụng website Heatwave Education, bạn đồng ý tuân thủ các điều khoản sử dụng và quy định pháp luật hiện hành.</p>
        <h2 id="su-dung">Quy định sử dụng website</h2>
        <ul>
          <li>Chỉ sử dụng website cho mục đích hợp pháp.</li>
          <li>Không gây ảnh hưởng, cản trở hoạt động của website.</li>
          <li>Nội dung trên website chỉ mang tính tham khảo và có thể thay đổi mà không cần báo trước.</li>
        </ul>
        <h2 id="so-huu">Quyền sở hữu trí tuệ</h2>
        <p>Tất cả nội dung, nhãn hiệu, dữ liệu trên website thuộc sở hữu của Heatwave Education hoặc đối tác được cấp phép.</p>
        <h2 id="mien-tru">Miễn trừ trách nhiệm</h2>
        <p>Chúng tôi không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng website.</p>
        <h2 id="thay-doi">Thay đổi điều khoản</h2>
        <p>Chúng tôi có thể cập nhật điều khoản sử dụng bất cứ lúc nào. Việc tiếp tục sử dụng website đồng nghĩa với việc bạn chấp nhận các thay đổi này.</p>
        <h2 id="lien-he">Liên hệ</h2>
        <p>Nếu có thắc mắc về điều khoản, vui lòng liên hệ <a href="mailto:namdeptrai@heatwave.edu.vn">namdeptrai@heatwave.edu.vn</a>.</p>
      </div>
      <Footer />
    </>
  );
} 