import { Routes, Route } from "react-router-dom";
import UserManage from "../pages/user-manage";
import CreateStaff from "../pages/create-staff";
import CreateAdmin from "../pages/create-admin";

function UserRoute() {
    return (
        <Routes>
            <Route path="/manage-users" element={<UserManage />} />
            <Route path="/create-staff" element={<CreateStaff />} />
            <Route path="/create-admin" element={<CreateAdmin />} />
        </Routes>
    );
}

export default UserRoute;