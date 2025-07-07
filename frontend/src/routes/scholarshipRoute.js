import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import ScholarshipManage from "../pages/scholarship-manage";
import SearchSchool from "../pages/searchSchool";
import About from "../pages/about";
    function ScholarshipRoute() {
        return (
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/manage-scholarships" element={<ScholarshipManage />} />
                <Route path="/search" element={<SearchSchool />} />
                <Route path="/about" element={<About />} />
            </Routes>
        );
    }

export default ScholarshipRoute;