import {
  articleToPlainText,
  getRefundPolicyText,
} from "@/data/legal/terms-of-service";

// 수속 신청 시 표시할 이용약관 (수속 관련 조항만 선별)
export const TERMS_OF_SERVICE = articleToPlainText([
  "1", // 목적
  "10-2", // 수속료 및 결제
  "10-3", // 수속료 환불
  "11", // 개인정보 보호
]);

export const REFUND_POLICY = getRefundPolicyText();
