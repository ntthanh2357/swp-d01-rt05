import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import OrganizationCard from '../components/OrganizationCard';
import { getAllOrganizations } from '../services/organizationApi';

function ListOrganization() {
    const [organizations, setOrganizations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getAllOrganizations()
            .then(res => setOrganizations(res.data))
            .catch(() => setOrganizations([]))
            .finally(() => setLoading(false));
    }, []);

    return (
        <>
            <Header />
            <main className="container mt-5">
                <h2 className="text-center mb-4">Danh sách trường học</h2>
                {loading ? (
                    <div className="text-center my-5">Đang tải trường học...</div>
                ) : organizations.length === 0 ? (
                    <div className="text-center my-5">Không có trường học nào.</div>
                ) : (
                    <div className="row g-4">
                        {organizations.map(org => (
                            <div className="col-md-4" key={org.organizationId}>
                                <OrganizationCard organization={org} />
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}

export default ListOrganization;
