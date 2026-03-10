import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { EnrollmentDocument } from "@/types/enrollment";

// Presigned URL로 파일을 Cloudflare R2에 직접 업로드
export async function uploadDocumentToR2(
  file: File,
  uploadUrl: string
): Promise<{ error: string | null }> {
  try {
    // Presigned URL은 PUT 메서드로 파일을 직접 전송해야 함
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

// enrollment_documents 테이블 저장 파라미터
interface SaveDocumentParams {
  enrollment_id: string;
  document_type: string;
  uploaded_by: string; // "STUDENT" | "ADMIN"
  file_name: string;
  file_url: string;
  file_size: number; // 단위: 바이트
  mime_type: string;
}

// 파일 업로드 완료 후 DB에 문서 메타데이터 기록 (실제 파일은 R2에 저장)
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
