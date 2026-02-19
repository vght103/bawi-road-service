export interface QuoteLogInsert {
  user_id?: string | null;
  name: string;
  email: string;
  preferred_date?: string | null;
  academy_id: string;
  academy_name: string;
  course_name: string;
  dormitory_type: string;
  duration_weeks: number;
  start_date?: string | null;
  total_fee?: number | null;
  quote_count: number;
}
