import { Link } from "react-router-dom";
import BawiLogo from "./BawiLogo";

export default function Footer() {
  return (
    <footer className="bg-brown-dark text-brown-light pt-[60px] pb-10 px-6">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-10">
        <div className="col-span-2 md:col-span-1">
          <div className="font-extrabold text-[1.2rem] text-cream mb-3 flex items-center gap-2">
            <BawiLogo size={22} />
            바위로드
          </div>
          <p className="text-[0.82rem] leading-[1.7]">
            다 보여주는 필리핀 어학연수 유학원.
            <br />
            가격 공개, 솔직 비교, 수수료 제로.
          </p>
        </div>
        <div>
          <h4 className="text-[0.8rem] font-bold text-cream mb-4 uppercase tracking-wider">서비스</h4>
          <Link to="/academies" className="block text-brown-light no-underline text-[0.85rem] mb-2.5 hover:text-cream transition-colors">
            어학원 비교
          </Link>
          <a href="/#cost" className="block text-brown-light no-underline text-[0.85rem] mb-2.5 hover:text-cream transition-colors">
            비용 가이드
          </a>
          <a href="#" className="block text-brown-light no-underline text-[0.85rem] mb-2.5 hover:text-cream transition-colors">
            무료 견적
          </a>
          <a href="#" className="block text-brown-light no-underline text-[0.85rem] mb-2.5 hover:text-cream transition-colors">
            수속 신청
          </a>
        </div>
        <div>
          <h4 className="text-[0.8rem] font-bold text-cream mb-4 uppercase tracking-wider">정보</h4>
          <a href="#" className="block text-brown-light no-underline text-[0.85rem] mb-2.5 hover:text-cream transition-colors">
            FAQ
          </a>
          <a href="#" className="block text-brown-light no-underline text-[0.85rem] mb-2.5 hover:text-cream transition-colors">
            블로그
          </a>
          <a href="/#reviews" className="block text-brown-light no-underline text-[0.85rem] mb-2.5 hover:text-cream transition-colors">
            학생 후기
          </a>
          <a href="#" className="block text-brown-light no-underline text-[0.85rem] mb-2.5 hover:text-cream transition-colors">
            이용약관
          </a>
        </div>
        <div>
          <h4 className="text-[0.8rem] font-bold text-cream mb-4 uppercase tracking-wider">문의</h4>
          <a href="#" className="block text-brown-light no-underline text-[0.85rem] mb-2.5 hover:text-cream transition-colors">
            카카오톡 상담
          </a>
          <a href="#" className="block text-brown-light no-underline text-[0.85rem] mb-2.5 hover:text-cream transition-colors">
            이메일 문의
          </a>
          <a href="#" className="block text-brown-light no-underline text-[0.85rem] mb-2.5 hover:text-cream transition-colors">
            인스타그램
          </a>
        </div>
      </div>
      <div className="mt-10 pt-6 border-t border-white/10 text-center text-[0.75rem] text-brown">
        &copy; 2026 바위로드 (Bawi Road). All rights reserved.
      </div>
    </footer>
  );
}
