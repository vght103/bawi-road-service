// 견적 요청 로그 저장 데이터
export interface QuoteLogInsert {
  user_id?: string | null; // 비로그인 시 null
  name: string;
  email: string;
  academy_id: string;
  academy_name: string;
  course_name: string;
  dormitory_type: string;
  duration_weeks: number; // 단위: 주
  start_date?: string | null; // YYYY-MM-DD
  source?: string | null; // 유입 경로
}
