import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getPublicStaffList } from '../services/staffApi';
import { useNavigate } from 'react-router-dom';
import StaffCard from '../components/StaffCard';

function SearchStaff() {
    const [staffList, setStaffList] = useState([]);
    const [filteredStaff, setFilteredStaff] = useState([]);
    const [searchName, setSearchName] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        setLoading(true);
        getPublicStaffList()
            .then(res => {
                setStaffList(res.data);
                setFilteredStaff(res.data);
            })
            .catch(() => {
                setStaffList([]);
                setFilteredStaff([]);
            })
            .finally(() => setLoading(false));
    }, []);

    useEffect(() => {
        if (searchName.trim() === '') {
            setFilteredStaff(staffList);
        } else {
            setFilteredStaff(
                staffList.filter(staff =>
                    staff.staffId && staff.staffId.toLowerCase().includes(searchName.toLowerCase())
                )
            );
        }
    }, [searchName, staffList]);

    return (
        <>
            <Header />
            <main className="container mt-5">
                <h2 className="text-center mb-4">Tìm kiếm nhân viên tư vấn</h2>
                <div className="filter-panel shadow-sm p-4 mb-4 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên hoặc mã nhân viên..."
                        value={searchName}
                        onChange={e => setSearchName(e.target.value)}
                    />
                </div>
                {loading ? (
                    <div className="text-center my-5">Đang tải danh sách nhân viên...</div>
                ) : filteredStaff.length === 0 ? (
                    <div className="text-center my-5">Không có nhân viên phù hợp.</div>
                ) : (
                    <div className="row g-4">
                        {filteredStaff.map(staff => (
                            <div className="col-md-4" key={staff.staffId}>
                                <StaffCard staff={staff} />
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}

export default SearchStaff; 