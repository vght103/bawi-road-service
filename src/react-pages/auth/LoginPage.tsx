import { useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import LoadingOverlay from "@/components/LoadingOverlay";
import { createIsland } from "@/lib/createIsland";

// 로그인 페이지 — 이메일/비밀번호 로그인, 성공 시 ?from 경로 또는 홈으로 이동
function LoginPage() {
  const { signIn } = useAuth();

  // ?from 파라미터가 있으면 해당 경로로, 없으면 홈("/")으로 이동
  const from = new URLSearchParams(window.location.search).get("from") || "/";

  // 폼 입력 상태
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // 비밀번호 표시/숨김
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // 로그인 폼 제출 — 빈 입력 검사 → Supabase Auth → 에러 한국어 변환 → 이동
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password) {
      setError("이메일과 비밀번호를 입력해주세요.");
      return;
    }

    setSubmitting(true);
    const { error: authError } = await signIn(email, password);
    setSubmitting(false);

    if (authError) {
      // Supabase Auth 에러 코드 → 한국어 메시지 변환
      if (authError.includes("Invalid login credentials")) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (authError.includes("Email not confirmed")) {
        setError("이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.");
      } else {
        setError(authError);
      }
      return;
    }

    window.location.href = from;
  }

  return (
    <div className="min-h-dvh bg-cream">
      <LoadingOverlay visible={submitting} />
      <div className="flex items-center justify-center px-4 py-12 pt-22">
        <div className="flex w-full max-w-[1000px] overflow-hidden rounded-2xl bg-white shadow-lg border border-beige-dark">
          {/* 왼쪽: 로그인 폼 */}
          <div className="flex w-full lg:w-1/2 items-center justify-center px-6 sm:px-10 py-12">
            <div className="w-full max-w-sm">
              <div className="mb-8">
                <a href="/" className="mb-6 inline-block text-sm text-brown hover:text-terracotta">
                  ← 홈으로
                </a>
                <h1 className="text-2xl font-bold text-brown-text">로그인</h1>
                <p className="mt-1 text-sm text-brown">바위로드 계정으로 로그인하세요</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                {/* 이메일 */}
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-brown-text font-medium">
                    이메일
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                {/* 비밀번호 (표시/숨김 토글 포함) */}
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-brown-text font-medium">
                    비밀번호
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="비밀번호를 입력해주세요"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/50 hover:text-brown"
                    >
                      {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-terracotta hover:bg-terracotta-hover text-white py-6 text-base font-semibold"
                >
                  {submitting ? "로그인 중..." : "로그인"}
                </Button>
              </form>

              {/* 계정 찾기 / 회원가입 링크 */}
              <div className="mt-6 text-center text-sm text-brown space-y-2">
                <p>
                  <a href="/find-account" className="text-brown hover:text-terracotta hover:underline">
                    이메일 찾기
                  </a>
                  <span className="mx-2 text-beige-dark">|</span>
                  <a href="/find-account?tab=find-password" className="text-brown hover:text-terracotta hover:underline">
                    비밀번호 찾기
                  </a>
                </p>
                <p>
                  계정이 없으신가요?{" "}
                  <a href="/signup" className="font-medium text-terracotta hover:underline">
                    회원가입
                  </a>
                </p>
              </div>
            </div>
          </div>

          {/* 오른쪽: 마스코트 일러스트 (데스크탑 전용) */}
          <div className="hidden lg:flex w-1/2 items-center justify-center bg-beige">
            <div className="text-center px-8">
              <div className="mb-6">
                <img src="/bawi.webp" alt="바위로드 캐릭터" className="mx-auto w-52 object-contain" />
              </div>
              <h2 className="text-xl font-bold text-brown-text mb-2">다 보여주는 유학원</h2>
              <p className="text-brown text-sm leading-relaxed">
                투명한 가격, 솔직한 비교
                <br />
                바위로드와 함께 필리핀 어학연수를 준비하세요
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default createIsland(LoginPage);
