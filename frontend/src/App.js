import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./contexts/UserContext";
import { ChatProvider } from './contexts/ChatContext';
import AuthRoute from "./routes/authRoute";
import UserRoute from "./routes/userRoute";
import SeekerRoute from "./routes/seekerRoute";
import StaffRoute from "./routes/staffRoute";
import ScholarshipRoute from "./routes/scholarshipRoute";
import DetailRoute from "./routes/detailRoute";
import Messages from './pages/messages';
import ChatBox from './components/ChatBox';
import Payment from './pages/payment'; // Import component thanh toán
function App() {
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <UserProvider>
                <ChatProvider>
                    <Router>
                        <Routes>
                            <Route path="/auth/*" element={<AuthRoute />} />
                            <Route path="/admin/*" element={<UserRoute />} />
                            <Route path="/seeker/*" element={<SeekerRoute />} />
                            <Route path="/*" element={<ScholarshipRoute />} />
                            <Route path="/detailRoute/*" element={<DetailRoute />} />
                            <Route path="/messages" element={<Messages />} />
                            <Route path="/chat" element={<ChatBox />} />
                            <Route path="/payment" element={<Payment />} /> // Dùng 'Payment' cho tên component
                            <Route path="/staff/*" element={<StaffRoute />} />
                            {/* Thêm các route khác ở đây nếu có */}
                        </Routes>
                    </Router>
                </ChatProvider>
            </UserProvider>
        </GoogleOAuthProvider>
    );
}

export default App;