import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import LoadingOverlay from "@/components/LoadingOverlay";
import ProtectedRoute from "@/components/ProtectedRoute";

const HomePage = lazy(() => import("@/pages/home/HomePage"));
const AcademySearchPage = lazy(() => import("@/pages/academy/AcademySearchPage"));
const AcademyDetailPage = lazy(() => import("@/pages/academy/AcademyDetailPage"));
const WhyPhilippinesPage = lazy(() => import("@/pages/why-philippines/WhyPhilippinesPage"));
const ProcessPage = lazy(() => import("@/pages/process/ProcessPage"));
const VisaInfoPage = lazy(() => import("@/pages/visa-info/VisaInfoPage"));
const QuotePage = lazy(() => import("@/pages/quote/QuotePage"));
const InquiryPage = lazy(() => import("@/pages/inquiry/InquiryPage"));
const SignupPage = lazy(() => import("@/pages/auth/SignupPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const FindAccountPage = lazy(() => import("@/pages/auth/FindAccountPage"));
const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const MyPage = lazy(() => import("@/pages/my/MyPage"));
const EnrollmentApplyPage = lazy(() => import("@/pages/enrollment/EnrollmentApplyPage"));
const EnrollmentDetailPage = lazy(() => import("@/pages/enrollment/EnrollmentDetailPage"));
const WithBawiPage = lazy(() => import("@/pages/with-bawi/WithBawiPage"));
const ChatPage = lazy(() => import("@/pages/chat/ChatPage"));
const PrivacyPolicyPage = lazy(() => import("@/pages/legal/PrivacyPolicyPage"));
const TermsOfServicePage = lazy(() => import("@/pages/legal/TermsOfServicePage"));

function App() {
  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<LoadingOverlay visible />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/academies" element={<AcademySearchPage />} />
          <Route path="/academy/:id" element={<AcademyDetailPage />} />
          <Route path="/why-philippines" element={<WhyPhilippinesPage />} />
          <Route path="/process" element={<ProcessPage />} />
          <Route path="/visa-info" element={<VisaInfoPage />} />
          <Route path="/quote" element={<QuotePage />} />
          <Route path="/inquiry" element={<InquiryPage />} />
          <Route path="/with-bawi" element={<WithBawiPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/find-account" element={<FindAccountPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/my" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
          <Route path="/enrollment/apply" element={<ProtectedRoute><EnrollmentApplyPage /></ProtectedRoute>} />
          <Route path="/enrollment/:id" element={<ProtectedRoute><EnrollmentDetailPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          {/* backward compat */}
          <Route path="/search" element={<AcademySearchPage />} />
        </Routes>
      </Suspense>
    </>
  );
}

export default App;
