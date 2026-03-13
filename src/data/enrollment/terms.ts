import {
  articleToPlainText,
  getRefundPolicyText,
} from "@/data/legal/terms-of-service";

// 수속 신청 이용약관 동의란 텍스트 (제1조, 제10조의2·3, 제11조)
export const TERMS_OF_SERVICE = articleToPlainText([
  "1",    // 목적
  "10-2", // 수속료 및 결제
  "10-3", // 수속료 환불
  "11",   // 개인정보 보호
]);

// 수속 신청 환불규정 동의란 텍스트 (제10조의3)
export const REFUND_POLICY = getRefundPolicyText();
