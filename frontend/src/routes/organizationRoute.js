import { Routes, Route } from "react-router-dom";
import DetailOrganization from "../components/DetailOrganization";
import ListOrganization from "../pages/list-organization";

function OrganizationRoute() {
    return (
        <Routes>
            {/* Khi user truy cập /organization/ */}
            <Route path="" element={<ListOrganization />} />
            {/* Khi user truy cập /organization/:organizationId */}
            <Route path=":organizationId" element={<DetailOrganization />} />
        </Routes>
    );
}

export default OrganizationRoute;
