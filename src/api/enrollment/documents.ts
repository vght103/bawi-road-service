import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { EnrollmentDocument } from "@/types/enrollment";

export async function uploadDocumentToR2(
  file: File,
  uploadUrl: string
): Promise<{ error: string | null }> {
  try {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!response.ok) {
      return { error: `업로드 실패 (${response.status})` };
    }

    return { error: null };
  } catch {
    return { error: "파일 업로드 중 오류가 발생했습니다." };
  }
}

interface SaveDocumentParams {
  enrollment_id: string;
  document_type: string;
  uploaded_by: string;
  file_name: string;
  file_url: string;
  file_size: number;
  mime_type: string;
}

export async function saveDocumentRecord(
  params: SaveDocumentParams
): Promise<{ data: EnrollmentDocument | null; error: string | null }> {
  if (!supabaseConfigured) {
    return { data: null, error: "서버에 연결할 수 없습니다." };
  }

  const { data, error } = await supabase
    .from("enrollment_documents")
    .insert(params)
    .select()
    .single();

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as EnrollmentDocument, error: null };
}
