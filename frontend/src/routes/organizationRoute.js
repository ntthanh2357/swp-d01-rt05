import { Routes, Route, Navigate } from "react-router-dom";
import DetailOrganization from "../components/DetailOrganization";
import ListOrganization from "../pages/list-organization";
import SearchOrganization from "../pages/searchOrganization";

function OrganizationRoute() {
    return (
        <Routes>
            {/* Khi user truy cập /organization/ - redirect về search-university */}
            <Route path="" element={<Navigate to="/search-university" replace />} />
            {/* Khi user truy cập /search-university */}
            <Route path="search-university" element={<SearchOrganization />} />
            {/* Khi user truy cập /organization/:organizationId */}
            <Route path=":organizationId" element={<DetailOrganization />} />
        </Routes>
    );
}

export default OrganizationRoute;
