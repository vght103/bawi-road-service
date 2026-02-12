import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import BawiLogo from "./BawiLogo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-cream/85 backdrop-blur-[16px] border-b border-beige-dark transition-shadow ${scrolled ? "shadow-md" : ""}`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 no-underline text-brown-dark">
          <BawiLogo size={36} />
          <div>
            <div className="font-extrabold text-[1.2rem] tracking-tight leading-tight">바위로드</div>
            <div className="text-[0.65rem] text-brown font-medium tracking-wider">BAWI ROAD</div>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-7">
          <Link
            to="/academies"
            className="text-brown text-[0.9rem] font-medium hover:text-brown-dark transition-colors no-underline relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-terracotta after:transition-all hover:after:w-full"
          >
            어학원 비교
          </Link>
          <a
            href="/#cost"
            className="text-brown text-[0.9rem] font-medium hover:text-brown-dark transition-colors no-underline relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-terracotta after:transition-all hover:after:w-full"
          >
            비용 가이드
          </a>
          <a
            href="/#reviews"
            className="text-brown text-[0.9rem] font-medium hover:text-brown-dark transition-colors no-underline relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-terracotta after:transition-all hover:after:w-full"
          >
            후기
          </a>
          <a
            href="#"
            className="text-brown text-[0.9rem] font-medium hover:text-brown-dark transition-colors no-underline relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-terracotta after:transition-all hover:after:w-full"
          >
            FAQ
          </a>
          <Link
            to="/academies"
            className="bg-terracotta text-white! px-5 py-2 rounded-lg font-semibold text-[0.85rem] hover:bg-terracotta-hover hover:-translate-y-0.5 transition-all no-underline"
          >
            무료 견적 받기
          </Link>
        </div>
        <button className="md:hidden p-1" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {mobileOpen ? (
              <path d="M6 6l12 12M6 18L18 6" />
            ) : (
              <>
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-cream border-t border-beige-dark px-6 py-4 space-y-3">
          <Link to="/academies" className="block text-brown-dark font-medium py-2 no-underline" onClick={() => setMobileOpen(false)}>
            어학원 비교
          </Link>
          <a href="/#cost" className="block text-brown font-medium py-2 no-underline" onClick={() => setMobileOpen(false)}>
            비용 가이드
          </a>
          <a href="/#reviews" className="block text-brown font-medium py-2 no-underline" onClick={() => setMobileOpen(false)}>
            후기
          </a>
          <a href="#" className="block text-brown font-medium py-2 no-underline" onClick={() => setMobileOpen(false)}>
            FAQ
          </a>
          <Link
            to="/academies"
            className="block w-full text-center bg-terracotta text-white py-3 rounded-lg font-semibold no-underline"
            onClick={() => setMobileOpen(false)}
          >
            무료 견적 받기
          </Link>
        </div>
      )}
    </nav>
  );
}
