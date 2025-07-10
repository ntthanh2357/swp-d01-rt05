import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { getFavoriteScholarships } from "../services/seekerApi";
import ScholarshipCard from "../components/ScholarshipCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/scholarshipCard.css";

function Library() {
    const { user } = useContext(UserContext);
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchFavorites = async () => {
            if (!user || !user.accessToken) {
                setError("Bạn cần đăng nhập để xem mục yêu thích.");
                setLoading(false);
                return;
            }
            // Thêm log để debug
            console.log("User:", user);
            console.log("AccessToken:", user.accessToken);

            try {
                const res = await getFavoriteScholarships(user.accessToken);
                console.log("API response:", res);
                if (res.status === 200) {
                    setFavorites(res.data);
                } else {
                    setError("Không thể tải danh sách học bổng yêu thích.");
                    console.log("API error:", res);
                }
            } catch (err) {
                setError("Đã xảy ra lỗi khi tải danh sách học bổng yêu thích.");
                console.error("API error:", err);
            }
            setLoading(false);
        };
        fetchFavorites();
    }, [user]);

    // Chặn truy cập nếu không phải seeker
    if (user && user.role !== 'seeker') {
        return (
            <div>
                <Header />
                <div className="container py-4">
                    <div className="alert alert-danger">Chỉ seeker mới có thể sử dụng thư viện yêu thích.</div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div>
            <Header />
            <div className="container py-4">
                <h2 className="mb-4">Thư viện học bổng yêu thích</h2>
                {loading ? (
                    <div>Đang tải...</div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : favorites.length === 0 ? (
                    <div>Bạn chưa có học bổng yêu thích nào.</div>
                ) : (
                    <div className="row g-4">
                        {favorites.map((fav) => (
                            <div className="col-md-4" key={fav.favoriteId}>
                                <ScholarshipCard scholarship={fav.scholarship} liked={true} />
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Library; 