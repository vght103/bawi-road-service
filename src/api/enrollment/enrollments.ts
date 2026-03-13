import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { Enrollment, EnrollmentInsert, EnrollmentDocument } from "@/types/enrollment";

// enrollments + enrollment_documents 조인 결과
export interface EnrollmentWithDocuments extends Enrollment {
  documents: EnrollmentDocument[];
}

// 새 수강 신청 생성
export async function createEnrollment(
  data: EnrollmentInsert
): Promise<{ data: Enrollment | null; error: string | null }> {
  if (!supabaseConfigured) {
    return { data: null, error: "서버에 연결할 수 없습니다." };
  }

  const { data: row, error } = await supabase
    .from("enrollments")
    .insert(data)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: row as Enrollment, error: null };
}

// 신청 ID로 신청 정보와 첨부 서류 목록 조회
export async function fetchEnrollmentWithDocuments(
  id: string
): Promise<{ data: EnrollmentWithDocuments | null; error: string | null }> {
  if (!supabaseConfigured) {
    return { data: null, error: "서버에 연결할 수 없습니다." };
  }

  const { data: row, error } = await supabase
    .from("enrollments")
    .select("*, documents:enrollment_documents(*)")
    .eq("id", id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: row as EnrollmentWithDocuments, error: null };
}

// 특정 사용자의 수강 신청 목록 최신순 조회 (마이페이지용)
export async function fetchMyEnrollments(
  userId: string
): Promise<{ data: Enrollment[]; error: string | null }> {
  if (!supabaseConfigured) {
    return { data: [], error: "서버에 연결할 수 없습니다." };
  }

  const { data: rows, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false }); // 최신 신청이 먼저 오도록 정렬

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (rows ?? []) as Enrollment[], error: null };
}
