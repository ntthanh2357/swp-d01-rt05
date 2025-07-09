import React, { useEffect, useState, useContext } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import Banner from '../components/Banner';
import Header from '../components/Header';
import Footer from '../components/Footer';
import FloatingContactButton from "../components/FloatingContactButton";
import Countries from '../components/Countries';
import Know from '../components/Know';
import Choose from '../components/Choose';
import WhyChoose from '../components/Whychoose';
import RegisterForm from '../components/Register-book';
import FlywireAd from '../components/FlywireAd';
import ChatBox from '../components/ChatBox';
import OrganizationCard from '../components/OrganizationCard';

import { getActiveOrganizations } from '../services/organizationApi';
import { UserContext } from '../contexts/UserContext';

export default function Home() {
    const [orgLoading, setOrgLoading] = useState(true);
    const { user } = useContext(UserContext);

    // Thêm state cho danh sách trường học
    const [organizations, setOrganizations] = useState([]);

    useEffect(() => {
        setOrgLoading(true);
        getActiveOrganizations()
            .then(res => setOrganizations(res.data))
            .catch(() => setOrganizations([]))
            .finally(() => setOrgLoading(false));
    }, []);

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
                {/* Danh sách trường học */}
                <section className="my-5">
                    <h3 className="fw-bold mb-4">Trường học</h3>
                    <div className="row g-4">
                        {orgLoading ? (
                            <div className="text-center my-5">Đang tải trường học...</div>
                        ) : organizations.length === 0 ? (
                            <div className="text-center my-5">Không có trường học nào.</div>
                        ) : (
                            organizations.map(org => (
                                <div className="col-md-4" key={org.organizationId}>
                                    <OrganizationCard organization={org} />
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <FloatingContactButton />
                <ChatBox />
            </main>            
            <Footer />
        </>
    );
}