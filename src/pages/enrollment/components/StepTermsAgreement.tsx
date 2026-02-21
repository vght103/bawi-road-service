import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { TERMS_OF_SERVICE, REFUND_POLICY } from "@/data/enrollment/terms";

interface StepTermsAgreementProps {
  termsAgreed: boolean;
  onTermsChange: (checked: boolean) => void;
  refundAgreed: boolean;
  onRefundChange: (checked: boolean) => void;
  studentNote: string;
  onNoteChange: (note: string) => void;
  errors: Record<string, string>;
}

export default function StepTermsAgreement({
  termsAgreed,
  onTermsChange,
  refundAgreed,
  onRefundChange,
  studentNote,
  onNoteChange,
  errors,
}: StepTermsAgreementProps) {
  return (
    <div className="space-y-6">
      {/* 이용약관 */}
      <div className="space-y-3">
        <label className="text-brown-dark font-semibold text-sm">
          이용약관 동의 <span className="text-terracotta">*</span>
        </label>
        <div className="max-h-[200px] overflow-y-auto rounded-[10px] border border-input bg-secondary/30 p-4 text-[0.78rem] text-brown leading-relaxed whitespace-pre-line">
          {TERMS_OF_SERVICE}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="terms"
            checked={termsAgreed}
            onCheckedChange={(checked) => onTermsChange(checked === true)}
          />
          <label htmlFor="terms" className="text-sm text-brown-dark cursor-pointer">
            위 이용약관에 동의합니다.
          </label>
        </div>
        {errors.terms && <p className="text-terracotta text-[0.75rem]">{errors.terms}</p>}
      </div>

      {/* 환불규정 */}
      <div className="space-y-3">
        <label className="text-brown-dark font-semibold text-sm">
          환불 규정 동의 <span className="text-terracotta">*</span>
        </label>
        <div className="max-h-[200px] overflow-y-auto rounded-[10px] border border-input bg-secondary/30 p-4 text-[0.78rem] text-brown leading-relaxed whitespace-pre-line">
          {REFUND_POLICY}
        </div>
        <div className="flex items-center gap-2">
          <Checkbox
            id="refund"
            checked={refundAgreed}
            onCheckedChange={(checked) => onRefundChange(checked === true)}
          />
          <label htmlFor="refund" className="text-sm text-brown-dark cursor-pointer">
            위 환불 규정에 동의합니다.
          </label>
        </div>
        {errors.refund && <p className="text-terracotta text-[0.75rem]">{errors.refund}</p>}
      </div>

      {/* 요청사항 */}
      <div className="space-y-1.5">
        <label className="text-brown-dark font-semibold text-sm">
          요청사항 (선택)
        </label>
        <Textarea
          value={studentNote}
          onChange={(event) => onNoteChange(event.target.value)}
          placeholder="추가 요청사항이 있으시면 자유롭게 작성해주세요."
          className="min-h-[100px] rounded-[10px] resize-none"
        />
      </div>
    </div>
  );
}
