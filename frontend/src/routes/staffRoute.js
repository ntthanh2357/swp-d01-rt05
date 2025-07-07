import { Routes, Route } from "react-router-dom";
import StaffDashboard from "../pages/staff-dashboard";
import { jwtDecode } from "jwt-decode";

function StaffRoute() {
    // Lấy accessToken từ localStorage và decode để lấy staffId
    let staffId = null;
    const token = localStorage.getItem("accessToken");
    if (token) {
        try {
            const decoded = jwtDecode(token);
            staffId = decoded.userId || decoded.staffId || decoded.sub;
        } catch (e) {
            staffId = null;
        }
    }

    return (
        <Routes>
            <Route path="/staff-dashboard" element={<StaffDashboard staffId={staffId} />} />
        </Routes>
    );
}

export default StaffRoute;