import { supabase, supabaseConfigured } from "@/lib/supabase";

interface UploadPresignParams {
  fileName: string;
  fileSize: number;
  mimeType: string;
  enrollmentId: string;
}

interface UploadPresignResponse {
  uploadUrl: string;
  objectKey: string;
}

interface ViewPresignResponse {
  viewUrl: string;
}

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

export async function getViewPresignedUrl(
  objectKey: string
): Promise<{ data: ViewPresignResponse | null; error: string | null }> {
  if (!supabaseConfigured) {
    return { data: null, error: "서버에 연결할 수 없습니다." };
  }

  const { data, error } = await supabase.functions.invoke("storage-presign", {
    body: { action: "view", objectKey },
  });

  if (error) {
    return { data: null, error: error.message };
  }

  return { data: data as ViewPresignResponse, error: null };
}
