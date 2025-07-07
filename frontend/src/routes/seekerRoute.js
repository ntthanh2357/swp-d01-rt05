import { Routes, Route } from "react-router-dom";
import UserProfile from "../pages/user-profile";

function SeekerRoute() {
    return (
        <Routes>
            <Route path="/user-profile" element={<UserProfile />} />
        </Routes>
    );
}

export default SeekerRoute;