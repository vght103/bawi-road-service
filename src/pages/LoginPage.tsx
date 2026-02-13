import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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
      if (authError.includes("Invalid login credentials")) {
        setError("이메일 또는 비밀번호가 올바르지 않습니다.");
      } else if (authError.includes("Email not confirmed")) {
        setError("이메일 인증이 완료되지 않았습니다. 이메일을 확인해주세요.");
      } else {
        setError(authError);
      }
      return;
    }

    navigate("/my");
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-cream px-4 py-12">
      <div className="flex w-full max-w-[1000px] overflow-hidden rounded-2xl bg-white shadow-lg border border-beige-dark">
      {/* Left: Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center px-6 sm:px-10 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8">
            <Link
              to="/"
              className="mb-6 inline-block text-sm text-brown hover:text-terracotta"
            >
              ← 홈으로
            </Link>
            <h1 className="text-2xl font-bold text-brown-text">로그인</h1>
            <p className="mt-1 text-sm text-brown">
              바위로드 계정으로 로그인하세요
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

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

            {/* 비밀번호 */}
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
                  {showPassword ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
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

          <p className="mt-6 text-center text-sm text-brown">
            계정이 없으신가요?{" "}
            <Link
              to="/signup"
              className="font-medium text-terracotta hover:underline"
            >
              회원가입
            </Link>
          </p>
        </div>
      </div>

      {/* Right: Mascot illustration */}
      <div className="hidden lg:flex w-1/2 items-center justify-center bg-beige">
        <div className="text-center px-8">
          <div className="mb-6">
            <img
              src="/bawi.png"
              alt="바위로드 캐릭터"
              className="mx-auto w-52 object-contain"
            />
          </div>
          <h2 className="text-xl font-bold text-brown-text mb-2">
            다 보여주는 유학원
          </h2>
          <p className="text-brown text-sm leading-relaxed">
            투명한 가격, 솔직한 비교
            <br />
            바위로드와 함께 필리핀 어학연수를 준비하세요
          </p>
        </div>
      </div>
      </div>
    </div>
  );
}
