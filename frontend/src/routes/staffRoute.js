import { Routes, Route } from "react-router-dom";
import StaffDashboard from "../pages/staff-dashboard";
import StaffProfile from "../pages/staff-profile";
import SearchStaff from "../pages/searchStaff";
import DetailStaff from "../pages/detailStaff";
import ConsultationRoadmapStaff from '../pages/consultation-roadmap-staff/consultation-roadmap-staff';
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
            <Route path="/staff-profile" element={<StaffProfile staffId={staffId} />} />
            <Route path="/search-staff" element={<SearchStaff />} />
            <Route path="/detail-staff/:staffId" element={<DetailStaff />} />
            <Route path="/consultation-roadmap" element={<ConsultationRoadmapStaff />} />
        </Routes>
    );
}

export default StaffRoute;