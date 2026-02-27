import { Link } from "react-router-dom";

export default function Footer() {
  const linkClass =
    "block text-brown-light no-underline text-[0.85rem] mb-2.5 hover:text-cream transition-colors";

  return (
    <footer className="bg-brown-dark text-brown-light pt-[60px] pb-10 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="font-extrabold text-[1.2rem] text-cream mb-3">바위로드</div>
          <p className="text-[0.82rem] leading-[1.7]">
            다 보여주는 필리핀 어학연수 유학원.
            <br />
            가격 공개, 솔직 비교, 수수료 제로.
          </p>
        </div>
        <div>
          <h4 className="text-[0.8rem] font-bold text-cream mb-4 uppercase tracking-wider">서비스</h4>
          <Link to="/academies" className={linkClass}>어학원 비교</Link>
          <a href="/#cost" className={linkClass}>비용 가이드</a>
          <Link to="/quote?from=footer" className={linkClass}>무료 견적</Link>
        </div>
        <div>
          <h4 className="text-[0.8rem] font-bold text-cream mb-4 uppercase tracking-wider">약관 및 정책</h4>
          <Link to="/terms" className={linkClass}>이용약관</Link>
          <Link to="/privacy" className={linkClass}>개인정보처리방침</Link>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-white/10 text-center text-[0.75rem] text-brown">
        &copy; 2026 바위로드 (Bawi Road). All rights reserved.
      </div>
    </footer>
  );
}
