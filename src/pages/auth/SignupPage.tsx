import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, CheckCircleIcon } from "lucide-react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";

function validatePassword(pw: string) {
  const errors: string[] = [];
  if (pw.length < 8) errors.push("8자 이상");
  if (!/\d/.test(pw)) errors.push("숫자 포함");
  if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw))
    errors.push("특수기호 포함");
  return errors;
}

function validatePhone(phone: string) {
  return /^01[016789]\d{7,8}$/.test(phone.replace(/-/g, ""));
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export default function SignupPage() {
  const navigate = useNavigate();
  const { signUp } = useAuth();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate() {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = "이름을 입력해주세요.";
    if (!phone.trim()) e.phone = "핸드폰 번호를 입력해주세요.";
    else if (!validatePhone(phone))
      e.phone = "올바른 핸드폰 번호를 입력해주세요.";
    if (!email.trim()) e.email = "이메일을 입력해주세요.";
    else if (!validateEmail(email))
      e.email = "올바른 이메일 형식을 입력해주세요.";
    if (!password) e.password = "비밀번호를 입력해주세요.";
    else {
      const pwErrors = validatePassword(password);
      if (pwErrors.length > 0)
        e.password = `비밀번호: ${pwErrors.join(", ")} 필요`;
    }
    if (!passwordConfirm) e.passwordConfirm = "비밀번호를 다시 입력해주세요.";
    else if (password !== passwordConfirm)
      e.passwordConfirm = "비밀번호가 일치하지 않습니다.";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length > 0) return;

    setSubmitting(true);
    const { error } = await signUp(email, password, {
      name: name.trim(),
      phone: phone.replace(/-/g, ""),
    });
    setSubmitting(false);

    if (error) {
      if (error.includes("already registered")) {
        setErrors({ email: "이미 등록된 이메일입니다." });
      } else {
        setErrors({ form: error });
      }
      return;
    }

    setSuccess(true);
  }

  const pwChecks = [
    { label: "8자 이상", pass: password.length >= 8 },
    { label: "숫자 포함", pass: /\d/.test(password) },
    {
      label: "특수기호 포함",
      pass: /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
    },
  ];
  const passwordMatch =
    passwordConfirm.length > 0 && password === passwordConfirm;

  if (success) {
    return (
      <div className="min-h-dvh bg-cream">
        <Navbar />
        <div className="flex items-center justify-center px-4 pt-28">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-green-light">
            <CheckCircleIcon className="h-8 w-8 text-accent-green" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-brown-text">
            회원가입 완료!
          </h1>
          <p className="mb-6 text-brown">
            입력하신 이메일로 인증 메일을 발송했습니다.
            <br />
            이메일을 확인하고 인증을 완료해주세요.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="bg-terracotta hover:bg-terracotta-hover text-white"
          >
            로그인 페이지로 이동
          </Button>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-cream">
      <Navbar />
      <div className="flex items-center justify-center px-4 py-12 pt-28">
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
            <h1 className="text-2xl font-bold text-brown-text">회원가입</h1>
            <p className="mt-1 text-sm text-brown">
              바위로드에 오신 것을 환영합니다
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {errors.form && (
              <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                {errors.form}
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
                onChange={(e) => setName(e.target.value)}
                className={
                  errors.name
                    ? "border-red-400 focus-visible:ring-red-300"
                    : ""
                }
              />
              {errors.name && (
                <p className="text-xs text-red-500">{errors.name}</p>
              )}
            </div>

            {/* 핸드폰 번호 */}
            <div className="space-y-1.5">
              <Label htmlFor="phone" className="text-brown-text font-medium">
                핸드폰 번호
              </Label>
              <Input
                id="phone"
                type="tel"
                placeholder="01012345678"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value.replace(/[^0-9-]/g, ""))
                }
                className={
                  errors.phone
                    ? "border-red-400 focus-visible:ring-red-300"
                    : ""
                }
              />
              {errors.phone && (
                <p className="text-xs text-red-500">{errors.phone}</p>
              )}
            </div>

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
                className={
                  errors.email
                    ? "border-red-400 focus-visible:ring-red-300"
                    : ""
                }
              />
              {errors.email && (
                <p className="text-xs text-red-500">{errors.email}</p>
              )}
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
                  placeholder="8자 이상, 숫자, 특수기호 포함"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={
                    errors.password
                      ? "border-red-400 focus-visible:ring-red-300 pr-10"
                      : "pr-10"
                  }
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
              {password && (
                <div className="mt-1.5 flex gap-3">
                  {pwChecks.map((c) => (
                    <span
                      key={c.label}
                      className={`text-xs ${c.pass ? "text-accent-green" : "text-brown/40"}`}
                    >
                      {c.pass ? "✓" : "○"} {c.label}
                    </span>
                  ))}
                </div>
              )}
              {errors.password && !password && (
                <p className="text-xs text-red-500">{errors.password}</p>
              )}
            </div>

            {/* 비밀번호 확인 */}
            <div className="space-y-1.5">
              <Label
                htmlFor="passwordConfirm"
                className="text-brown-text font-medium"
              >
                비밀번호 확인
              </Label>
              <div className="relative">
                <Input
                  id="passwordConfirm"
                  type={showPasswordConfirm ? "text" : "password"}
                  placeholder="비밀번호를 다시 입력해주세요"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                  className={
                    errors.passwordConfirm
                      ? "border-red-400 focus-visible:ring-red-300 pr-10"
                      : "pr-10"
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPasswordConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-brown/50 hover:text-brown"
                >
                  {showPasswordConfirm ? (
                    <EyeOffIcon className="h-4 w-4" />
                  ) : (
                    <EyeIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
              {passwordConfirm && !errors.passwordConfirm && (
                <p
                  className={`text-xs ${passwordMatch ? "text-accent-green" : "text-red-500"}`}
                >
                  {passwordMatch
                    ? "✓ 비밀번호가 일치합니다"
                    : "비밀번호가 일치하지 않습니다"}
                </p>
              )}
              {errors.passwordConfirm && (
                <p className="text-xs text-red-500">
                  {errors.passwordConfirm}
                </p>
              )}
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-terracotta hover:bg-terracotta-hover text-white py-6 text-base font-semibold"
            >
              {submitting ? "처리 중..." : "회원가입"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-brown">
            이미 계정이 있으신가요?{" "}
            <Link
              to="/login"
              className="font-medium text-terracotta hover:underline"
            >
              로그인
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
    </div>
  );
}
