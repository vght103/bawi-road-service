import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { Enrollment, EnrollmentInsert } from "@/types/enrollment";

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

export async function fetchEnrollment(
  id: string
): Promise<{ data: Enrollment | null; error: string | null }> {
  if (!supabaseConfigured) {
    return { data: null, error: "서버에 연결할 수 없습니다." };
  }

  const { data: row, error } = await supabase
    .from("enrollments")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: row as Enrollment, error: null };
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
