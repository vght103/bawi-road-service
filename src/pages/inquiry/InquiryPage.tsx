import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckIcon, MessageCircle } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createInquiry } from "@/api/inquiry/inquiries";

export default function InquiryPage() {
  const [searchParams] = useSearchParams();
  const source = searchParams.get("from");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  function formatPhone(value: string) {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
  }

  function handlePhoneChange(event: React.ChangeEvent<HTMLInputElement>) {
    setPhone(formatPhone(event.target.value));
  }

  function validate() {
    const fieldErrors: Record<string, string> = {};
    if (!name.trim()) fieldErrors.name = "이름을 입력해주세요.";
    if (!phone.trim()) fieldErrors.phone = "연락처를 입력해주세요.";
    else if (!/^01[016789]-\d{3,4}-\d{4}$/.test(phone)) fieldErrors.phone = "올바른 휴대폰 번호를 입력해주세요.";
    if (!message.trim()) fieldErrors.message = "문의 내용을 입력해주세요.";
    return fieldErrors;
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const fieldErrors = validate();
    setErrors(fieldErrors);
    setSubmitError(null);
    if (Object.keys(fieldErrors).length > 0) return;

    setSubmitting(true);
    try {
      const { error } = await createInquiry({ name, phone, message, source });
      if (error) {
        setSubmitError("상담 신청 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        setSubmitting(false);
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("네트워크 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="bg-cream min-h-screen">
        <Navbar />
        <div className="pt-[140px] pb-20 px-6">
          <div className="max-w-[560px] mx-auto text-center">
            <div className="bg-white rounded-[20px] p-10 border border-beige-dark shadow-lg">
              <div className="w-16 h-16 bg-accent-green-light rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckIcon className="w-8 h-8 text-accent-green" strokeWidth={2.5} />
              </div>
              <h2 className="text-[1.5rem] font-extrabold text-brown-dark mb-3">상담 신청이 완료되었습니다!</h2>
              <p className="text-brown text-[0.9rem] leading-relaxed mb-6">빠른 시일 내에 연락드리겠습니다.</p>
              <Button asChild>
                <Link to="/" className="no-underline">
                  홈으로 돌아가기
                </Link>
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen">
      <Navbar />

      <div className="pt-[120px] pb-20 px-6">
        {/* 페이지 헤더 */}
        <div className="mx-auto text-center mb-8" style={{ maxWidth: 540 }}>
          <h1 className="text-[1.6rem] md:text-[2rem] font-extrabold text-brown-dark tracking-tight mb-2">
            1:1 상담 신청
          </h1>
          <p className="text-brown text-[0.9rem] leading-relaxed">궁금한 점이 있으시면 편하게 문의해주세요.</p>
        </div>

        {/* 폼 카드 */}
        <div className="mx-auto" style={{ maxWidth: 540 }}>
          <div className="bg-white rounded-[20px] p-7 md:p-9 border border-beige-dark shadow-sm">
            <div className="bg-beige rounded-xl p-4 border border-beige-dark flex items-start gap-3 mb-5">
              <div className="w-5 h-5 rounded-full bg-terracotta-light flex items-center justify-center shrink-0 mt-0.5">
                <MessageCircle size={11} strokeWidth={2.5} className="text-terracotta" />
              </div>
              <p className="text-brown text-[0.82rem] leading-relaxed">
                카카오톡 또는 전화로 빠르게 연락드려요.
                <br />
                선호하시는 연락 방법이 있다면 문의 내용에 적어주세요.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                {/* 이름 */}
                <div className="space-y-1.5">
                  <Label className="text-[0.82rem] text-brown-dark font-semibold">
                    이름 <span className="text-terracotta">*</span>
                  </Label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="홍길동"
                    aria-invalid={!!errors.name}
                    className="h-11 rounded-[10px] bg-cream/50 border-beige-dark focus-visible:border-terracotta"
                  />
                  {errors.name && <p className="text-terracotta text-[0.75rem]">{errors.name}</p>}
                </div>

                {/* 연락처 */}
                <div className="space-y-1.5">
                  <Label className="text-[0.82rem] text-brown-dark font-semibold">
                    연락처 <span className="text-terracotta">*</span>
                  </Label>
                  <Input
                    type="tel"
                    value={phone}
                    onChange={handlePhoneChange}
                    placeholder="010-0000-0000"
                    inputMode="numeric"
                    maxLength={13}
                    aria-invalid={!!errors.phone}
                    className="h-11 rounded-[10px] bg-cream/50 border-beige-dark focus-visible:border-terracotta"
                  />
                  {errors.phone && <p className="text-terracotta text-[0.75rem]">{errors.phone}</p>}
                </div>
              </div>

              {/* 문의 내용 */}
              <div className="space-y-1.5">
                <Label className="text-[0.82rem] text-brown-dark font-semibold">
                  문의 내용 <span className="text-terracotta">*</span>
                </Label>
                <Textarea
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  placeholder="궁금한 점이나 요청 사항을 자유롭게 적어주세요"
                  aria-invalid={!!errors.message}
                  className="rounded-[10px] bg-cream/50 border-beige-dark focus-visible:border-terracotta resize-none"
                  style={{ fieldSizing: "fixed", height: 200 }}
                />
                {errors.message && <p className="text-terracotta text-[0.75rem]">{errors.message}</p>}
              </div>

              {/* Submit */}
              <Button
                type="submit"
                size="lg"
                className="w-full h-12 text-[0.95rem] rounded-[10px] bg-terracotta hover:bg-terracotta-hover text-white font-bold shadow-[0_4px_14px_rgba(196,96,58,0.3)] hover:shadow-[0_6px_20px_rgba(196,96,58,0.35)] hover:-translate-y-0.5 transition-all mt-2"
                disabled={submitting}
              >
                {submitting ? "신청 중..." : "상담 신청하기"}
              </Button>
              {submitError && <p className="text-terracotta text-[0.8rem] text-center">{submitError}</p>}
            </form>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
