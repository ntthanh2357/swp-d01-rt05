// detailRoute.js
import { Routes, Route } from "react-router-dom";
import DetailScholarship from "../components/DetailScholarship"; // 🔁 component chi tiết học bổng

function DetailRoute() {
    return (
        <Routes>
            {/* Khi user truy cập /detailRoute/:id */}
            <Route path=":id" element={<DetailScholarship />} />
        </Routes>
    );
}

export default DetailRoute;
