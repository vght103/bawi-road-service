export type EnrollmentStatus =
  | "PENDING"
  | "CONFIRMED"
  | "DOCUMENTS_PENDING"
  | "READY_TO_DEPART"
  | "COMPLETED"
  | "CANCELLED";

export type DocumentType =
  | "FLIGHT_TICKET"
  | "TRAVEL_INSURANCE"
  | "ADMISSION_LETTER"
  | "INVOICE";

export type DocumentUploader = "STUDENT" | "ADMIN";

export interface Enrollment {
  id: string;
  user_id: string;
  academy_id: string;
  academy_name: string;
  course_name: string;
  dormitory_type: string;
  duration_weeks: number;
  start_date: string;
  status: EnrollmentStatus;
  terms_agreed: boolean;
  refund_policy_agreed: boolean;
  student_note: string | null;
  created_at: string;
  updated_at: string;
}

export interface EnrollmentInsert {
  user_id: string;
  academy_id: string;
  academy_name: string;
  course_name: string;
  dormitory_type: string;
  duration_weeks: number;
  start_date: string;
  terms_agreed: boolean;
  refund_policy_agreed: boolean;
  student_note?: string | null;
  source?: string | null;
}

export interface EnrollmentDocument {
  id: string;
  enrollment_id: string;
  document_type: DocumentType;
  uploaded_by: DocumentUploader;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
  created_at: string;
}
