import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import VideoCallOverlay from "./components/VideoCallOverlay";
import IncomingCallModal from "./components/IncomingCallModal";
import ProtectedRoute from "./components/common/ProtectedRoute";

import Home from "./pages/Home";
import EmailVerification from "./pages/EmailVerification";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PaymentPage from "./pages/PaymentPage";
import SubscriptionPage from "./pages/SubscriptionPage";
import SubscriptionCheckoutPage from "./pages/SubscriptionCheckoutPage";
import usePushNotifications from "./hooks/usePushNotifications";

// Provider Pages (New Rebuild)
import ProviderLayout from "./components/provider/ProviderLayout";
import NewProviderDashboard from "./pages/provider/Dashboard";
import ProviderServices from "./pages/provider/Services";
import ProviderBookings from "./pages/provider/Bookings";
import ProviderEarnings from "./pages/provider/Earnings";
import ProviderProfile from "./pages/provider/Profile";
import ProviderReviews from "./pages/provider/Reviews";
import ProviderMessages from "./pages/provider/Messages";
import ProviderMembership from "./pages/provider/Membership";
import ProviderSafety from "./pages/provider/Safety";

// New Pages
import About from "./pages/About";
import Contact from "./pages/Contact";
import Categories from "./pages/Categories";
import Wallet from "./pages/Wallet";
import Notifications from "./pages/Notifications";
import Careers from "./pages/Careers";
import Blog from "./pages/Blog";
import Press from "./pages/Press";
import HowItWorks from "./pages/HowItWorks";
import HelpCenter from "./pages/HelpCenter";
import Safety from "./pages/Safety";
import Support from "./pages/Support";
import BecomeProvider from "./pages/BecomeProvider";
import ProviderResources from "./pages/ProviderResources";
import PartnerWithUs from "./pages/PartnerWithUs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import RefundPolicy from "./pages/RefundPolicy";
import CancellationPolicy from "./pages/CancellationPolicy";
import CityPage from "./pages/CityPage";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/authSlice";
import { authService } from "./services/authService";

function App() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      if (userInfo) {
        try {
          await authService.getProfile();
        } catch (error) {
          if (error.response?.status === 401) {
            dispatch(logout());
          }
        }
      }
    };
    checkAuth();
  }, [dispatch, userInfo]);

  usePushNotifications();
  return (
    <>
      <Navbar />
      <VideoCallOverlay />
      <IncomingCallModal />
      <main className="min-h-screen">
        <ErrorBoundary>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/verify-email/:token"
              element={<EmailVerification />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/resetpassword/:resettoken"
              element={<ResetPassword />}
            />
            <Route path="/services" element={<Services />} />
            <Route path="/services/:id" element={<ServiceDetail />} />

            {/* User Routes */}
            <Route element={<ProtectedRoute allowedRoles={["user", "provider", "admin"]} />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/profile" element={<Dashboard />} />
              <Route path="/bookings" element={<Dashboard />} />
              <Route path="/reviews" element={<Dashboard />} />
              <Route path="/favorites" element={<Dashboard />} />
              <Route path="/messages" element={<Dashboard />} />
              <Route path="/chat" element={<Dashboard />} />
              <Route path="/wallet" element={<Dashboard />} />
              <Route path="/referrals" element={<Dashboard />} />
              <Route path="/membership" element={<Dashboard />} />
              <Route path="/settings" element={<Dashboard />} />
              <Route path="/notifications" element={<Dashboard />} />
            </Route>

            {/* Provider Routes (Rebuilt) */}
            <Route element={<ProtectedRoute allowedRoles={["provider", "admin"]} />}>
              <Route element={<ProviderLayout />}>
                <Route path="/provider/dashboard" element={<NewProviderDashboard />} />
                <Route path="/provider/bookings" element={<ProviderBookings />} />
                <Route path="/provider/earnings" element={<ProviderEarnings />} />
                <Route path="/provider/services" element={<ProviderServices />} />
                <Route path="/provider/profile" element={<ProviderProfile />} />
                <Route path="/provider/reviews" element={<ProviderReviews />} />
                <Route path="/provider/messages" element={<ProviderMessages />} />
                <Route path="/provider/membership" element={<ProviderMembership />} />
                <Route path="/provider/safety" element={<ProviderSafety />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            <Route path="/checkout/:bookingId" element={<PaymentPage />} />
            <Route path="/subscriptions" element={<SubscriptionPage />} />
            <Route
              path="/subscribe/checkout/:planId"
              element={<SubscriptionCheckoutPage />}
            />

            {/* New Routes */}
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/careers" element={<Careers />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/press" element={<Press />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/safety" element={<Safety />} />
            <Route path="/support" element={<Support />} />
            <Route path="/provider/signup" element={<BecomeProvider />} />
            <Route path="/provider/login" element={<Login />} />
            <Route path="/provider/resources" element={<ProviderResources />} />
            <Route path="/partner" element={<PartnerWithUs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            <Route
              path="/cancellation-policy"
              element={<CancellationPolicy />}
            />
            <Route path="/city/:cityName" element={<CityPage />} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}

export default App;
