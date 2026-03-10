// 수강 신청 진행 상태
// PENDING: 접수 대기 | CONFIRMED: 승인 | DOCUMENTS_PENDING: 서류 제출 대기 | READY_TO_DEPART: 출국 준비 완료 | COMPLETED: 완료 | CANCELLED: 취소
export type EnrollmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DOCUMENTS_PENDING"
  | "READY_TO_DEPART"
  | "COMPLETED"
  | "CANCELLED";

// 제출 서류 종류: 항공권 | 여행자 보험 | 입학 허가서 | 인보이스
export type DocumentType =
  | "FLIGHT_TICKET"
  | "TRAVEL_INSURANCE"
  | "ADMISSION_LETTER"
  | "INVOICE";

// 서류 업로드 주체
export type DocumentUploader = "STUDENT" | "ADMIN";

// enrollments 테이블 행 구조
export interface Enrollment {
  id: string;
  user_id: string;
  academy_id: string;
  academy_name: string;
  course_name: string;
  dormitory_type: string;
  duration_weeks: number; // 단위: 주
  start_date: string; // ISO 날짜 문자열
  status: EnrollmentStatus;
  terms_agreed: boolean;
  refund_policy_agreed: boolean;
  student_note: string | null;
  created_at: string;
  updated_at: string;
}

// 새 수강 신청 생성 시 사용 (id, status, created_at, updated_at 제외)
export interface EnrollmentInsert {
  user_id: string;
  academy_id: string;
  academy_name: string;
  course_name: string;
  dormitory_type: string;
  duration_weeks: number; // 단위: 주
  start_date: string;
  terms_agreed: boolean;
  refund_policy_agreed: boolean;
  student_note?: string | null;
  source?: string | null; // 유입 경로
}

// enrollment_documents 테이블 행 구조
export interface EnrollmentDocument {
  id: string;
  enrollment_id: string;
  document_type: DocumentType;
  uploaded_by: DocumentUploader;
  file_name: string;
  file_url: string;
  file_size: number; // 단위: 바이트
  mime_type: string;
  created_at: string;
}
