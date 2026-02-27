import { Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import HomePage from "@/pages/home/HomePage";
import AcademySearchPage from "@/pages/academy/AcademySearchPage";
import AcademyDetailPage from "@/pages/academy/AcademyDetailPage";
import WhyPhilippinesPage from "@/pages/why-philippines/WhyPhilippinesPage";
import ProcessPage from "@/pages/process/ProcessPage";
import VisaInfoPage from "@/pages/visa-info/VisaInfoPage";
import QuotePage from "@/pages/quote/QuotePage";
import InquiryPage from "@/pages/inquiry/InquiryPage";
import SignupPage from "@/pages/auth/SignupPage";
import LoginPage from "@/pages/auth/LoginPage";
import FindAccountPage from "@/pages/auth/FindAccountPage";
import ResetPasswordPage from "@/pages/auth/ResetPasswordPage";
import MyPage from "@/pages/my/MyPage";
import EnrollmentApplyPage from "@/pages/enrollment/EnrollmentApplyPage";
import EnrollmentDetailPage from "@/pages/enrollment/EnrollmentDetailPage";
import WithBawiPage from "@/pages/with-bawi/WithBawiPage";
import ChatPage from "@/pages/chat/ChatPage";
import PrivacyPolicyPage from "@/pages/legal/PrivacyPolicyPage";
import TermsOfServicePage from "@/pages/legal/TermsOfServicePage";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <>
      <ScrollToTop />
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
    </>
  );
}

export default App;
