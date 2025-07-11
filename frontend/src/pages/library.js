import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../contexts/UserContext";
import { useFavorites } from "../contexts/FavoriteContext";
import { getFavoriteScholarships } from "../services/seekerApi";
import ScholarshipCard from "../components/ScholarshipCard";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../css/scholarshipCard.css";

function Library() {
    const { user, isCheckingAuth } = useContext(UserContext);
    const { refreshFavorites, favoriteIds } = useFavorites();
    const [favorites, setFavorites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchFavorites = async () => {
        if (!user || !user.isLoggedIn) {
            setError("Bạn cần đăng nhập để xem mục yêu thích.");
            setLoading(false);
            return;
        }
        
        if (!user.accessToken) {
            setError("Token không hợp lệ. Vui lòng đăng nhập lại.");
            setLoading(false);
            return;
        }
        
        // Thêm log để debug
        console.log("User:", user);
        console.log("AccessToken:", user.accessToken);

        try {
            const res = await getFavoriteScholarships(user.accessToken);
            console.log("API response:", res);
            console.log("Response data:", res.data);
            console.log("Response status:", res.status);
            
            if (res.status === 200) {
                // Kiểm tra xem data có đúng format không
                if (Array.isArray(res.data)) {
                    console.log("Favorites array:", res.data);
                    setFavorites(res.data);
                    // Refresh favorites context
                    refreshFavorites();
                } else {
                    console.error("Response data is not an array:", res.data);
                    setError("Dữ liệu không đúng định dạng.");
                }
            } else {
                setError("Không thể tải danh sách học bổng yêu thích.");
                console.log("API error:", res);
            }
        } catch (err) {
            setError("Đã xảy ra lỗi khi tải danh sách học bổng yêu thích.");
            console.error("API error:", err);
            console.error("Error details:", err.response?.data);
        }
        setLoading(false);
    };

    useEffect(() => {
        // Đợi UserContext load xong
        if (isCheckingAuth) {
            return;
        }

        fetchFavorites();
    }, [user, isCheckingAuth]);

    // Hiển thị loading khi đang kiểm tra auth
    if (isCheckingAuth) {
        return (
            <div>
                <Header />
                <div className="container py-4">
                    <div>Đang tải...</div>
                </div>
                <Footer />
            </div>
        );
    }

    // Hiển thị loading khi đang kiểm tra auth
    if (isCheckingAuth) {
        return (
            <div>
                <Header />
                <div className="container py-4">
                    <div>Đang tải...</div>
                </div>
                <Footer />
            </div>
        );
    }

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
                        {favorites.map((fav) => {
                            console.log("Favorite item:", fav);
                            // Kiểm tra xem fav có phải là FavoriteScholarship object không
                            const scholarship = fav.scholarship || fav;
                            return (
                                <div className="col-md-4" key={fav.favoriteId || fav.scholarshipId}>
                                    <ScholarshipCard 
                                        scholarship={scholarship} 
                                        liked={true} 
                                        onLikeChange={(liked) => {
                                            if (!liked) {
                                                // Refresh favorites khi xóa
                                                setTimeout(() => {
                                                    fetchFavorites();
                                                }, 100);
                                            }
                                        }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}

export default Library; 