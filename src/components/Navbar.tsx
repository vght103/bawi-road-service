import { Link } from "react-router-dom";
import { useEffect, useState, useRef } from "react";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [mobileGuideOpen, setMobileGuideOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const linkClass =
    "text-brown text-[0.9rem] font-medium hover:text-brown-dark transition-colors no-underline relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-terracotta after:transition-all hover:after:w-full";

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 bg-cream/85 backdrop-blur-[16px] border-b border-beige-dark transition-shadow ${scrolled ? "shadow-md" : ""}`}
    >
      <div className="max-w-[1200px] mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 no-underline text-brown-dark">
          <div>
            <div className="font-extrabold text-[1.2rem] tracking-tight leading-tight">바위로드</div>
            <div className="text-[0.65rem] text-brown font-medium tracking-wider">BAWI ROAD</div>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-7">
          <Link to="/academies" className={linkClass}>
            어학원 비교
          </Link>

          {/* 연수 가이드 Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => {
              clearTimeout(timeoutRef.current);
              setGuideOpen(true);
            }}
            onMouseLeave={() => {
              timeoutRef.current = setTimeout(() => setGuideOpen(false), 150);
            }}
          >
            <button
              className="text-brown text-[0.9rem] font-medium hover:text-brown-dark transition-colors cursor-pointer bg-transparent border-none p-0 flex items-center gap-1 relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-[2px] after:bg-terracotta after:transition-all hover:after:w-full"
            >
              연수 가이드
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform ${guideOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {guideOpen && (
              <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3">
                <div className="bg-white rounded-xl shadow-lg border border-beige-dark py-2 min-w-[180px]">
                  <Link
                    to="/why-philippines"
                    className="block px-5 py-2.5 text-[0.85rem] text-brown hover:bg-beige hover:text-brown-dark transition-colors no-underline"
                    onClick={() => setGuideOpen(false)}
                  >
                    왜 필리핀?
                  </Link>
                  <Link
                    to="/process"
                    className="block px-5 py-2.5 text-[0.85rem] text-brown hover:bg-beige hover:text-brown-dark transition-colors no-underline"
                    onClick={() => setGuideOpen(false)}
                  >
                    연수 절차 · 준비물
                  </Link>
                  <Link
                    to="/visa-info"
                    className="block px-5 py-2.5 text-[0.85rem] text-brown hover:bg-beige hover:text-brown-dark transition-colors no-underline"
                    onClick={() => setGuideOpen(false)}
                  >
                    비자 · 현지비용
                  </Link>
                </div>
              </div>
            )}
          </div>

          <a
            href="/#cost"
            className={linkClass}
          >
            비용 가이드
          </a>
          <a
            href="/#reviews"
            className={linkClass}
          >
            후기
          </a>
          <Link
            to="/quote"
            className="bg-terracotta text-white! px-5 py-2 rounded-lg font-semibold text-[0.85rem] hover:bg-terracotta-hover hover:-translate-y-0.5 transition-all no-underline"
          >
            무료 견적 받기
          </Link>
        </div>

        {/* Mobile Toggle */}
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
        <div className="md:hidden bg-cream border-t border-beige-dark px-6 py-4 space-y-1">
          <Link
            to="/academies"
            className="block text-brown-dark font-medium py-2 no-underline"
            onClick={() => setMobileOpen(false)}
          >
            어학원 비교
          </Link>

          {/* Mobile 연수 가이드 Accordion */}
          <div>
            <button
              className="w-full flex items-center justify-between text-brown-dark font-medium py-2 bg-transparent border-none cursor-pointer text-left text-base"
              onClick={() => setMobileGuideOpen(!mobileGuideOpen)}
            >
              연수 가이드
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                className={`transition-transform ${mobileGuideOpen ? "rotate-180" : ""}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            {mobileGuideOpen && (
              <div className="pl-4 space-y-0.5 pb-1">
                <Link
                  to="/why-philippines"
                  className="block text-brown py-2 text-[0.9rem] no-underline hover:text-brown-dark"
                  onClick={() => {
                    setMobileOpen(false);
                    setMobileGuideOpen(false);
                  }}
                >
                  왜 필리핀?
                </Link>
                <Link
                  to="/process"
                  className="block text-brown py-2 text-[0.9rem] no-underline hover:text-brown-dark"
                  onClick={() => {
                    setMobileOpen(false);
                    setMobileGuideOpen(false);
                  }}
                >
                  연수 절차 · 준비물
                </Link>
                <Link
                  to="/visa-info"
                  className="block text-brown py-2 text-[0.9rem] no-underline hover:text-brown-dark"
                  onClick={() => {
                    setMobileOpen(false);
                    setMobileGuideOpen(false);
                  }}
                >
                  비자 · 현지비용
                </Link>
              </div>
            )}
          </div>

          <a
            href="/#cost"
            className="block text-brown font-medium py-2 no-underline"
            onClick={() => setMobileOpen(false)}
          >
            비용 가이드
          </a>
          <a
            href="/#reviews"
            className="block text-brown font-medium py-2 no-underline"
            onClick={() => setMobileOpen(false)}
          >
            후기
          </a>
          <Link
            to="/quote"
            className="block w-full text-center bg-terracotta text-white py-3 rounded-lg font-semibold no-underline mt-2"
            onClick={() => setMobileOpen(false)}
          >
            무료 견적 받기
          </Link>
        </div>
      )}
    </nav>
  );
}
