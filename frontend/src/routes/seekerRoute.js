import { Routes, Route } from "react-router-dom";
import UserProfile from "../pages/user-profile";
import ConsultationRoadmap from '../pages/consultation-roadmap/consultation-roadmap';
import MyCV from '../pages/my-cv';

function SeekerRoute() {
    return (
        <Routes>
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/consultation-roadmap" element={<ConsultationRoadmap />} />
            <Route path="/my-cv" element={<MyCV />} />
        </Routes>
    );
}

export default SeekerRoute;