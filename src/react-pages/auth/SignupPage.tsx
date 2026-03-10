import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { EyeIcon, EyeOffIcon, CheckCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createIsland } from "@/lib/createIsland";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useAuth } from "@/hooks/useAuth";
import LoadingOverlay from "@/components/LoadingOverlay";

// 회원가입 폼 유효성 스키마 — 이름/핸드폰/이메일/비밀번호/비밀번호 확인
const signupSchema = z
  .object({
    name: z.string().min(1, "이름을 입력해주세요."),
    phone: z
      .string()
      .min(1, "핸드폰 번호를 입력해주세요.")
      .regex(/^01[016789]\d{7,8}$/, "올바른 핸드폰 번호를 입력해주세요."),
    email: z
      .string()
      .min(1, "이메일을 입력해주세요.")
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "올바른 이메일 형식을 입력해주세요."),
    password: z
      .string()
      .min(8, "8자 이상이어야 합니다.")
      .regex(/^(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])/, "숫자와 특수기호를 포함해야 합니다."),
    passwordConfirm: z.string().min(1, "비밀번호를 다시 입력해주세요."),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: "비밀번호가 일치하지 않습니다.",
    path: ["passwordConfirm"],
  });

type SignupFormValues = z.infer<typeof signupSchema>; // signupSchema에서 자동 추론된 폼 값 타입

// 비밀번호 강도 체크 항목 — 입력 중 실시간으로 각 조건 충족 여부 표시
const PASSWORD_CHECKS = [
  { label: "8자 이상", test: (pw: string) => pw.length >= 8 },
  { label: "숫자 포함", test: (pw: string) => /\d/.test(pw) },
  {
    label: "특수기호 포함",
    test: (pw: string) => /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pw),
  },
] as const;

// 회원가입 완료 후 이메일 인증 안내 화면
function SignupSuccess() {
  return (
    <div className="min-h-dvh bg-cream">
      <div className="flex items-center justify-center px-4 pt-22">
        <div className="w-full max-w-md text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-accent-green-light">
            <CheckCircleIcon className="h-8 w-8 text-accent-green" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-brown-text">회원가입 완료!</h1>
          <p className="mb-6 text-brown">
            입력하신 이메일로 인증 메일을 발송했습니다.
            <br />
            이메일을 확인하고 인증을 완료해주세요.
          </p>
          <Button asChild className="bg-terracotta hover:bg-terracotta-hover text-white">
            <a href="/login">로그인 페이지로 이동</a>
          </Button>
        </div>
      </div>
    </div>
  );
}

// 비밀번호 입력 컴포넌트 — 표시/숨김 토글 버튼 포함
function PasswordInput({
  value,
  show,      // true면 텍스트, false면 점(*)으로 표시
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

// 회원가입 페이지 — react-hook-form + zod, 비밀번호 강도/일치 실시간 체크
function SignupPage() {
  const { signUp } = useAuth();

  const [showPassword, setShowPassword] = useState(false);        // 비밀번호 필드 표시 상태
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false); // 확인 필드 표시 상태
  const [success, setSuccess] = useState(false); // 완료 화면 전환 여부

  // react-hook-form 인스턴스 — zod resolver로 자동 유효성 검사
  const form = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      password: "",
      passwordConfirm: "",
    },
  });

  // 비밀번호 강도 체크 및 일치 여부 실시간 감시
  const password = form.watch("password");
  const passwordConfirm = form.watch("passwordConfirm");
  const passwordMatch = passwordConfirm.length > 0 && password === passwordConfirm; // 확인값이 있고 일치하면 true

  // 폼 제출 — Supabase Auth 회원가입, 이름/전화번호를 user_metadata로 저장
  async function onSubmit(values: SignupFormValues) {
    const { error } = await signUp(values.email, values.password, {
      name: values.name.trim(),
      phone: values.phone.replace(/-/g, ""), // 하이픈 제거 후 순수 숫자로 저장
    });

    if (error) {
      if (error.includes("already registered")) {
        form.setError("email", { message: "이미 등록된 이메일입니다." });
      } else {
        form.setError("root", { message: error }); // 기타 에러는 폼 전체 에러로 표시
      }
      return;
    }

    setSuccess(true);
  }

  if (success) return <SignupSuccess />;

  return (
    <div className="min-h-dvh bg-cream">
      <LoadingOverlay visible={form.formState.isSubmitting} />
      <div className="flex items-center justify-center px-4 py-12 pt-22">
        <div className="flex w-full max-w-[1000px] overflow-hidden rounded-2xl bg-white shadow-lg border border-beige-dark">
          {/* 왼쪽: 회원가입 폼 */}
          <div className="flex w-full lg:w-1/2 items-center justify-center px-6 sm:px-10 py-12">
            <div className="w-full max-w-sm">
              <div className="mb-8">
                <a href="/" className="mb-6 inline-block text-sm text-brown hover:text-terracotta">
                  ← 홈으로
                </a>
                <h1 className="text-2xl font-bold text-brown-text">회원가입</h1>
                <p className="mt-1 text-sm text-brown">바위로드에 오신 것을 환영합니다</p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                  {/* 서버 에러 (이메일 중복 외 기타) */}
                  {form.formState.errors.root && (
                    <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                      {form.formState.errors.root.message}
                    </div>
                  )}

                  {/* 이름 */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-brown-text font-medium">이름</FormLabel>
                        <FormControl>
                          <Input placeholder="홍길동" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 핸드폰 번호 — 숫자와 하이픈만 허용 */}
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-brown-text font-medium">핸드폰 번호</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="01012345678"
                            {...field}
                            onChange={(event) => field.onChange(event.target.value.replace(/[^0-9-]/g, ""))} // 숫자/하이픈 외 차단
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 이메일 */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-brown-text font-medium">이메일</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="email@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* 비밀번호 — 입력 중 강도 체크 실시간 표시 */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-brown-text font-medium">비밀번호</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="8자 이상, 숫자, 특수기호 포함"
                            show={showPassword}
                            onToggle={() => setShowPassword((prev) => !prev)}
                            {...field}
                          />
                        </FormControl>
                        {/* 조건 충족 시 초록색, 미충족 시 회색 */}
                        {password && (
                          <div className="flex gap-3">
                            {PASSWORD_CHECKS.map((check) => (
                              <span
                                key={check.label}
                                className={`text-xs ${check.test(password) ? "text-accent-green" : "text-brown/40"}`}
                              >
                                {check.test(password) ? "✓" : "○"} {check.label}
                              </span>
                            ))}
                          </div>
                        )}
                        {/* 비밀번호를 입력하지 않은 경우만 기본 에러 표시 (강도 체크와 중복 방지) */}
                        {!password && <FormMessage />}
                      </FormItem>
                    )}
                  />

                  {/* 비밀번호 확인 — 입력 중 일치 여부 실시간 표시 */}
                  <FormField
                    control={form.control}
                    name="passwordConfirm"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-brown-text font-medium">비밀번호 확인</FormLabel>
                        <FormControl>
                          <PasswordInput
                            placeholder="비밀번호를 다시 입력해주세요"
                            show={showPasswordConfirm}
                            onToggle={() => setShowPasswordConfirm((prev) => !prev)}
                            {...field}
                          />
                        </FormControl>
                        {/* 폼 에러가 없을 때만 일치 여부 표시 (에러와 중복 방지) */}
                        {passwordConfirm && !form.formState.errors.passwordConfirm && (
                          <p className={`text-xs ${passwordMatch ? "text-accent-green" : "text-red-500"}`}>
                            {passwordMatch ? "✓ 비밀번호가 일치합니다" : "비밀번호가 일치하지 않습니다"}
                          </p>
                        )}
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full bg-terracotta hover:bg-terracotta-hover text-white py-6 text-base font-semibold"
                  >
                    {form.formState.isSubmitting ? "처리 중..." : "회원가입"}
                  </Button>
                </form>
              </Form>

              <p className="mt-6 text-center text-sm text-brown">
                이미 계정이 있으신가요?{" "}
                <a href="/login" className="font-medium text-terracotta hover:underline">
                  로그인
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

export default createIsland(SignupPage);
