import React, { useEffect, useState, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import {
    getAllScholarships,
    addScholarship,
    updateScholarship,
    deleteScholarship
} from "../services/scholarshipApi";
import { getStaffOverview } from "../services/staffApi"; // hoặc hàm phù hợp bạn muốn dùng
import ScholarshipCard1 from "../components/ScholarshipCard1";
import { UserContext } from "../contexts/UserContext";

function AdminDashboard() {
    const [scholarships, setScholarships] = useState([]);
    const [loading, setLoading] = useState(true);
    const [form, setForm] = useState({ name: "", description: "" });
    const [editId, setEditId] = useState(null);
    const [staffList, setStaffList] = useState([]);
    const [selectedStaff, setSelectedStaff] = useState("");
    const [scrapeUrl, setScrapeUrl] = useState("");
    const [scrapeResult, setScrapeResult] = useState(null);
    const { user } = useContext(UserContext);

    useEffect(() => {
        fetchData();
        fetchStaff();
    }, []);

    async function fetchData(staffId) {
        setLoading(true);
        try {
            // Optionally filter scholarships by staffId
            const res = await getAllScholarships(staffId);
            setScholarships(res.data);
        } catch (err) {
            setScholarships([]);
        }
        setLoading(false);
    }

    async function fetchStaff() {
        try {
            const res = await getStaffOverview();
            setStaffList(res.data);
        } catch (err) {
            setStaffList([]);
        }
    }

    const handleStaffChange = (e) => {
        setSelectedStaff(e.target.value);
        fetchData(e.target.value);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editId) {
                await updateScholarship(editId, form);
            } else {
                await addScholarship(form);
            }
            setForm({ name: "", description: "" });
            setEditId(null);
            fetchData(selectedStaff);
        } catch (err) {
            alert("Error saving scholarship");
        }
    };

    const handleEdit = (scholarship) => {
        setForm({ name: scholarship.name, description: scholarship.description });
        setEditId(scholarship.scholarshipId);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this scholarship?")) {
            try {
                await deleteScholarship(id);
                fetchData(selectedStaff);
            } catch (err) {
                alert("Error deleting scholarship");
            }
        }
    };

    const handleScrape = async (e) => {
        e.preventDefault();
        try {
            const token = user?.accessToken; // Or your auth context
            const res = await fetch("/api/scholarship-scraper/scrape-and-save", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ url: scrapeUrl, token })
            });
            const data = await res.json();
            setScrapeResult(data);
            // Optionally refresh scholarship list
        } catch {
            setScrapeResult({ error: "Scrape failed" });
        }
    };

    return (
        <>
            <Header />
            <main className="container mt-5">
                <h2 className="text-center mb-4">Admin Dashboard</h2>
                <div className="mb-4">
                    <label>Select Staff: </label>
                    <select value={selectedStaff} onChange={handleStaffChange}>
                        <option value="">All Staff</option>
                        {staffList.map(staff => (
                            <option key={staff.id} value={staff.id}>{staff.name}</option>
                        ))}
                    </select>
                </div>
                <form onSubmit={handleSubmit} className="mb-4">
                    <input
                        type="text"
                        name="name"
                        placeholder="Scholarship Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="description"
                        placeholder="Description"
                        value={form.description}
                        onChange={handleChange}
                        required
                    />
                    <button type="submit">{editId ? "Update" : "Create"} Scholarship</button>
                    {editId && (
                        <button type="button" onClick={() => { setEditId(null); setForm({ name: "", description: "" }); }}>
                            Cancel
                        </button>
                    )}
                </form>
                <form onSubmit={handleScrape} className="mb-4">
                    <input
                        type="text"
                        placeholder="Paste scholarship URL here"
                        value={scrapeUrl}
                        onChange={e => setScrapeUrl(e.target.value)}
                        required
                    />
                    <button type="submit">Scrape & Save Scholarship</button>
                </form>
                {scrapeResult && scrapeResult.error && (
                    <div className="text-danger">{scrapeResult.error}</div>
                )}
                {scrapeResult && scrapeResult.scholarship && (
                    <div className="text-success">Scholarship saved: {scrapeResult.scholarship.title}</div>
                )}
                {loading ? (
                    <div className="text-center">Đang tải dữ liệu...</div>
                ) : (
                    <div className="row">
                        {scholarships.map(scholarship => (
                            <div className="col-md-6 mb-4" key={scholarship.scholarshipId}>
                                <ScholarshipCard1 scholarship={scholarship} />
                                <button onClick={() => handleEdit(scholarship)}>Edit</button>
                                <button onClick={() => handleDelete(scholarship.scholarshipId)}>Delete</button>
                            </div>
                        ))}
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}

export default AdminDashboard;