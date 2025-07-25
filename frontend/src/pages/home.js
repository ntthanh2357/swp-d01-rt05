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
    // State để đồng bộ bật/tắt hai nút
    const [chatBoxOpen, setChatBoxOpen] = useState(false);
    const [contactButtonOpen, setContactButtonOpen] = useState(false);

    // Lấy danh sách quốc gia duy nhất từ organizations
    const countryList = Array.from(new Set(organizations.map(org => org.country).filter(Boolean))).sort();

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
            <RegisterForm countryList={countryList} />
            <WhyChoose />
            <Know />
            <Choose />
            <Countries />
            <FlywireAd />
            <main className="container mt-5">
                {/* Danh sách trường học */}
                {/* Nhóm nút liên hệ & chat */}
                <div className="contact-widget-group">
                    <FloatingContactButton
                        setChatBoxOpen={setChatBoxOpen}
                    />
                    <ChatBox
                        setContactButtonOpen={setContactButtonOpen}
                    />
                </div>
            </main>
            <Footer />
        </>
    );
}