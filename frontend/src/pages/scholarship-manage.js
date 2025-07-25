import React, { useEffect, useState, useContext } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ScholarshipCard1 from '../components/ScholarshipCard1';
import ScholarshipForm from '../components/ScholarshipForm/ScholarshipForm';

import { getAllScholarships, addScholarship, updateScholarship, deleteScholarship } from '../services/scholarshipApi';
import { UserContext } from '../contexts/UserContext';

import '../css/scholarship-manage.css';

function ScholarshipManage() {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);

    // Thêm state cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Thêm state cho lọc và tìm kiếm
    const [countryFilter, setCountryFilter] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddForm, setShowAddForm] = useState(false);

    // Thêm state cho sửa học bổng
    const [showEditForm, setShowEditForm] = useState(false);
    const [scholarshipToEdit, setScholarshipToEdit] = useState(null);

    const filterCountries = [
        "Ireland",
        "New Zealand",
        "United States",
        "Australia",
        "Canada",
        "United Kingdom"
    ];

    useEffect(() => {
        const fetchScholarships = async () => {
            setLoading(true);
            try {
                const token = user?.accessToken;
                if (!token) {
                    setScholarships([]);
                    setLoading(false);
                    return;
                }
                const res = await getAllScholarships({ token });
                setScholarships(res.data);
            } catch (err) {
                setScholarships([]);
            }
            setLoading(false);
        };
        fetchScholarships();
    }, [user]);

    // Lọc và tìm kiếm học bổng
    const filteredScholarships = scholarships.filter(scholarship => {
        const countriesStr = scholarship.countries ? scholarship.countries.toLowerCase() : "";

        let matchCountry = true;
        if (countryFilter && countryFilter !== "Khác") {
            matchCountry = countriesStr.includes(countryFilter.toLowerCase());
        } else if (countryFilter === "Khác") {
            matchCountry = !filterCountries.some(country =>
                countriesStr.includes(country.toLowerCase())
            );
        }

        const titleStr = scholarship.title ? scholarship.title.toLowerCase() : "";
        const searchStr = searchTerm ? searchTerm.toLowerCase() : "";

        const matchSearch = searchStr
            ? titleStr.includes(searchStr)
            : true;

        return matchCountry && matchSearch;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentScholarships = filteredScholarships.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);

    // Hàm chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Sửa hàm handleAddScholarshipForm
    const handleAddScholarshipForm = async (form) => {
        if (!user?.accessToken || !user?.isLoggedIn) {
            toast.error("Bạn chưa đăng nhập!");
            window.location.href = "/login";
            return;
        }
        if (user.role !== 'admin') {
            toast.error("Bạn không có quyền truy cập!");
            return;
        }
        try {
            console.log('Thêm học bổng:', form);
            
            // Đảm bảo các trường JSON được định dạng đúng
            const dataToSend = {
                ...form,
                token: user.accessToken,
                educationLevels: JSON.stringify(form.educationLevels || []),
                fieldsOfStudy: JSON.stringify(form.fieldsOfStudy || []),
                // Thêm JSON.stringify cho languageRequirements
                languageRequirements: JSON.stringify(form.languageRequirements || ""),
                // Đảm bảo các trường còn lại có giá trị
                countries: form.countries || "",
                eligibilityCriteria: form.eligibilityCriteria || "",
                amount: form.amount || "0",
                duration: form.duration || "0", 
                viewsCount: form.viewsCount || "0",
                fundingType: form.fundingType || ""
            };
            
            console.log('Dữ liệu gửi đi:', dataToSend);
            const res = await addScholarship(dataToSend);
            
            setScholarships(prev => [res.data, ...prev]);
            setShowAddForm(false);
            toast.success('Thêm học bổng thành công!');
        } catch (err) {
            console.error('Chi tiết lỗi:', err);
            console.error('Response data:', err.response?.data);
            console.error('Status code:', err.response?.status);
            toast.error(`Thêm học bổng thất bại: ${err.response?.data || err.message}`);
        }
    };

    // Sửa lại hàm handleEdit hiện tại
    const handleEdit = (scholarship) => {
        if (!user?.accessToken || !user?.isLoggedIn) {
            toast.error("Bạn chưa đăng nhập!");
            window.location.href = "/login";
            return;
        }
        if (user.role !== 'admin') {
            toast.error("Bạn không có quyền truy cập!");
            return;
        }
        
        // Format dữ liệu trước khi điền vào form
        let formattedScholarship = { ...scholarship };
        
        // Parse các trường JSON nếu cần
        try {
            // Xử lý trường hợp JSON string
            if (typeof scholarship.educationLevels === 'string') {
                formattedScholarship.educationLevels = JSON.parse(scholarship.educationLevels);
            }
            if (typeof scholarship.fieldsOfStudy === 'string') {
                formattedScholarship.fieldsOfStudy = JSON.parse(scholarship.fieldsOfStudy);
            }
            if (typeof scholarship.languageRequirements === 'string' && scholarship.languageRequirements) {
                try {
                    formattedScholarship.languageRequirements = JSON.parse(scholarship.languageRequirements);
                } catch (e) {
                    // Nếu không phải JSON hợp lệ, giữ nguyên giá trị
                    formattedScholarship.languageRequirements = scholarship.languageRequirements;
                }
            }
        } catch (err) {
            console.error("Lỗi parse JSON:", err);
        }
        
        // Hiển thị form với dữ liệu đã có
        setScholarshipToEdit(formattedScholarship);
        setShowEditForm(true);
    };

    // Thêm hàm xử lý submit form chỉnh sửa
    const handleEditScholarshipSubmit = async (updatedData) => {
        try {
            console.log('Dữ liệu cập nhật:', updatedData);
            
            // Chuẩn bị dữ liệu để gửi API
            const dataToUpdate = {
                scholarshipId: scholarshipToEdit.scholarshipId,
                token: user.accessToken,
                ...updatedData,
                
                // Đảm bảo các trường số là chuỗi
                amount: updatedData.amount?.toString() || "",
                duration: updatedData.duration?.toString() || "",
                viewsCount: updatedData.viewsCount?.toString() || "",
                
                // Đảm bảo JSON cho các trường array
                educationLevels: JSON.stringify(updatedData.educationLevels || []),
                fieldsOfStudy: JSON.stringify(updatedData.fieldsOfStudy || []),
                languageRequirements: JSON.stringify(updatedData.languageRequirements || "")
            };
            
            // Gọi API cập nhật
            await updateScholarship(dataToUpdate);
            
            // Cập nhật state học bổng
            setScholarships(prev =>
                prev.map(s =>
                    s.scholarshipId === scholarshipToEdit.scholarshipId
                        ? { ...s, ...updatedData }
                        : s
                )
            );
            
            // Đóng form và reset state
            setShowEditForm(false);
            setScholarshipToEdit(null);
            
            toast.success('Cập nhật học bổng thành công!');
        } catch (err) {
            console.error('Cập nhật học bổng thất bại!', err);
            console.error('Chi tiết lỗi:', err.response?.data);
            toast.error(`Cập nhật học bổng thất bại: ${err.response?.data || err.message}`);
        }
    };

    // Thêm hàm xử lý xóa
    const handleDelete = async (scholarship) => {
        if (!user?.accessToken || !user?.isLoggedIn) {
            toast.error("Bạn chưa đăng nhập!");
            window.location.href = "/login";
            return;
        }
        if (user.role !== 'admin') {
            toast.error("Bạn không có quyền truy cập!");
            return;
        }

        confirmAlert({
            title: 'Xác nhận xóa',
            message: `Bạn có chắc chắn muốn xóa học bổng "${scholarship.title}"?`,
            buttons: [
                {
                    label: 'Xóa',
                    onClick: async () => {
                        try {
                            await deleteScholarship({
                                scholarshipId: scholarship.scholarshipId,
                                token: user.accessToken
                            });
                            setScholarships(prev => 
                                prev.filter(s => s.scholarshipId !== scholarship.scholarshipId)
                            );
                            toast.success('Xóa học bổng thành công!');
                        } catch (err) {
                            console.error('Xóa học bổng thất bại!', err.message);
                            toast.error('Xóa học bổng thất bại!');
                        }
                    }
                },
                {
                    label: 'Hủy',
                    onClick: () => {}
                }
            ]
        });
    };

    // Khi lọc hoặc tìm kiếm thay đổi, về trang 1
    useEffect(() => {
        setCurrentPage(1);
    }, [countryFilter, searchTerm]);

    return (
        <>
            <Header />
            <main className={`container mt-5${showAddForm ? ' scholarship-modal-blur' : ''}`}>
                <h2 className="text-center">Quản lý học bổng</h2>

                {/* Thanh tìm kiếm và lọc */}
                <div className="row mb-3 justify-content-center">
                    <div className="col-md-4 mb-2">
                        <select
                            className="form-select"
                            value={countryFilter}
                            onChange={e => setCountryFilter(e.target.value)}
                        >
                            <option value="">Tất cả quốc gia</option>
                            {filterCountries.map(country => (
                                <option key={country} value={country}>{country}</option>
                            ))}
                            <option value="Khác">Khác</option>
                        </select>
                    </div>
                    <div className="col-md-6 mb-2">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Tìm kiếm học bổng..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="col-md-2 mb-2">
                        <button className="btn btn-success w-100 py-3" onClick={() => setShowAddForm(true)}>
                            Thêm học bổng mới
                        </button>
                    </div>
                </div>

                <div className="row">
                    {loading ? (
                        <div className="text-center my-5">Đang tải học bổng...</div>
                    ) : filteredScholarships.length === 0 ? (
                        <div className="text-center my-5">Không có học bổng nào.</div>
                    ) : (
                        currentScholarships.map((scholarship) => (
                            <div className="col-md-6 mb-4" key={scholarship.scholarshipId}>
                                <ScholarshipCard1
                                    scholarship={scholarship}
                                    onEdit={handleEdit}
                                    onDelete={handleDelete}
                                />
                            </div>
                        ))
                    )}
                </div>

                {/* Phân trang */}
                {!loading && filteredScholarships.length > itemsPerPage && (
                    <nav className="mt-4">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                    &laquo;
                                </button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                                    &raquo;
                                </button>
                            </li>
                        </ul>
                    </nav>
                )}
            </main>

            {/* ScholarshipForm Modal */}
            {showAddForm && (
                <>
                    <div
                        className="scholarship-modal-overlay"
                        onClick={() => setShowAddForm(false)}
                    />
                    <div className="scholarship-modal">
                        <ScholarshipForm onSubmit={handleAddScholarshipForm} />
                    </div>
                </>
            )}

            {/* Thêm vào phía dưới form thêm mới, trước Footer */}
            {showEditForm && scholarshipToEdit && (
                <>
                    <div
                        className="scholarship-modal-overlay"
                        onClick={() => {
                            setShowEditForm(false);
                            setScholarshipToEdit(null);
                        }}
                    />
                    <div className="scholarship-modal">
                        <ScholarshipForm 
                            onSubmit={handleEditScholarshipSubmit} 
                            initialData={scholarshipToEdit}
                        />
                    </div>
                </>
            )}

            <Footer />
            <ToastContainer />
        </>
    );
}

export default ScholarshipManage;