import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ErrorBoundary from "./components/ErrorBoundary";
import VideoCallOverlay from "./components/VideoCallOverlay";
import IncomingCallModal from "./components/IncomingCallModal";
import ProtectedRoute from "./components/common/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

import { lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const EmailVerification = lazy(() => import("./pages/EmailVerification"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard"));
const PaymentPage = lazy(() => import("./pages/PaymentPage"));
const SubscriptionPage = lazy(() => import("./pages/SubscriptionPage"));
const SubscriptionCheckoutPage = lazy(() => import("./pages/SubscriptionCheckoutPage"));
import usePushNotifications from "./hooks/usePushNotifications";

// Provider Pages (New Rebuild)
import ProviderLayout from "./components/provider/ProviderLayout";
const NewProviderDashboard = lazy(() => import("./pages/provider/Dashboard"));
const ProviderServices = lazy(() => import("./pages/provider/Services"));
const ProviderBookings = lazy(() => import("./pages/provider/Bookings"));
const ProviderEarnings = lazy(() => import("./pages/provider/Earnings"));
const ProviderProfile = lazy(() => import("./pages/provider/Profile"));
const ProviderReviews = lazy(() => import("./pages/provider/Reviews"));
const ProviderMessages = lazy(() => import("./pages/provider/Messages"));
const ProviderMembership = lazy(() => import("./pages/provider/Membership"));
const ProviderSafety = lazy(() => import("./pages/provider/Safety"));
const ProviderSlotManager = lazy(() => import("./pages/provider/SlotManager"));
const ProviderSupport = lazy(() => import("./pages/provider/Support"));

// New Pages
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Categories = lazy(() => import("./pages/Categories"));
const Wallet = lazy(() => import("./pages/Wallet"));
const Notifications = lazy(() => import("./pages/Notifications"));
const Careers = lazy(() => import("./pages/Careers"));
const Blog = lazy(() => import("./pages/Blog"));
const Press = lazy(() => import("./pages/Press"));
const HowItWorks = lazy(() => import("./pages/HowItWorks"));
const HelpCenter = lazy(() => import("./pages/HelpCenter"));
const Safety = lazy(() => import("./pages/Safety"));
const Support = lazy(() => import("./pages/Support"));
const BecomeProvider = lazy(() => import("./pages/BecomeProvider"));
const ProviderResources = lazy(() => import("./pages/ProviderResources"));
const PartnerWithUs = lazy(() => import("./pages/PartnerWithUs"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));
const RefundPolicy = lazy(() => import("./pages/RefundPolicy"));
const CancellationPolicy = lazy(() => import("./pages/CancellationPolicy"));
const CityPage = lazy(() => import("./pages/CityPage"));

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/authSlice";
import { authService } from "./services/authService";


const SuspenseFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-[#0A0C10]">
    <div className="w-12 h-12 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
  </div>
);

function App() {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { mode } = useSelector((state) => state.theme);

  useEffect(() => {
    // Sync theme class with document root
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [mode]);

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
      <ScrollToTop />
      <Navbar />
      <VideoCallOverlay />
      <IncomingCallModal />
      <main className="min-h-screen">
        <ErrorBoundary>
          <Suspense fallback={<SuspenseFallback />}>
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
                <Route path="/provider/slots" element={<ProviderSlotManager />} />
                <Route path="/provider/support" element={<ProviderSupport />} />
              </Route>
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
            </Route>

            {/* Payment routes - require authentication */}
            <Route element={<ProtectedRoute allowedRoles={["user", "provider", "admin"]} />}>
              <Route path="/checkout/:bookingId" element={<PaymentPage />} />
              <Route
                path="/subscribe/checkout/:planId"
                element={<SubscriptionCheckoutPage />}
              />
            </Route>
            <Route path="/subscriptions" element={<SubscriptionPage />} />

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
          </Suspense>
        </ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}

export default App;
