import React, { useState } from "react";
import "../css/register-book.css";

const cityOptionsByCountry = {
  Úc: ["Melbourne, Australia", "Canberra, Australia"],
  Mỹ: ["Cambridge, United States", "Stanford, United States", "United States"],
  Canada: ["Toronto, Canada", "Vancouver, Canada", "Canada"],
  "Nhật Bản": [],
  Đức: ["Munich, Germany", "Germany"],
  "Hàn Quốc": [],
  "Vương quốc Anh": ["London, United Kingdom", "Cambridge, United Kingdom", "Oxford, United Kingdom", "United Kingdom"],
  Ireland: ["Dublin, Ireland"],
  Singapore: ["Singapore"],
  Global: ["Global", "Europe"],
};

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    studyTime: "",
    city: "",
    educationLevel: "",
    adviceType: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "country") {
      setFormData({
        ...formData,
        [name]: value,
        city: "", // reset city
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên";
    if (!formData.email.includes("@")) newErrors.email = "Email không hợp lệ";
    if (!formData.phone.match(/^0\d{9}$/)) newErrors.phone = "SĐT không hợp lệ";
    if (!formData.country) newErrors.country = "Chọn quốc gia";
    if (!formData.studyTime) newErrors.studyTime = "Chọn thời gian";
    if (!formData.city) newErrors.city = "Chọn ít nhất một thành phố";
    if (!formData.educationLevel) newErrors.educationLevel = "Chọn bậc học";
    if (!formData.adviceType) newErrors.adviceType = "Chọn hình thức tư vấn";
    if (!formData.agree) newErrors.agree = "Bạn phải đồng ý với điều khoản";
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const foundErrors = validate();
    setErrors(foundErrors);
    if (Object.keys(foundErrors).length === 0) {
      alert("Đăng ký thành công!");
      console.log(formData);
    }
  };

  const filteredCities = cityOptionsByCountry[formData.country] || [];

  return (
    <div className="form-container">
      <form className="form-box" onSubmit={handleSubmit}>
        <h2>Đăng ký tư vấn cùng Chúng Tôi</h2>
        <p>Hãy để lại thông tin để được tư vấn miễn phí về học bổng & du học!</p>

        <div className="form-group">
          <input
            type="text"
            name="fullName"
            placeholder="Họ và tên*"
            value={formData.fullName}
            onChange={handleChange}
          />
          {errors.fullName && <span className="error-msg">{errors.fullName}</span>}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email*"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <span className="error-msg">{errors.email}</span>}
        </div>

        <div className="row">
          <div className="form-group">
            <select disabled>
              <option>+84 VN</option>
            </select>
          </div>
          <div className="form-group">
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại*"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <span className="error-msg">{errors.phone}</span>}
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <select name="country" value={formData.country} onChange={handleChange}>
              <option value="">Quốc gia bạn muốn du học*</option>
              {Object.keys(cityOptionsByCountry).map((country) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>
            {errors.country && <span className="error-msg">{errors.country}</span>}
          </div>

          <div className="form-group">
            <select name="studyTime" value={formData.studyTime} onChange={handleChange}>
              <option value="">Thời gian dự định du học*</option>
              <option>2025</option>
              <option>2026</option>
              <option>2027</option>
              <option>Chưa xác định</option>
            </select>
            {errors.studyTime && <span className="error-msg">{errors.studyTime}</span>}
          </div>
        </div>

        <div className="form-group">
          <select
            name="city"
            value={formData.city}
            onChange={handleChange}
            disabled={!filteredCities.length}
          >
            <option value="">Thành phố có học bổng*</option>
            {filteredCities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
          {errors.city && <span className="error-msg">{errors.city}</span>}
        </div>

        <div className="row">
          <div className="form-group">
            <select name="educationLevel" value={formData.educationLevel} onChange={handleChange}>
              <option value="">Bậc học bạn quan tâm*</option>
              <option value="Cao đẳng">Cao đẳng</option>
              <option value="Đại học">Đại học</option>
              <option value="Thạc sĩ">Thạc sĩ</option>
              <option value="Tiến sĩ">Tiến sĩ</option>
            </select>
            {errors.educationLevel && <span className="error-msg">{errors.educationLevel}</span>}
          </div>

          <div className="form-group">
            <select name="adviceType" value={formData.adviceType} onChange={handleChange}>
              <option value="">Hình thức tư vấn phù hợp*</option>
              <option value="Online">Online (Message)</option>
              <option value="Gọi điện">Qua điện thoại</option>
              <option value="Văn phòng">Trực tiếp tại văn phòng</option>
            </select>
            {errors.adviceType && <span className="error-msg">{errors.adviceType}</span>}
          </div>
        </div>

        <div className="checkboxes">
          <label>
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />{" "}
            Tôi đồng ý với <a href="#">Điều khoản</a> và{" "}
            <a href="#">chính sách bảo mật</a>
            {errors.agree && <span className="error-msg">{errors.agree}</span>}
          </label>
          <label>
            <input type="checkbox" /> Liên hệ với tôi qua Zalo / Facebook
          </label>
          <label>
            <input type="checkbox" /> Tôi muốn nhận tin khuyến mãi / học bổng
          </label>
        </div>

        <button type="submit" className="submit-button">
          Liên hệ tư vấn ngay
        </button>
      </form>

      <div className="image-box">
        <img src="/images/register-book-girl.png" alt="Student" />
      </div>
    </div>
  );
};

export default RegisterForm;
