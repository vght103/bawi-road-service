import { supabase, supabaseConfigured } from "@/lib/supabase";

// Presigned URL 발급 요청 파라미터
interface UploadPresignParams {
  fileName: string;
  fileSize: number; // 단위: 바이트
  mimeType: string;
  enrollmentId: string;
}

// Presigned URL 발급 응답
interface UploadPresignResponse {
  uploadUrl: string; // 만료 시간이 있는 임시 업로드 URL
  objectKey: string; // R2 스토리지 내 저장 경로
}

// 파일 업로드용 Presigned URL 요청 (서버가 발급한 임시 URL로 R2에 PUT 업로드)
export async function getUploadPresignedUrl(
  params: UploadPresignParams
): Promise<{ data: UploadPresignResponse | null; error: string | null }> {
  if (!supabaseConfigured) {
    return { data: null, error: "서버에 연결할 수 없습니다." };
  }

  const { data, error } = await supabase.functions.invoke("storage-presign", {
    body: { action: "upload", ...params },
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as UploadPresignResponse, error: null };
}

// R2 스토리지에서 문서 삭제 (잘못 올렸거나 교체 시 기존 파일 제거)
export async function deleteDocumentFromR2(
  documentId: string
): Promise<{ error: string | null }> {
  if (!supabaseConfigured) {
    return { error: "서버에 연결할 수 없습니다." };
  }

  const { error } = await supabase.functions.invoke("storage-presign", {
    body: { action: "delete", documentId },
  });

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
