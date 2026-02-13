import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import AcademySearchPage from "@/pages/AcademySearchPage";
import AcademyDetailPage from "@/pages/AcademyDetailPage";
import WhyPhilippinesPage from "@/pages/WhyPhilippinesPage";
import ProcessPage from "@/pages/ProcessPage";
import VisaInfoPage from "@/pages/VisaInfoPage";
import QuotePage from "@/pages/QuotePage";
import SignupPage from "@/pages/SignupPage";
import LoginPage from "@/pages/LoginPage";

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
      {/* backward compat */}
      <Route path="/search" element={<AcademySearchPage />} />
    </Routes>
  );
}

export default App;
