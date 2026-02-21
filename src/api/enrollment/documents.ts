import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { EnrollmentDocument } from "@/types/enrollment";

export async function fetchDocuments(
  enrollmentId: string
): Promise<{ data: EnrollmentDocument[]; error: string | null }> {
  if (!supabaseConfigured) {
    return { data: [], error: "서버에 연결할 수 없습니다." };
  }

  const { data: rows, error } = await supabase
    .from("enrollment_documents")
    .select("*")
    .eq("enrollment_id", enrollmentId)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data: (rows ?? []) as EnrollmentDocument[], error: null };
}
