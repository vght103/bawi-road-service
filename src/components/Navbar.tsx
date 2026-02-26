import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { ChevronDown, Menu, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useMember } from "@/hooks/useMember";

export default function Navbar() {
  const { user, signOut } = useAuth();
  const { member } = useMember();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [guideOpen, setGuideOpen] = useState(false);
  const [mobileGuideOpen, setMobileGuideOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const userMenuRef = useRef<ReturnType<typeof setTimeout>>(undefined);

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
        <Link to="/" className="flex items-center gap-2.5 no-underline text-brown-dark" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
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
              <ChevronDown size={12} strokeWidth={2.5} className={`transition-transform ${guideOpen ? "rotate-180" : ""}`} />
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
          <Link to="/enrollment/apply" className={linkClass}>
            수속 신청
          </Link>
          <Link
            to="/quote"
            className="bg-terracotta text-white! px-5 py-2 rounded-lg font-semibold text-[0.85rem] hover:bg-terracotta-hover hover:-translate-y-0.5 transition-all no-underline"
          >
            무료 견적 받기
          </Link>

          {/* Auth */}
          {user ? (
            <div
              className="relative"
              onMouseEnter={() => {
                clearTimeout(userMenuRef.current);
                setUserMenuOpen(true);
              }}
              onMouseLeave={() => {
                userMenuRef.current = setTimeout(() => setUserMenuOpen(false), 150);
              }}
            >
              <button className="flex items-center gap-2 text-brown text-[0.85rem] font-medium hover:text-brown-dark transition-colors bg-transparent border-none cursor-pointer p-0">
                <div className="w-8 h-8 rounded-full bg-beige-dark flex items-center justify-center text-brown-dark text-sm font-bold">
                  {(member?.name ?? user.email)?.[0]?.toUpperCase()}
                </div>
              </button>
              {userMenuOpen && (
                <div className="absolute top-full right-0 pt-3">
                  <div className="bg-white rounded-xl shadow-lg border border-beige-dark py-2 min-w-[160px]">
                    <div className="px-4 py-2 border-b border-beige text-xs text-brown">
                      {member?.name ?? user.email}
                    </div>
                    <Link
                      to="/my"
                      className="block px-4 py-2.5 text-[0.85rem] text-brown hover:bg-beige hover:text-brown-dark transition-colors no-underline"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      마이페이지
                    </Link>
                    <button
                      onClick={async () => {
                        await signOut();
                        setUserMenuOpen(false);
                        navigate("/");
                      }}
                      className="w-full text-left px-4 py-2.5 text-[0.85rem] text-brown hover:bg-beige hover:text-brown-dark transition-colors bg-transparent border-none cursor-pointer"
                    >
                      로그아웃
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              state={{ from: location.pathname }}
              className="text-brown text-[0.85rem] font-medium hover:text-brown-dark transition-colors no-underline"
            >
              로그인
            </Link>
          )}
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden p-1" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-beige-dark px-6 py-4 space-y-1 shadow-[0_8px_24px_rgba(0,0,0,0.12)] rounded-b-2xl">
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
              <ChevronDown size={14} strokeWidth={2.5} className={`transition-transform ${mobileGuideOpen ? "rotate-180" : ""}`} />
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
            to="/enrollment/apply"
            className="block text-brown font-medium py-2 no-underline"
            onClick={() => setMobileOpen(false)}
          >
            수속 신청
          </Link>

          {/* Mobile Auth */}
          {user ? (
            <div className="border-t border-beige-dark mt-3 pt-3 space-y-1">
              <div className="text-xs text-brown px-1 pb-1">
                {member?.name ?? user.email}
              </div>
              <Link
                to="/my"
                className="block text-brown font-medium py-2 no-underline"
                onClick={() => setMobileOpen(false)}
              >
                마이페이지
              </Link>
              <button
                onClick={async () => {
                  await signOut();
                  setMobileOpen(false);
                  navigate("/");
                }}
                className="w-full text-left text-brown font-medium py-2 bg-transparent border-none cursor-pointer text-base"
              >
                로그아웃
              </button>
            </div>
          ) : (
            <div className="border-t border-beige-dark mt-3 pt-3 flex gap-3">
              <Link
                to="/login"
                state={{ from: location.pathname }}
                className="flex-1 text-center text-brown-dark font-medium py-2.5 rounded-lg border border-beige-dark no-underline"
                onClick={() => setMobileOpen(false)}
              >
                로그인
              </Link>
              <Link
                to="/signup"
                className="flex-1 text-center text-brown-dark font-medium py-2.5 rounded-lg bg-beige no-underline"
                onClick={() => setMobileOpen(false)}
              >
                회원가입
              </Link>
            </div>
          )}

          {/* CTA */}
          <Link
            to="/quote"
            className="block w-full text-center bg-terracotta text-white py-3 rounded-lg font-semibold no-underline mt-3"
            onClick={() => setMobileOpen(false)}
          >
            무료 견적 받기
          </Link>
        </div>
      )}
    </nav>
  );
}
