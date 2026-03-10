import { useFormContext } from "react-hook-form";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { TERMS_OF_SERVICE, REFUND_POLICY } from "@/data/enrollment/terms";
import type { EnrollmentFormValues } from "../enrollmentSchema";

// 수속 신청 3단계: 약관 동의 및 요청사항 입력
// 이용약관·환불규정 모두 동의해야 신청 완료 가능
export default function StepTermsAgreement() {
  const { watch, setValue, register, formState: { errors } } = useFormContext<EnrollmentFormValues>();

  const termsAgreed = watch("termsAgreed");
  const refundAgreed = watch("refundAgreed");

  return (
    <div className="space-y-6">
      {/* 이용약관 동의 */}
      <div className="space-y-3">
        <label className="text-brown-dark font-semibold text-sm required">이용약관 동의</label>
        {/* 전문 표시 (최대 200px, 스크롤 가능) */}
        <div className="max-h-[200px] overflow-y-auto rounded-[10px] border border-input bg-secondary/30 p-4 text-[0.78rem] text-brown leading-relaxed whitespace-pre-line">
          {TERMS_OF_SERVICE}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="terms"
            checked={termsAgreed === true}
            onCheckedChange={(checked) => setValue("termsAgreed", checked === true as never, { shouldValidate: true })}
          />
          <label htmlFor="terms" className="text-sm text-brown-dark cursor-pointer">
            위 이용약관에 동의합니다.
          </label>
        </div>
        {errors.termsAgreed && <p className="text-terracotta text-[0.75rem]">{errors.termsAgreed.message}</p>}
      </div>

      {/* 환불 규정 동의 */}
      <div className="space-y-3">
        <label className="text-brown-dark font-semibold text-sm required">환불 규정 동의</label>
        {/* 전문 표시 (최대 200px, 스크롤 가능) */}
        <div className="max-h-[200px] overflow-y-auto rounded-[10px] border border-input bg-secondary/30 p-4 text-[0.78rem] text-brown leading-relaxed whitespace-pre-line">
          {REFUND_POLICY}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="refund"
            checked={refundAgreed === true}
            onCheckedChange={(checked) => setValue("refundAgreed", checked === true as never, { shouldValidate: true })}
          />
          <label htmlFor="refund" className="text-sm text-brown-dark cursor-pointer">
            위 환불 규정에 동의합니다.
          </label>
        </div>
        {errors.refundAgreed && <p className="text-terracotta text-[0.75rem]">{errors.refundAgreed.message}</p>}
      </div>

      {/* 요청사항 (선택) */}
      <div className="space-y-1.5">
        <label className="text-brown-dark font-semibold text-sm">
          요청사항 (선택)
        </label>
        <Textarea
          {...register("studentNote")}
          placeholder="추가 요청사항이 있으시면 자유롭게 작성해주세요."
          className="min-h-[100px] rounded-[10px] resize-none"
        />
      </div>
    </div>
  );
}
