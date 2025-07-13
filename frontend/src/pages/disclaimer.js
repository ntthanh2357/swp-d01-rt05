import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Disclaimer() {
  return (
    <>
      <Header />
      <div className="legal-page-container">
        <h1>Miễn Trừ Trách Nhiệm</h1>
        <p className="legal-date">Cập nhật: Tháng 6/2024</p>
        <div className="legal-toc">
          <strong>Mục lục:</strong>
          <ul>
            <li><a href="#gioi-thieu">Giới thiệu</a></li>
            <li><a href="#duong-dan">Miễn trừ về đường dẫn ngoài</a></li>
            <li><a href="#chuyen-mon">Miễn trừ về tư vấn chuyên môn</a></li>
            <li><a href="#lien-he">Liên hệ</a></li>
          </ul>
        </div>
        <h2 id="gioi-thieu">Giới thiệu</h2>
        <p>Thông tin trên website Heatwave Education chỉ mang tính chất tham khảo chung. Chúng tôi không đảm bảo tính chính xác, đầy đủ, hoặc cập nhật của thông tin.</p>
        <h2 id="duong-dan">Miễn trừ về đường dẫn ngoài</h2>
        <p>Website có thể chứa các liên kết đến website bên ngoài không thuộc quyền quản lý của Heatwave Education. Chúng tôi không chịu trách nhiệm về nội dung hoặc tính bảo mật của các website này.</p>
        <h2 id="chuyen-mon">Miễn trừ về tư vấn chuyên môn</h2>
        <p>Website không cung cấp tư vấn pháp lý, giáo dục hoặc chuyên môn. Mọi thông tin chỉ nhằm mục đích tham khảo và giáo dục chung.</p>
        <h2 id="lien-he">Liên hệ</h2>
        <p>Nếu có thắc mắc về miễn trừ trách nhiệm, vui lòng liên hệ <a href="mailto:namdeptrai@heatwave.edu.vn">namdeptrai@heatwave.edu.vn</a>.</p>
      </div>
      <Footer />
    </>
  );
} 