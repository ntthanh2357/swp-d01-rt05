import React, { useEffect, useState, useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Banner from '../components/Banner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ScholarshipCard from '../components/ScholarshipCard';
import FloatingContactButton from "../components/FloatingContactButton";
import Countries from '../components/Countries';
import Know from '../components/Know';
import Choose from '../components/Choose';
import WhyChoose from '../components/Whychoose';
import RegisterForm from '../components/Register-book';
import FlywireAd from '../components/FlywireAd';
import ChatBox from '../components/ChatBox';

import { getAllScholarships } from '../services/scholarshipApi';
import { UserContext } from '../contexts/UserContext';

export default function Home() {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useContext(UserContext);

    // Thêm state cho phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 18;

    useEffect(() => {
        const fetchScholarships = async () => {
            setLoading(true);
            try {
                const res = await getAllScholarships();
                setScholarships(res.data);
            } catch (err) {
                setScholarships([]);
            }
            setLoading(false);
        };
        fetchScholarships();
    }, [user]);

    // Tính toán các học bổng sẽ hiển thị
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentScholarships = scholarships.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(scholarships.length / itemsPerPage);

    // Hàm chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 5050, behavior: 'smooth' });
    };

    return (
        <>
            <Header />
            <Banner />
            <RegisterForm/>
            <FlywireAd/>
            <WhyChoose/>
            <Know/>
            <Countries/>
            <Choose/>          
            <main className="container mt-5">
                <h2 className="text-center">Available Scholarships</h2>
                <div className="row">
                    {loading ? (
                        <div className="text-center my-5">Đang tải học bổng...</div>
                    ) : scholarships.length === 0 ? (
                        <div className="text-center my-5">Không có học bổng nào.</div>
                    ) : (
                        currentScholarships.map((scholarship) => (
                            <div className="col-md-4 mb-4" key={scholarship.scholarshipId}>
                                <ScholarshipCard scholarship={scholarship} />
                            </div>
                        ))
                    )}
                </div>

                {/* Phân trang */}
                {!loading && scholarships.length > itemsPerPage && (
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
                <FloatingContactButton />
                <ChatBox />
            </main>            
            <Footer />
        </>
    );
}