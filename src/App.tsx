import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import AcademySearchPage from "@/pages/AcademySearchPage";
import AcademyDetailPage from "@/pages/AcademyDetailPage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/search" element={<AcademySearchPage />} />
      <Route path="/academy/:id" element={<AcademyDetailPage />} />
    </Routes>
  );
}

export default App;
