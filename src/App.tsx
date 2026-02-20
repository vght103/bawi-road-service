import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/home/HomePage";
import AcademySearchPage from "@/pages/academy/AcademySearchPage";
import AcademyDetailPage from "@/pages/academy/AcademyDetailPage";
import WhyPhilippinesPage from "@/pages/why-philippines/WhyPhilippinesPage";
import ProcessPage from "@/pages/process/ProcessPage";
import VisaInfoPage from "@/pages/visa-info/VisaInfoPage";
import QuotePage from "@/pages/quote/QuotePage";
import SignupPage from "@/pages/auth/SignupPage";
import LoginPage from "@/pages/auth/LoginPage";
import MyPage from "@/pages/my/MyPage";
import ProtectedRoute from "@/components/ProtectedRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/academies" element={<AcademySearchPage />} />
      <Route path="/academy/:id" element={<AcademyDetailPage />} />
      <Route path="/why-philippines" element={<WhyPhilippinesPage />} />
      <Route path="/process" element={<ProcessPage />} />
      <Route path="/visa-info" element={<VisaInfoPage />} />
      <Route path="/quote" element={<QuotePage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/my" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
      {/* backward compat */}
      <Route path="/search" element={<AcademySearchPage />} />
    </Routes>
  );
}

export default App;
