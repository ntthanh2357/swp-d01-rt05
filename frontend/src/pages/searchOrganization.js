import React, { useEffect, useState } from 'react';
import Select from 'react-select';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrganizationCard from '../components/OrganizationCard';
import { getActiveOrganizations, searchOrganizations } from '../services/organizationApi';
import { useLocation } from 'react-router-dom';
import { useRef } from 'react';

function SearchOrganization() {
    const location = useLocation();
    const filterSetFromUrl = useRef(false);
    const [organizations, setOrganizations] = useState([]);
    const [filteredOrganizations, setFilteredOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filter states
    const [countries, setCountries] = useState([]);
    const [organizationTypes, setOrganizationTypes] = useState([]);
    const [selectedCountries, setSelectedCountries] = useState([]);
    const [selectedOrganizationTypes, setSelectedOrganizationTypes] = useState([]);
    const [searchName, setSearchName] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Kiểm tra xem có filter nào đang được áp dụng không
    const hasActiveFilters = () => {
        return searchName.trim() !== '' || 
               selectedCountries.length > 0 || 
               selectedOrganizationTypes.length > 0;
    };

    useEffect(() => {
        const fetchOrganizations = async () => {
            setLoading(true);
            try {
                const res = await getActiveOrganizations();
                const data = res.data;
                setOrganizations(data);
                setFilteredOrganizations(data);

                // Extract unique countries and organization types
                const countriesSet = new Set();
                const typesSet = new Set();

                data.forEach((org) => {
                    if (org.country) countriesSet.add(org.country);
                    if (org.organizationType) typesSet.add(org.organizationType);
                });

                setCountries(Array.from(countriesSet).sort());
                setOrganizationTypes(Array.from(typesSet).sort());
            } catch (error) {
                console.error('Lỗi khi tải trường học:', error);
                setOrganizations([]);
                setFilteredOrganizations([]);
            }
            setLoading(false);
        };

        fetchOrganizations();
    }, []);

    useEffect(() => {
        // Parse query params for pre-selecting country, only after organizations are loaded
        if (organizations.length > 0 && !filterSetFromUrl.current) {
            const params = new URLSearchParams(location.search);
            const countryParam = params.get('countries');
            if (countryParam) {
                setSelectedCountries([countryParam]);
                filterSetFromUrl.current = true;
            }
        }
    }, [organizations, location.search]);

    const applyFilters = () => {
        let filtered = organizations;

        // Filter by name
        if (searchName.trim()) {
            filtered = filtered.filter(org => 
                org.name && org.name.toLowerCase().includes(searchName.toLowerCase())
            );
        }

        // Filter by countries
        if (selectedCountries.length > 0) {
            filtered = filtered.filter(org => 
                org.country && selectedCountries.includes(org.country)
            );
        }

        // Filter by organization types
        if (selectedOrganizationTypes.length > 0) {
            filtered = filtered.filter(org => 
                org.organizationType && selectedOrganizationTypes.includes(org.organizationType)
            );
        }

        setFilteredOrganizations(filtered);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchName('');
        setSelectedCountries([]);
        setSelectedOrganizationTypes([]);
        setFilteredOrganizations(organizations);
        setCurrentPage(1);
    };

    useEffect(() => {
        applyFilters();
    }, [searchName, selectedCountries, selectedOrganizationTypes]);

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentOrganizations = filteredOrganizations.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredOrganizations.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <>
            <Header />
            <main className="container mt-5">
                <h2 className="text-center mb-4">Tìm kiếm trường học</h2>
                
                {/* Filter Panel */}
                <div className="filter-panel shadow-sm p-4 mb-4 rounded" style={{ backgroundColor: '#f8f9fa' }}>
                    <h5 className="mb-3 fw-bold">Lọc trường học</h5>
                    <div className="row">
                        <div className="col-md-4 mb-3">
                            <label className="fw-semibold mb-1">Tên trường</label>
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Nhập tên trường..."
                                value={searchName}
                                onChange={(e) => setSearchName(e.target.value)}
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="fw-semibold mb-1">Quốc gia</label>
                            <Select
                                options={countries.map(c => ({ value: c, label: c }))}
                                isMulti
                                value={selectedCountries.map(c => ({ value: c, label: c }))}
                                onChange={(selected) => setSelectedCountries(selected.map(item => item.value))}
                                placeholder="Chọn quốc gia"
                            />
                        </div>
                        <div className="col-md-4 mb-3">
                            <label className="fw-semibold mb-1">Loại tổ chức</label>
                            <Select
                                options={organizationTypes.map(t => ({ value: t, label: t }))}
                                isMulti
                                value={selectedOrganizationTypes.map(t => ({ value: t, label: t }))}
                                onChange={(selected) => setSelectedOrganizationTypes(selected.map(item => item.value))}
                                placeholder="Chọn loại tổ chức"
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

                {/* Results */}
                {loading ? (
                    <div className="text-center my-5">Đang tải trường học...</div>
                ) : filteredOrganizations.length === 0 ? (
                    <div className="text-center my-5">Không có trường học nào phù hợp.</div>
                ) : (
                    <>
                        <div className="row g-4">
                            {currentOrganizations.map(org => (
                                <div className="col-md-4" key={org.organizationId}>
                                    <OrganizationCard organization={org} />
                                </div>
                            ))}
                        </div>

                        {/* Pagination */}
                        {filteredOrganizations.length > itemsPerPage && (
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
                    </>
                )}
            </main>
            <Footer />
        </>
    );
}

export default SearchOrganization;
