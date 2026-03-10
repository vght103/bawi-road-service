// 상담 신청 폼 제출 데이터
export interface InquiryInsert {
  name: string;
  phone: string;
  message: string;
  source?: string | null; // 유입 경로
}
