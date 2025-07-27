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
import PaymentSuccess from './pages/payment-success';
import PaymentCancel from './pages/payment-cancel';
import Payment from './pages/payment'; // Import component thanh toán
import OrganizationRoute from "./routes/organizationRoute";
import SearchOrganization from './pages/searchOrganization';
import PrivacyPolicy from './pages/privacy';
import TermsOfUse from './pages/terms';
import Disclaimer from './pages/disclaimer';
import Library from "./pages/library";
import SearchStaff from './pages/searchStaff';
import DetailStaff from './pages/detailStaff';

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
                                <Route path="/payment/success" element={<PaymentSuccess />} />
                                <Route path="/payment/cancel" element={<PaymentCancel />} />
                                <Route path="/payment-cancel" element={<PaymentCancel />} />
                                <Route path="/payment-success" element={<PaymentSuccess />} />
                                <Route path="/search-university" element={<SearchOrganization />} />
                                <Route path="/privacy" element={<PrivacyPolicy />} />
                                <Route path="/terms" element={<TermsOfUse />} />
                                <Route path="/disclaimer" element={<Disclaimer />} />
                                <Route path="/library" element={<Library />} />
                                <Route path="/search-staff" element={<SearchStaff />} />
                                <Route path="/detail-staff/:staffId" element={<DetailStaff />} />
                                <Route path="/*" element={<ScholarshipRoute />} />
                            </Routes>
                        </Router>
                    </FavoriteProvider>
                </ChatProvider>
            </UserProvider>
        </GoogleOAuthProvider>
    );
}

export default App;