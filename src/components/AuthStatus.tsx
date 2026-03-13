import { useStore } from "@nanostores/react";
import { $user, $loading, $member, signOut } from "@/stores/authStore";

interface AuthStatusProps {
  pathname: string; // 로그인 후 리다이렉트할 현재 경로
  mobile?: boolean; // true이면 모바일 메뉴 레이아웃
}

// 로그인 상태에 따라 Navbar UI 결정 (로딩 중 / 로그인 / 비로그인)
export default function AuthStatus({ pathname, mobile }: AuthStatusProps) {
  const user = useStore($user);
  const loading = useStore($loading);
  const member = useStore($member); // members 테이블 레코드 (이름 등)

  // 로딩 중에는 렌더링하지 않음 (깜빡임 방지)
  if (loading) return null;

  // ── 모바일 메뉴 레이아웃 ─────────────────────────────────────────
  if (mobile) {
    if (user) {
      return (
        <div className="border-t border-beige-dark mt-3 pt-3 space-y-1">
          {/* 이름 우선, 없으면 이메일 */}
          <div className="text-xs text-brown px-1 pb-1">
            {member?.name ?? user.email}
          </div>
          <a href="/my" className="block text-brown font-medium py-2 no-underline">
            마이페이지
          </a>
          <button
            onClick={async () => {
              await signOut();
              // 로그아웃 후 홈으로 이동
              window.location.href = "/";
            }}
            className="w-full text-left text-brown font-medium py-2 bg-transparent border-none cursor-pointer text-base"
          >
            로그아웃
          </button>
        </div>
      );
    }

    // 모바일 비로그인
    return (
      <div className="border-t border-beige-dark mt-3 pt-3 flex gap-3">
        <a
          href={`/login?from=${encodeURIComponent(pathname)}`}
          className="flex-1 text-center text-brown-dark font-medium py-2.5 rounded-lg border border-beige-dark no-underline"
        >
          로그인
        </a>
        <a
          href="/signup"
          className="flex-1 text-center text-brown-dark font-medium py-2.5 rounded-lg bg-beige no-underline"
        >
          회원가입
        </a>
      </div>
    );
  }

  // ── 데스크톱 Navbar 레이아웃 ────────────────────────────────────
  if (user) {
    return (
      <div className="relative group"> {/* group: hover 시 드롭다운 표시 */}
        {/* 아바타 버튼 — 이름/이메일 첫 글자 표시 */}
        <button className="flex items-center gap-2 text-cream/80 text-[0.85rem] font-medium hover:text-white transition-colors bg-transparent border-none cursor-pointer p-0">
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-cream text-sm font-bold">
            {(member?.name ?? user.email)?.[0]?.toUpperCase()}
          </div>
        </button>
        {/* 호버 드롭다운 메뉴 */}
        <div className="absolute top-full right-0 pt-3 hidden group-hover:block">
          <div className="bg-white rounded-xl shadow-lg border border-beige-dark py-2 min-w-[160px]">
            {/* 이름 또는 이메일 */}
            <div className="px-4 py-2 border-b border-beige text-xs text-brown">
              {member?.name ?? user.email}
            </div>
            <a
              href="/my"
              className="block px-4 py-2.5 text-[0.85rem] text-brown hover:bg-beige hover:text-brown-dark transition-colors no-underline"
            >
              마이페이지
            </a>
            <button
              onClick={async () => {
                await signOut();
                // 로그아웃 후 홈으로 이동
                window.location.href = "/";
              }}
              className="w-full text-left px-4 py-2.5 text-[0.85rem] text-brown hover:bg-beige hover:text-brown-dark transition-colors bg-transparent border-none cursor-pointer"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 데스크톱 비로그인
  return (
    <a
      href={`/login?from=${encodeURIComponent(pathname)}`}
      className="text-white text-[0.85rem] font-semibold bg-white/15 hover:bg-white/25 px-4 py-1.5 rounded-md transition-all no-underline"
    >
      로그인
    </a>
  );
}
