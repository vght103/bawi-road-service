import { useState } from "react";
import { Button } from "@/components/ui/button";
import { createIsland } from "@/lib/createIsland";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import LoadingOverlay from "@/components/LoadingOverlay";

type ActiveTab = "find-email" | "find-password"; // 활성 탭 타입

// ?tab=find-password이면 비밀번호 찾기 탭으로, 그 외에는 이메일 찾기 탭으로 초기화
function getInitialTab(searchParams: URLSearchParams): ActiveTab {
  const tab = searchParams.get("tab");
  return tab === "find-password" ? "find-password" : "find-email";
}

// 계정 찾기 페이지 — 이메일 찾기(이름+핸드폰) / 비밀번호 찾기(이름+이메일) 탭 구분
function FindAccountPage() {
  const { findEmail, sendPasswordResetEmail } = useAuth();

  const [activeTab, setActiveTab] = useState<ActiveTab>(() => getInitialTab(new URLSearchParams(window.location.search)));

  // 이메일 찾기 상태
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [findEmailSubmitting, setFindEmailSubmitting] = useState(false);
  const [findEmailResult, setFindEmailResult] = useState<{ maskedEmail: string | null; error: string | null } | null>(null); // maskedEmail: null이면 못 찾은 것

  // 비밀번호 찾기 상태
  const [resetName, setResetName] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [resetSubmitting, setResetSubmitting] = useState(false);
  const [resetResult, setResetResult] = useState<{ success: boolean; error: string | null } | null>(null);

  // 탭 전환 시 이전 결과/에러 초기화
  function handleTabChange(tab: ActiveTab) {
    setActiveTab(tab);
    setFindEmailResult(null);
    setResetResult(null);
  }

  // 숫자와 하이픈만 허용
  function handlePhoneChange(value: string) {
    const filtered = value.replace(/[^\d-]/g, "");
    setPhone(filtered);
  }

  // 이메일 찾기 — 이름 + 핸드폰 번호로 조회
  async function handleFindEmail(e: React.FormEvent) {
    e.preventDefault();
    setFindEmailResult(null);

    if (!name.trim()) {
      setFindEmailResult({ maskedEmail: null, error: "이름을 입력해주세요." });
      return;
    }
    if (!phone.trim()) {
      setFindEmailResult({ maskedEmail: null, error: "핸드폰 번호를 입력해주세요." });
      return;
    }

    setFindEmailSubmitting(true);
    const result = await findEmail(name.trim(), phone.trim());
    setFindEmailSubmitting(false);
    setFindEmailResult(result);
  }

  // 비밀번호 재설정 이메일 발송 — 이름 + 이메일로 재설정 링크 전송
  async function handleSendPasswordReset(e: React.FormEvent) {
    e.preventDefault();
    setResetResult(null);

    if (!resetName.trim()) {
      setResetResult({ success: false, error: "이름을 입력해주세요." });
      return;
    }
    if (!resetEmail.trim()) {
      setResetResult({ success: false, error: "이메일을 입력해주세요." });
      return;
    }

    setResetSubmitting(true);
    const { error } = await sendPasswordResetEmail(resetName.trim(), resetEmail.trim());
    setResetSubmitting(false);

    if (error) {
      setResetResult({ success: false, error });
    } else {
      setResetResult({ success: true, error: null });
    }
  }

  // 활성 탭에 따라 하단 선(border-b)과 강조 색상 적용
  const tabButtonClass = (tab: ActiveTab) =>
    activeTab === tab
      ? "border-b-2 border-terracotta text-terracotta font-semibold pb-2 text-sm transition-colors"
      : "text-brown hover:text-brown-text pb-2 text-sm transition-colors";

  return (
    <div className="min-h-dvh bg-cream">
      <LoadingOverlay visible={findEmailSubmitting || resetSubmitting} />
      <div className="flex items-center justify-center px-4 py-12 pt-22">
        <div className="flex w-full max-w-[1000px] overflow-hidden rounded-2xl bg-white shadow-lg border border-beige-dark">
          {/* 왼쪽: 계정 찾기 폼 */}
          <div className="flex w-full lg:w-1/2 items-center justify-center px-6 sm:px-10 py-12">
            <div className="w-full max-w-sm">
              <div className="mb-8">
                <a href="/login" className="mb-6 inline-block text-sm text-brown hover:text-terracotta">
                  ← 로그인으로
                </a>
                <h1 className="text-2xl font-bold text-brown-text">계정 찾기</h1>
                <p className="mt-1 text-sm text-brown">이메일 또는 비밀번호를 찾으세요</p>
              </div>

              {/* 탭 버튼 */}
              <div className="flex gap-6 border-b border-beige-dark mb-6">
                <button
                  type="button"
                  className={tabButtonClass("find-email")}
                  onClick={() => handleTabChange("find-email")}
                >
                  이메일 찾기
                </button>
                <button
                  type="button"
                  className={tabButtonClass("find-password")}
                  onClick={() => handleTabChange("find-password")}
                >
                  비밀번호 찾기
                </button>
              </div>

              {/* 이메일 찾기 탭 */}
              {activeTab === "find-email" && (
                <form onSubmit={handleFindEmail} className="space-y-5">
                  {findEmailResult?.error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {findEmailResult.error}
                    </div>
                  )}
                  {/* 성공: 마스킹된 이메일 표시 */}
                  {findEmailResult?.maskedEmail && (
                    <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700 space-y-2">
                      <p className="font-medium">이메일을 찾았습니다.</p>
                      <p className="text-green-800 font-semibold text-base">{findEmailResult.maskedEmail}</p>
                      <a href="/login" className="inline-block text-terracotta font-medium hover:underline">
                        로그인하러 가기 →
                      </a>
                    </div>
                  )}

                  {/* 이름 */}
                  <div className="space-y-1.5">
                    <Label htmlFor="name" className="text-brown-text font-medium">
                      이름
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="홍길동"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                    />
                  </div>

                  {/* 핸드폰 번호 — 숫자와 하이픈만 허용 */}
                  <div className="space-y-1.5">
                    <Label htmlFor="phone" className="text-brown-text font-medium">
                      핸드폰 번호
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="01012345678"
                      value={phone}
                      onChange={(event) => handlePhoneChange(event.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={findEmailSubmitting}
                    className="w-full bg-terracotta hover:bg-terracotta-hover text-white py-6 text-base font-semibold"
                  >
                    {findEmailSubmitting ? "찾는 중..." : "이메일 찾기"}
                  </Button>
                </form>
              )}

              {/* 비밀번호 찾기 탭 */}
              {activeTab === "find-password" && (
                <form onSubmit={handleSendPasswordReset} className="space-y-5">
                  {resetResult?.error && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {resetResult.error}
                    </div>
                  )}
                  {/* 성공: 이메일 발송 안내 */}
                  {resetResult?.success && (
                    <div className="rounded-lg bg-green-50 p-4 text-sm text-green-700">
                      비밀번호 재설정 링크가 이메일로 발송되었습니다.
                    </div>
                  )}

                  {/* 이름 */}
                  <div className="space-y-1.5">
                    <Label htmlFor="reset-name" className="text-brown-text font-medium">
                      이름
                    </Label>
                    <Input
                      id="reset-name"
                      type="text"
                      placeholder="홍길동"
                      value={resetName}
                      onChange={(event) => setResetName(event.target.value)}
                    />
                  </div>

                  {/* 이메일 (재설정 링크 수신용) */}
                  <div className="space-y-1.5">
                    <Label htmlFor="reset-email" className="text-brown-text font-medium">
                      이메일
                    </Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="email@example.com"
                      value={resetEmail}
                      onChange={(event) => setResetEmail(event.target.value)}
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={resetSubmitting}
                    className="w-full bg-terracotta hover:bg-terracotta-hover text-white py-6 text-base font-semibold"
                  >
                    {resetSubmitting ? "발송 중..." : "비밀번호 재설정 링크 발송"}
                  </Button>
                </form>
              )}

              <p className="mt-6 text-center text-sm text-brown">
                계정이 없으신가요?{" "}
                <a href="/signup" className="font-medium text-terracotta hover:underline">
                  회원가입
                </a>
              </p>
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

export default createIsland(FindAccountPage);
