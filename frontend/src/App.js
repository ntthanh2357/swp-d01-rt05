import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { UserProvider } from "./contexts/UserContext";
import { ChatProvider } from './contexts/ChatContext';
import { FavoriteProvider } from './contexts/FavoriteContext';
import AuthRoute from "./routes/authRoute";
import UserRoute from "./routes/userRoute";
import SeekerRoute from "./routes/seekerRoute";
import StaffRoute from "./routes/staffRoute";
import ScholarshipRoute from "./routes/scholarshipRoute";
import DetailRoute from "./routes/detailRoute";
import Messages from './pages/messages';
import ChatBox from './components/ChatBox';
<<<<<<< HEAD
import Payment from './pages/payment';
import PaymentSuccess from './pages/payment-success';
import PaymentCancel from './pages/payment-cancel';
=======
import Payment from './pages/payment'; // Import component thanh toán
import OrganizationRoute from "./routes/organizationRoute";
import SearchOrganization from './pages/searchOrganization';
import PrivacyPolicy from './pages/privacy';
import TermsOfUse from './pages/terms';
import Disclaimer from './pages/disclaimer';
import Library from "./pages/library";
>>>>>>> 10124a4e35f2f33b81daf33a6f89445996fee1ce

function App() {
    return (
        <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}>
            <UserProvider>
                <ChatProvider>
                    <FavoriteProvider>
                        <Router>
                        <Routes>
                            <Route path="/auth/*" element={<AuthRoute />} />
                            <Route path="/admin/*" element={<UserRoute />} />
                            <Route path="/seeker/*" element={<SeekerRoute />} />
                            <Route path="/staff/*" element={<StaffRoute />} />
                            <Route path="/organization/*" element={<OrganizationRoute />} />
                            <Route path="/detailRoute/*" element={<DetailRoute />} />
                            <Route path="/messages" element={<Messages />} />
                            <Route path="/chat" element={<ChatBox />} />
                            <Route path="/payment" element={<Payment />} />
<<<<<<< HEAD
                            <Route path="/payment-success" element={<PaymentSuccess />} />
                            <Route path="/payment-cancel" element={<PaymentCancel />} />
                            <Route path="/staff/*" element={<StaffRoute />} />
                            {/* Thêm các route khác ở đây nếu có */}
=======
                            <Route path="/search-university" element={<SearchOrganization />} />
                            <Route path="/privacy" element={<PrivacyPolicy />} />
                            <Route path="/terms" element={<TermsOfUse />} />
                            <Route path="/disclaimer" element={<Disclaimer />} />
                            <Route path="/library" element={<Library />} />
                            <Route path="/*" element={<ScholarshipRoute />} />
>>>>>>> 10124a4e35f2f33b81daf33a6f89445996fee1ce
                        </Routes>
                    </Router>
                    </FavoriteProvider>
                </ChatProvider>
            </UserProvider>
        </GoogleOAuthProvider>
    );
}

export default App;