import { useState } from "react";
import { Link } from "react-router-dom";
import { EyeIcon, EyeOffIcon, CheckCircleIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/hooks/useAuth";
import LoadingOverlay from "@/components/LoadingOverlay";

/* ─── 비밀번호 강도 체크 항목 ─── */

const PASSWORD_CHECKS = [
  { label: "8자 이상", test: (pw: string) => pw.length >= 8 },
  { label: "숫자 포함", test: (pw: string) => /\d/.test(pw) },
  {
    label: "특수기호 포함",
    test: (pw: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw),
  },
] as const;

/* ─── 비밀번호 변경 완료 화면 ─── */

function ResetPasswordSuccess() {
  return (
    <div className="min-h-dvh bg-cream">
      <Navbar />
      <div className="flex items-center justify-center px-4 pt-22">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-green-light">
            <CheckCircleIcon className="h-8 w-8 text-accent-green" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-brown-text">비밀번호 변경 완료!</h1>
          <p className="mb-6 text-brown">새로운 비밀번호로 로그인해주세요.</p>
          <Button asChild className="bg-terracotta hover:bg-terracotta-hover text-white">
            <Link to="/login">로그인 페이지로 이동</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

/* ─── 비밀번호 입력 + 표시/숨김 토글 ─── */

function PasswordInput({
  value,
  show,
  onToggle,
  ...props
}: React.ComponentProps<typeof Input> & {
  show: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="relative">
      <Input type={show ? "text" : "password"} value={value} className="pr-10" {...props} />
      <button
        type="button"
        onClick={onToggle}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/50 hover:text-brown"
      >
        {show ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
      </button>
    </div>
  );
}

/* ─── 비밀번호 재설정 페이지 ─── */

export default function ResetPasswordPage() {
  const { changePassword } = useAuth();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const allChecksPass = PASSWORD_CHECKS.every((check) => check.test(newPassword));
  const passwordMatch = confirmPassword.length > 0 && newPassword === confirmPassword;

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError("");

    if (!allChecksPass) {
      setError("비밀번호는 8자 이상, 숫자와 특수기호를 포함해야 합니다.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    setSubmitting(true);
    const { error: authError } = await changePassword(newPassword);
    setSubmitting(false);

    if (authError) {
      setError(authError);
      return;
    }

    setSuccess(true);
  }

  if (success) return <ResetPasswordSuccess />;

  return (
    <div className="min-h-dvh bg-cream">
      <LoadingOverlay visible={submitting} />
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12 pt-22">
        <div className="flex w-full max-w-[1000px] overflow-hidden rounded-2xl bg-white shadow-lg border border-beige-dark">
          {/* ─── 왼쪽: 비밀번호 재설정 폼 ─── */}
          <div className="flex w-full lg:w-1/2 items-center justify-center px-6 sm:px-10 py-12">
            <div className="w-full max-w-sm">
              {/* 헤더 */}
              <div className="mb-8">
                <Link to="/login" className="mb-6 inline-block text-sm text-brown hover:text-terracotta">
                  ← 로그인으로
                </Link>
                <h1 className="text-2xl font-bold text-brown-text">비밀번호 재설정</h1>
                <p className="mt-1 text-sm text-brown">새로운 비밀번호를 입력해주세요</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {error && <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>}

                {/* 새 비밀번호 */}
                <div className="space-y-1.5">
                  <Label htmlFor="new-password" className="text-brown-text font-medium">
                    새 비밀번호
                  </Label>
                  <PasswordInput
                    id="new-password"
                    placeholder="8자 이상, 숫자, 특수기호 포함"
                    value={newPassword}
                    onChange={(event) => setNewPassword(event.target.value)}
                    show={showNewPassword}
                    onToggle={() => setShowNewPassword((prev) => !prev)}
                  />
                  {/* 비밀번호 강도 체크 표시 */}
                  {newPassword && (
                    <div className="flex gap-3">
                      {PASSWORD_CHECKS.map((check) => (
                        <span
                          key={check.label}
                          className={`text-xs ${check.test(newPassword) ? "text-accent-green" : "text-brown/40"}`}
                        >
                          {check.test(newPassword) ? "✓" : "○"} {check.label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* 새 비밀번호 확인 */}
                <div className="space-y-1.5">
                  <Label htmlFor="confirm-password" className="text-brown-text font-medium">
                    새 비밀번호 확인
                  </Label>
                  <PasswordInput
                    id="confirm-password"
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={confirmPassword}
                    onChange={(event) => setConfirmPassword(event.target.value)}
                    show={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword((prev) => !prev)}
                  />
                  {/* 비밀번호 일치 여부 표시 */}
                  {confirmPassword && (
                    <p className={`text-xs ${passwordMatch ? "text-accent-green" : "text-red-500"}`}>
                      {passwordMatch ? "✓ 비밀번호가 일치합니다" : "비밀번호가 일치하지 않습니다"}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-terracotta hover:bg-terracotta-hover text-white py-6 text-base font-semibold"
                >
                  {submitting ? "변경 중..." : "비밀번호 변경"}
                </Button>
              </form>

              {/* 로그인 링크 */}
              <p className="mt-6 text-center text-sm text-brown">
                <Link to="/login" className="font-medium text-terracotta hover:underline">
                  ← 로그인으로 돌아가기
                </Link>
              </p>
            </div>
          </div>

          {/* ─── 오른쪽: 마스코트 일러스트 (데스크탑 전용) ─── */}
          <div className="hidden lg:flex w-1/2 items-center justify-center bg-beige">
            <div className="text-center px-8">
              <div className="mb-6">
                <img src="/bawi.png" alt="바위로드 캐릭터" className="mx-auto w-52 object-contain" />
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
