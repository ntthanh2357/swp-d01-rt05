import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import { useLocation } from 'react-router-dom';

import Header from '../components/Header';
import Footer from '../components/Footer';
import ScholarshipCard from '../components/ScholarshipCard';

import { getAllScholarships } from '../services/scholarshipApi';

const SearchSchool = () => {
    const [scholarships, setScholarships] = useState([]);
    const [filteredScholarships, setFilteredScholarships] = useState([]);

    const [fields, setFields] = useState([]);
    const [cities, setCities] = useState([]);
    const [selectedFields, setSelectedFields] = useState([]);
    const [selectedCities, setSelectedCities] = useState([]);

    const costOptions = [100000, 80000, 50000];
    const toeflOptions = [100, 80, 60];
    const ieltsOptions = [8.0, 7.0, 6.0];

    const [selectedCost, setSelectedCost] = useState(null);
    const [selectedToefl, setSelectedToefl] = useState(null);
    const [selectedIelts, setSelectedIelts] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    const location = useLocation();

    useEffect(() => {
        const fetchScholarships = async () => {
            try {
                const res = await getAllScholarships();
                const data = res.data;

                setScholarships(data);
                setFilteredScholarships(data);

                const fieldsSet = new Set();
                const citiesSet = new Set();

                data.forEach((sch) => {
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
                const sortedCities = Array.from(citiesSet).sort();
                setCities(sortedCities);

                // Đặt filter nếu có query ?country=... trong URL
                const params = new URLSearchParams(location.search);
                const countryFromUrl = params.get('country');
                if (countryFromUrl) {
                    // Lọc tất cả cities có chứa countryFromUrl (không phân biệt chữ hoa/thường)
                    const matchingCities = sortedCities.filter(city =>
                        city.toLowerCase().includes(countryFromUrl.toLowerCase())
                    );
                    setSelectedCities(matchingCities);
                }
            } catch (error) {
                console.error('Lỗi khi tải học bổng:', error);
                setScholarships([]);
                setFilteredScholarships([]);
            }
        };

        fetchScholarships();
    }, [location.search]);

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

    const filterByCost = (scholarship) => {
        if (!selectedCost) return true;
        const amount = Number(scholarship.amount);
        return !isNaN(amount) && amount <= selectedCost;
    };

    const filterByLanguageRequirements = (scholarship) => {
        try {
            const lang = JSON.parse(scholarship.languageRequirements);
            if (selectedToefl && lang.toefl && lang.toefl > selectedToefl) return false;
            if (selectedIelts && lang.ielts && lang.ielts > selectedIelts) return false;
        } catch { }
        return true;
    };

    const applyFilter = () => {
        const filtered = scholarships.filter(
            (s) =>
                filterByFields(s) &&
                filterByCities(s) &&
                filterByCost(s) &&
                filterByLanguageRequirements(s)
        );
        setFilteredScholarships(filtered);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSelectedFields([]);
        setSelectedCities([]);
        setSelectedCost(null);
        setSelectedToefl(null);
        setSelectedIelts(null);
        setFilteredScholarships(scholarships);
    };

    useEffect(() => {
        applyFilter();
    }, [selectedFields, selectedCities, selectedCost, selectedToefl, selectedIelts]);

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
                <p className="breadcrumb">Heatwave / Tìm học bổng cho bạn ngay nào</p>
                <h2 className="fw-bold mb-2">Học bổng cho bạn</h2>
                <p className="text-muted">
                    Khám phá các học bổng từ các trường đại học hàng đầu bên dưới. Sử dụng bộ lọc để tìm kiếm theo lĩnh vực, ngôn ngữ, thành phố và chi phí
                </p>

                <div className="filter-panel shadow-sm p-4 mb-4 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <h5 className="mb-3 fw-bold">Lọc học bổng</h5>
                    <div className="row">
                        <div className="col-md-3 mb-3">
                            <label className="fw-semibold mb-1">Lĩnh vực giảng dạy</label>
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

                        <div className="col-md-2 mb-3">
                            <label className="fw-semibold mb-1">Chi phí tối đa</label>
                            <Select
                                options={costOptions.map(c => ({ value: c, label: `${c.toLocaleString('vi-VN')} GBP` }))}
                                value={selectedCost ? { value: selectedCost, label: `${selectedCost.toLocaleString('vi-VN')} GBP` } : null}
                                onChange={(selected) => setSelectedCost(selected?.value || null)}
                                placeholder="Chọn chi phí"
                                isClearable
                            />
                        </div>

                        <div className="col-md-2 mb-3">
                            <label className="fw-semibold mb-1">TOEFL tối đa</label>
                            <Select
                                options={toeflOptions.map(score => ({ value: score, label: `${score} điểm` }))}
                                value={selectedToefl ? { value: selectedToefl, label: `${selectedToefl} điểm` } : null}
                                onChange={(selected) => setSelectedToefl(selected?.value || null)}
                                placeholder="Chọn TOEFL"
                                isClearable
                            />
                        </div>

                        <div className="col-md-2 mb-3">
                            <label className="fw-semibold mb-1">IELTS tối đa</label>
                            <Select
                                options={ieltsOptions.map(score => ({ value: score, label: `${score} điểm` }))}
                                value={selectedIelts ? { value: selectedIelts, label: `${selectedIelts} điểm` } : null}
                                onChange={(selected) => setSelectedIelts(selected?.value || null)}
                                placeholder="Chọn IELTS"
                                isClearable
                            />
                        </div>
                    </div>

                    <div className="mt-3 d-flex justify-content-end">
                        <button className="btn btn-danger" onClick={clearFilters}>Hủy bỏ</button>
                    </div>
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

                {filteredScholarships.length > itemsPerPage && (
                    <nav className="mt-4">
                        <ul className="pagination justify-content-center">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1}>
                                    &laquo;
                                </button>
                            </li>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                    <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                                        {i + 1}
                                    </button>
                                </li>
                            ))}
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
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

export default SearchSchool;
