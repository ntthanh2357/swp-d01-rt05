import React, { useState, useEffect, useRef } from 'react';
import Select from 'react-select';
import { useLocation, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScholarshipCard from '../components/ScholarshipCard';
import { getAllScholarships } from '../services/scholarshipApi';
import { getActiveOrganizations } from '../services/organizationApi';

const SearchScholarship = () => {
    const [scholarships, setScholarships] = useState([]);
    const [filteredScholarships, setFilteredScholarships] = useState([]);
    const [fields, setFields] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);
    
    // Bộ lọc thực tế hơn
    const amountOptions = [
        { value: 5000, label: 'Dưới 5,000 USD' },
        { value: 10000, label: 'Dưới 10,000 USD' },
        { value: 20000, label: 'Dưới 20,000 USD' },
        { value: 50000, label: 'Dưới 50,000 USD' },
        { value: 100000, label: 'Trên 50,000 USD' }
    ];
    
    const [selectedAmount, setSelectedAmount] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;
    const location = useLocation();
    const navigate = useNavigate();
    const [organizations, setOrganizations] = useState([]);
    const [selectedOrganization, setSelectedOrganization] = useState(null);
    const initialOrgFilterApplied = useRef(false);

    // Kiểm tra xem có filter nào đang được áp dụng không
    const hasActiveFilters = () => {
        return selectedFields.length > 0 || 
               selectedCities.length > 0 || 
               selectedAmount !== null || 
               selectedOrganization !== null;
    };

    // Lấy dữ liệu học bổng
    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                const res = await getAllScholarships();
                const data = res.data;

                const now = new Date();
                const validScholarships = data.filter(sch => {
                    if (!sch.applicationDeadline) return true;
                    const deadlineDate = new Date(sch.applicationDeadline);
                    return deadlineDate >= now ;
                }  );
                setScholarships(validScholarships);
                setFilteredScholarships(validScholarships);

                // setScholarships(data);
                // setFilteredScholarships(data);
                const fieldsSet = new Set();
                const citiesSet = new Set();
                validScholarships.forEach((sch) => {
                    try {
                        const fs = JSON.parse(sch.fieldsOfStudy);
                        if (Array.isArray(fs)) fs.forEach((f) => fieldsSet.add(f));
                        else fieldsSet.add(fs);
                    } catch {
                        if (sch.fieldsOfStudy) fieldsSet.add(sch.fieldsOfStudy);
                    }
                    try {
                        const cs = JSON.parse(sch.countries);
                        if (Array.isArray(cs)) cs.forEach((c) => citiesSet.add(c));
                        else citiesSet.add(cs);
                    } catch {
                        if (sch.countries) citiesSet.add(sch.countries);
                    }  
                });
                setFields(Array.from(fieldsSet).sort());
                setCities(Array.from(citiesSet).sort());
            } catch (error) {
                setScholarships([]);
                setFilteredScholarships([]);
            }
        };
        fetchScholarships();
    }, []);

    // Lấy danh sách trường học và xử lý filter organizationName từ URL
    useEffect(() => {
        getActiveOrganizations()
            .then(res => {
                const orgs = res.data;
                setOrganizations(orgs);
                // Xử lý filter theo organizationName sau khi organizations đã load
                const params = new URLSearchParams(location.search);
                const organizationNameFromUrl = params.get('organizationName');
                if (organizationNameFromUrl && !initialOrgFilterApplied.current) {
                    const matchingOrg = orgs.find(org =>
                        org.name && org.name.toLowerCase().includes(organizationNameFromUrl.toLowerCase())
                    );
                    if (matchingOrg) {
                        setSelectedOrganization(matchingOrg.organizationId);
                        initialOrgFilterApplied.current = true;
                    }
                }
            })
            .catch(() => setOrganizations([]));
        // eslint-disable-next-line
    }, [location.search]);

    // Khi chọn trường học từ dropdown, cập nhật URL
    useEffect(() => {
        if (selectedOrganization) {
            const org = organizations.find(o => o.organizationId === selectedOrganization);
            if (org) {
                const params = new URLSearchParams(location.search);
                params.set('organizationName', org.name);
                navigate(`/search-scholarships?${params.toString()}`, { replace: true });
            }
        } else {
            // Nếu bỏ chọn trường, xóa organizationName khỏi URL
            const params = new URLSearchParams(location.search);
            if (params.has('organizationName')) {
                params.delete('organizationName');
                navigate(`/search-scholarships${params.toString() ? '?' + params.toString() : ''}`, { replace: true });
            }
        }
        // eslint-disable-next-line
    }, [selectedOrganization]);

    // Tự động set filter quốc gia nếu có param countries trên URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const countryParam = params.get('countries');
        if (countryParam && cities.includes(countryParam) && !selectedCities.includes(countryParam)) {
            setSelectedCities([countryParam]);
        }
    }, [cities, location.search]);

    // Filter logic
    const filterByFields = (scholarship) => {
        if (selectedFields.length === 0) return true;
        try {
            const fs = JSON.parse(scholarship.fieldsOfStudy);
            if (Array.isArray(fs)) return fs.some((f) => selectedFields.includes(f));
            else return selectedFields.includes(fs);
        } catch {
            return selectedFields.includes(scholarship.fieldsOfStudy);
        }
    };
    
    const filterByCities = (scholarship) => {
        if (selectedCities.length === 0) return true;
        let cs = [];
        try {
            const parsed = JSON.parse(scholarship.countries);
            cs = Array.isArray(parsed) ? parsed : [parsed];
        } catch {
            cs = typeof scholarship.countries === 'string' ? [scholarship.countries] : [];
        }
        return cs.some(country => selectedCities.includes(country));
    };
    
    const filterByAmount = (scholarship) => {
        if (!selectedAmount) return true;
        const amount = Number(scholarship.amount);
        if (isNaN(amount)) return false;
        
        if (selectedAmount.value === 100000) {
            return amount >= 50000; // Trên 50,000 USD
        } else {
            return amount <= selectedAmount.value;
        }
    };
    
    const filterByOrganization = (scholarship) => {
        if (!selectedOrganization) return true;
        if (scholarship.organization && scholarship.organization.organizationId) {
            return scholarship.organization.organizationId === selectedOrganization;
        }
        if (scholarship.organizationName) {
            const selectedOrg = organizations.find(org => org.organizationId === selectedOrganization);
            if (selectedOrg) {
                return scholarship.organizationName.toLowerCase().includes(selectedOrg.name.toLowerCase()) ||
                    selectedOrg.name.toLowerCase().includes(scholarship.organizationName.toLowerCase());
            }
        }
        return scholarship.organizationId === selectedOrganization;
    };
    
    const applyFilter = () => {
        const filtered = scholarships.filter(
            (s) =>
                filterByFields(s) &&
                filterByCities(s) &&
                filterByAmount(s) &&
                filterByOrganization(s)
        );
        setFilteredScholarships(filtered);
        setCurrentPage(1);
    };
    
    const clearFilters = () => {
        setSelectedFields([]);
        setSelectedCities([]);
        setSelectedAmount(null);
        setSelectedOrganization(null);
        setFilteredScholarships(scholarships);
        initialOrgFilterApplied.current = false;
        // Xóa organizationName khỏi URL
        navigate('/search-scholarships', { replace: true });
    };
    
    useEffect(() => {
        applyFilter();
        // eslint-disable-next-line
    }, [selectedFields, selectedCities, selectedAmount, selectedOrganization]);
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentScholarships = filteredScholarships.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredScholarships.length / itemsPerPage);
    
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    
    return (
        <>
            <Header />
            <div className="container mt-4">
                <h2 className="fw-bold mb-2">Học bổng cho bạn</h2>
                <p className="text-muted">
                    Khám phá các học bổng từ các trường đại học hàng đầu bên dưới. Sử dụng bộ lọc để tìm kiếm theo lĩnh vực, quốc gia, trường học và mức học bổng
                </p>
                <div className="filter-panel shadow-sm p-4 mb-4 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <h5 className="mb-3 fw-bold">Lọc học bổng</h5>
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <label className="fw-semibold mb-1">Lĩnh vực học tập</label>
                            <Select
                                options={fields.map(f => ({ value: f, label: f }))}
                                isMulti
                                value={selectedFields.map(f => ({ value: f, label: f }))}
                                onChange={(selected) => setSelectedFields(selected.map(item => item.value))}
                                placeholder="Chọn lĩnh vực"
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="fw-semibold mb-1">Quốc gia du học</label>
                            <Select
                                options={cities.map(c => ({ value: c, label: c }))}
                                isMulti
                                value={selectedCities.map(c => ({ value: c, label: c }))}
                                onChange={(selected) => setSelectedCities(selected.map(item => item.value))}
                                placeholder="Chọn quốc gia"
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="fw-semibold mb-1">Trường học</label>
                            <Select
                                options={organizations.map(org => ({ value: org.organizationId, label: org.name }))}
                                value={selectedOrganization ? organizations.filter(org => org.organizationId === selectedOrganization).map(org => ({ value: org.organizationId, label: org.name }))[0] : null}
                                onChange={selected => setSelectedOrganization(selected ? selected.value : null)}
                                placeholder="Chọn trường học"
                                isClearable
                            />
                        </div>
                        <div className="col-md-3 mb-3">
                            <label className="fw-semibold mb-1">Mức học bổng</label>
                            <Select
                                options={amountOptions}
                                value={selectedAmount}
                                onChange={(selected) => setSelectedAmount(selected)}
                                placeholder="Chọn mức học bổng"
                                isClearable
                            />
                        </div>
                    </div>
                    {/* Chỉ hiện nút "Hủy bỏ" khi có filter đang được áp dụng */}
                    {hasActiveFilters() && (
                        <div className="mt-3 d-flex justify-content-end">
                            <button className="btn btn-danger" onClick={clearFilters}>Hủy bỏ</button>
                        </div>
                    )}
                </div>
                <div className="row">
                    {currentScholarships.length === 0 ? (
                        <div className="text-center my-5" style={{ fontWeight: 'bold', color: '#c2185b' }}>
                            Không có học bổng nào phù hợp.
                        </div>
                    ) : (
                        currentScholarships.map((scholarship) => (
                            <div className="col-md-4 mb-3" key={scholarship.scholarshipId}>
                                <ScholarshipCard scholarship={scholarship} />
                            </div>
                        ))
                    )}
                </div>
                {/* Pagination */}
                {filteredScholarships.length > itemsPerPage && (
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
            </div>
            <Footer />
        </>
    );
};

export default SearchScholarship;
