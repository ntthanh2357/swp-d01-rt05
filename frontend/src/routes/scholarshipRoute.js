import { Routes, Route } from "react-router-dom";
import Home from "../pages/home";
import ScholarshipManage from "../pages/scholarship-manage";
import SearchScholarship from "../pages/searchScholarship";
import About from "../pages/about";
import TransactionHistory from "../pages/transaction-history";

function ScholarshipRoute() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/manage-scholarships" element={<ScholarshipManage />} />
            <Route path="/search-scholarships" element={<SearchScholarship />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<TransactionHistory />} />
        </Routes>
    );
}

export default ScholarshipRoute;