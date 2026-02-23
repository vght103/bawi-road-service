import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { Enrollment, EnrollmentInsert, EnrollmentDocument } from "@/types/enrollment";

export interface EnrollmentWithDocuments extends Enrollment {
  documents: EnrollmentDocument[];
}

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
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (rows ?? []) as Enrollment[], error: null };
}
