import React, { useState, useEffect, useContext } from "react";
import * as yup from "yup";
import { getAllOrganizations } from "../../services/organizationApi";
import { UserContext } from "../../contexts/UserContext";

import "./ScholarshipForm.css";

function formatDateToDDMMYYYY(dateStr) {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
}

function formatDateToYYYYMMDD(dateStr) {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
}

const currencyList = [
    "GBP", "AUD", "USD", "CAD", "NZD", "EUR", "SGD"
];

const schema = yup.object().shape({
    title: yup.string().required("Tên học bổng là bắt buộc"),
    organizationName: yup.string().required("Tổ chức là bắt buộc"),
    categoryId: yup.string().required("Danh mục là bắt buộc"),
    amount: yup.number().typeError("Số tiền phải là số").min(0, "Số tiền không âm").nullable(),
    currency: yup
        .string()
        .oneOf(currencyList, "Đơn vị tiền tệ không hợp lệ")
        .required("Đơn vị tiền tệ là bắt buộc"),
    duration: yup.number().typeError("Thời hạn phải là số").min(0, "Thời hạn không âm").nullable(),
    applicationDeadline: yup.string(),
    eligibilityCriteria: yup.string(),
    countries: yup.string(),
    educationLevels: yup.array(),
    fieldsOfStudy: yup.array(),
});

const ScholarshipForm = ({ onSubmit }) => {
    const { user } = useContext(UserContext);
    const [errors, setErrors] = useState({});

    const [form, setForm] = useState({
        title: "",
        description: "",
        organizationName: "",
        categoryId: "",
        amount: "",
        currency: "",
        duration: "",
        countries: "",
        applicationDeadline: "",
        eligibilityCriteria: "",
        educationLevels: [],
        fieldsOfStudy: [],
    });

    const [categoryOptions, setCategoryOptions] = useState([
        { name: "Ireland", id: "SCHOLARCATE0001" },
        { name: "New Zealand", id: "SCHOLARCATE0002" },
        { name: "United States", id: "SCHOLARCATE0003" },
        { name: "Australia", id: "SCHOLARCATE0004" },
        { name: "Canada", id: "SCHOLARCATE0005" },
        { name: "United Kingdom", id: "SCHOLARCATE0006" },
        { name: "Khác", id: "SCHOLARCATE0007" }
    ]);

    const [educationLevelOptions, setEducationLevelOptions] = useState([
        "bachelor",
        "master",
        "phd",
    ]);
    const [fieldsOfStudyOptions, setFieldsOfStudyOptions] = useState([
        "engineering",
        "science",
        "arts",
        "business",
    ]);
    const [newEducationLevel, setNewEducationLevel] = useState("");
    const [newFieldOfStudy, setNewFieldOfStudy] = useState("");

    const [organizations, setOrganizations] = useState([]);

    useEffect(() => {
        const fetchOrganizations = async () => {
            try {
                const res = await getAllOrganizations(
                    { token: user?.accessToken }
                );
                setOrganizations(res.data.map(org => ({ name: org.name })));
            } catch (err) {
                setOrganizations([]);
            }
        };
        fetchOrganizations();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === "applicationDeadline") {
            setForm({ ...form, [name]: formatDateToDDMMYYYY(value) });
        } else {
            setForm({ ...form, [name]: value });
        }
    };

    const handleCheckboxChange = (name, value) => {
        const currentValues = form[name];
        const updatedValues = currentValues.includes(value)
            ? currentValues.filter(item => item !== value)
            : [...currentValues, value];

        setForm({ ...form, [name]: updatedValues });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await schema.validate(form, { abortEarly: false });
            setErrors({});
            if (onSubmit) {
                const formToSend = {
                    ...form,
                    applicationDeadline: formatDateToYYYYMMDD(form.applicationDeadline)
                };
                onSubmit(formToSend);
            }
        } catch (err) {
            if (err.inner) {
                const formErrors = {};
                err.inner.forEach(e => {
                    formErrors[e.path] = e.message;
                });
                setErrors(formErrors);
            }
        }
    };

    const addNewOption = (type) => {
        if (type === 'education') {
            if (newEducationLevel && !educationLevelOptions.includes(newEducationLevel)) {
                setEducationLevelOptions([...educationLevelOptions, newEducationLevel]);
                setNewEducationLevel("");
            }
        } else if (type === 'field') {
            if (newFieldOfStudy && !fieldsOfStudyOptions.includes(newFieldOfStudy)) {
                setFieldsOfStudyOptions([...fieldsOfStudyOptions, newFieldOfStudy]);
                setNewFieldOfStudy("");
            }
        }
    };

    return (
        <div className="scholarship-form-container">
            <div className="form-header">
                <h2>Tạo học bổng mới</h2>
                <p>Vui lòng điền đầy đủ thông tin để tạo học bổng</p>
            </div>

            <form onSubmit={handleSubmit} className="form-scroll-container">
                {/* Thông tin cơ bản */}
                <div className="form-section">
                    <h3 className="section-title">Thông tin cơ bản</h3>
                    <div className="row">
                        <div className="col-12 mb-3">
                            <label className="form-label">Tên học bổng *</label>
                            <input
                                className="form-control"
                                name="title"
                                value={form.title}
                                onChange={handleChange}
                                placeholder="Nhập tên học bổng"
                                required
                            />
                            {errors.title && <div className="text-danger small">{errors.title}</div>}
                        </div>
                        <div className="col-12 mb-3">
                            <label className="form-label">Mô tả</label>
                            <textarea
                                className="form-control"
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Mô tả chi tiết về học bổng"
                            />
                            {errors.description && <div className="text-danger small">{errors.description}</div>}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Tổ chức *</label>
                            <select
                                className="form-select"
                                name="organizationName"
                                value={form.organizationName}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Chọn tổ chức</option>
                                {organizations.map((org) => (
                                    <option key={org.id || org.name} value={org.name}>
                                        {org.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Mã danh mục</label>
                            <select
                                className="form-select"
                                name="categoryId"
                                value={form.categoryId}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Chọn danh mục</option>
                                {categoryOptions.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Thông tin tài chính */}
                <div className="form-section">
                    <h3 className="section-title">Thông tin tài chính & thời hạn</h3>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Số tiền</label>
                            <input
                                className="form-control"
                                type="number"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                placeholder="0"
                            />
                            {errors.amount && <div className="text-danger small">{errors.amount}</div>}
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Đơn vị tiền tệ</label>
                            <input
                                className="form-control"
                                name="currency"
                                value={form.currency}
                                onChange={handleChange}
                                placeholder="VND, USD, EUR..."
                            />
                            {errors.currency && <div className="text-danger small">{errors.currency}</div>}
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="form-label">Thời hạn (tháng)</label>
                            <input
                                className="form-control"
                                type="number"
                                name="duration"
                                value={form.duration}
                                onChange={handleChange}
                                placeholder="12"
                            />
                            {errors.duration && <div className="text-danger small">{errors.duration}</div>}
                        </div>
                    </div>
                </div>

                {/* Điều kiện và hạn chế */}
                <div className="form-section">
                    <h3 className="section-title">Điều kiện & hạn chế</h3>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Hạn nộp hồ sơ</label>
                            <input
                                className="form-control"
                                type="date"
                                name="applicationDeadline"
                                value={formatDateToYYYYMMDD(form.applicationDeadline)}
                                onChange={handleChange}
                            />
                            {form.applicationDeadline && (
                                <div className="small text-muted mt-1">
                                    Định dạng: {form.applicationDeadline}
                                </div>
                            )}
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Tiêu chí đủ điều kiện</label>
                            <input
                                className="form-control"
                                name="eligibilityCriteria"
                                value={form.eligibilityCriteria}
                                onChange={handleChange}
                                placeholder="GPA >= 3.0, IELTS >= 6.5..."
                            />
                            {errors.eligibilityCriteria && <div className="text-danger small">{errors.eligibilityCriteria}</div>}
                        </div>
                        <div className="col-12 mb-3">
                            <label className="form-label">Địa điểm</label>
                            <input
                                className="form-control"
                                name="countries"
                                value={form.countries}
                                onChange={handleChange}
                                placeholder="Địa điểm"
                            />
                            {errors.countries && <div className="text-danger small">{errors.countries}</div>}
                        </div>
                    </div>
                </div>

                {/* Bậc học và ngành học */}
                <div className="form-section">
                    <h3 className="section-title">Bậc học & ngành học</h3>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <div className="checkbox-group">
                                <div className="checkbox-group-header">Bậc học</div>
                                <div className="checkbox-container">
                                    {educationLevelOptions.map((level) => (
                                        <label key={level} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                checked={form.educationLevels.includes(level)}
                                                onChange={() => handleCheckboxChange('educationLevels', level)}
                                            />
                                            <span className="checkbox-label">
                                                {level.charAt(0).toUpperCase() + level.slice(1)}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                <div className="add-item-container">
                                    <input
                                        className="form-control add-item-input"
                                        type="text"
                                        placeholder="Thêm bậc học mới"
                                        value={newEducationLevel}
                                        onChange={(e) => setNewEducationLevel(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-add"
                                        onClick={() => addNewOption('education')}
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 mb-3">
                            <div className="checkbox-group">
                                <div className="checkbox-group-header">Ngành học</div>
                                <div className="checkbox-container">
                                    {fieldsOfStudyOptions.map((field) => (
                                        <label key={field} className="checkbox-item">
                                            <input
                                                type="checkbox"
                                                checked={form.fieldsOfStudy.includes(field)}
                                                onChange={() => handleCheckboxChange('fieldsOfStudy', field)}
                                            />
                                            <span className="checkbox-label">
                                                {field.charAt(0).toUpperCase() + field.slice(1)}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                                <div className="add-item-container">
                                    <input
                                        className="form-control add-item-input"
                                        type="text"
                                        placeholder="Thêm ngành học mới"
                                        value={newFieldOfStudy}
                                        onChange={(e) => setNewFieldOfStudy(e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        className="btn btn-add"
                                        onClick={() => addNewOption('field')}
                                    >
                                        Thêm
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit button */}
                <div className="text-center">
                    <button type="submit" className="btn btn-submit">
                        Lưu học bổng
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ScholarshipForm;