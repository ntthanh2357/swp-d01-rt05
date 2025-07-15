import React, { useState, useContext } from "react";
import { UserContext } from "../contexts/UserContext";
import "../css/register-book.css";

const defaultCityOptionsByCountry = {
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

const RegisterForm = ({ countryList }) => {
  const { user } = useContext(UserContext);
  const [formData, setFormData] = useState({
    fullName: user ? user.name || "" : "",
    email: user ? user.email || "" : "",
    phone: user ? user.phone || "" : "",
    country: "",
    studyTime: "",
    city: "",
    educationLevel: "",
    adviceType: "",
    scholarshipGoal: "",
    major: "",
    note: "",
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
    if (!formData.scholarshipGoal.trim()) newErrors.scholarshipGoal = "Nhập mục tiêu học bổng";
    if (!formData.major.trim()) newErrors.major = "Nhập ngành học quan tâm";
    if (!formData.agree) newErrors.agree = "Bạn phải đồng ý với điều khoản";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const foundErrors = validate();
    setErrors(foundErrors);
    
    if (Object.keys(foundErrors).length === 0) {
      // Kiểm tra user đã đăng nhập chưa
      if (!user || !user.accessToken) {
        alert("Vui lòng đăng nhập để đăng ký tư vấn!");
        return;
      }

      try {
        const requestData = {
          ...formData,
          token: user.accessToken
        };

        const response = await fetch('/api/consultation/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestData)
        });

        const result = await response.json();

        if (response.ok) {
          alert("Đăng ký tư vấn thành công! Bạn đã được phân công tư vấn viên.");
          console.log('Consultation registered:', result);
          // Reset form
          setFormData({
            fullName: "",
            email: "",
            phone: "",
            country: "",
            studyTime: "",
            city: "",
            educationLevel: "",
            adviceType: "",
            scholarshipGoal: "",
            major: "",
            note: "",
            agree: false,
          });
        } else {
          alert(`Lỗi: ${result.error || result.message || 'Có lỗi xảy ra'}`);
        }
      } catch (error) {
        console.error('Error registering consultation:', error);
        alert('Có lỗi xảy ra khi đăng ký tư vấn. Vui lòng thử lại!');
      }
    }
  };

  // Ưu tiên countryList prop, fallback về keys của defaultCityOptionsByCountry
  const countryOptions = countryList && countryList.length > 0 ? countryList : Object.keys(defaultCityOptionsByCountry);
  const cityOptionsByCountry = defaultCityOptionsByCountry;
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
            disabled={user && user.name}
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
            disabled={user && user.email}
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
              disabled={user && user.phone}
            />
            {errors.phone && <span className="error-msg">{errors.phone}</span>}
          </div>
        </div>

        <div className="row">
          <div className="form-group">
            <select name="country" value={formData.country} onChange={handleChange}>
              <option value="">Quốc gia bạn muốn du học*</option>
              {countryOptions.map((country) => (
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

        <div className="form-group">
          <input
            type="text"
            name="scholarshipGoal"
            placeholder="Mục tiêu học bổng (ví dụ: học bổng toàn phần, bán phần, v.v.)*"
            value={formData.scholarshipGoal}
            onChange={handleChange}
          />
          {errors.scholarshipGoal && <span className="error-msg">{errors.scholarshipGoal}</span>}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="major"
            placeholder="Ngành học quan tâm*"
            value={formData.major}
            onChange={handleChange}
          />
          {errors.major && <span className="error-msg">{errors.major}</span>}
        </div>

        <div className="form-group">
          <textarea
            name="note"
            placeholder="Ghi chú thêm cho tư vấn viên (không bắt buộc)"
            value={formData.note}
            onChange={handleChange}
            rows={3}
          />
        </div>

        <div className="checkboxes">
          <label>
            <input
              type="checkbox"
              name="agree"
              checked={formData.agree}
              onChange={handleChange}
            />{" "}
            Tôi đồng ý với <a href="/terms" target="_blank" rel="noopener noreferrer">Điều khoản</a> và{" "}
            <a href="/privacy" target="_blank" rel="noopener noreferrer">chính sách bảo mật</a>
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
