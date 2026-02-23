import { AwsClient } from "https://esm.sh/aws4fetch@1.0.20";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const R2_ENDPOINT = Deno.env.get("R2_ENDPOINT")!;
const R2_BUCKET = Deno.env.get("R2_BUCKET_NAME")!;

const r2 = new AwsClient({
  accessKeyId: Deno.env.get("R2_ACCESS_KEY_ID")!,
  secretAccessKey: Deno.env.get("R2_SECRET_ACCESS_KEY")!,
});

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp",
];

function sanitizeFileName(name: string): string {
  return name
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .replace(/_{2,}/g, "_")
    .substring(0, 100);
}

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify JWT
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "인증이 필요합니다." }, 401);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return jsonResponse({ error: "유효하지 않은 인증입니다." }, 401);
    }

    const body = await req.json();
    const { action } = body;

    if (action === "upload") {
      const { fileName, fileSize, mimeType, enrollmentId } = body;

      if (!fileName || !fileSize || !mimeType || !enrollmentId) {
        return jsonResponse({ error: "필수 파라미터가 누락되었습니다." }, 400);
      }

      if (fileSize > MAX_FILE_SIZE) {
        return jsonResponse({ error: "파일 크기는 10MB 이하여야 합니다." }, 400);
      }

      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return jsonResponse({ error: "허용되지 않는 파일 형식입니다." }, 400);
      }

      // Verify user owns this enrollment
      const { data: enrollment, error: enrollmentError } = await supabase
        .from("enrollments")
        .select("id")
        .eq("id", enrollmentId)
        .eq("user_id", user.id)
        .single();

      if (enrollmentError || !enrollment) {
        return jsonResponse({ error: "이 수속 신청에 대한 접근 권한이 없습니다." }, 403);
      }

      const uuid = crypto.randomUUID();
      const sanitized = sanitizeFileName(fileName);
      const folder = `enrollments/documents/${enrollmentId}`;
      const objectKey = `${folder}/${uuid}_${sanitized}`;

      const url = new URL(`${R2_ENDPOINT}/${R2_BUCKET}/${objectKey}`);
      url.searchParams.set("X-Amz-Expires", "3600");

      const signed = await r2.sign(
        new Request(url, {
          method: "PUT",
          headers: { "Content-Type": mimeType },
        }),
        { aws: { signQuery: true } }
      );

      return jsonResponse({ uploadUrl: signed.url, objectKey }, 200);
    }

    if (action === "view") {
      const { objectKey } = body;

      if (!objectKey) {
        return jsonResponse({ error: "objectKey가 필요합니다." }, 400);
      }

      // Verify user owns the document's enrollment
      const { data: docRecord, error: docError } = await supabase
        .from("enrollment_documents")
        .select("enrollment_id, enrollments!inner(user_id)")
        .eq("file_url", objectKey)
        .single();

      if (docError || !docRecord) {
        return jsonResponse({ error: "문서를 찾을 수 없습니다." }, 404);
      }

      const enrollmentData = docRecord.enrollments as unknown as { user_id: string };
      if (enrollmentData.user_id !== user.id) {
        return jsonResponse({ error: "이 문서에 대한 접근 권한이 없습니다." }, 403);
      }

      const url = new URL(`${R2_ENDPOINT}/${R2_BUCKET}/${objectKey}`);
      url.searchParams.set("X-Amz-Expires", "900");

      const signed = await r2.sign(
        new Request(url, { method: "GET" }),
        { aws: { signQuery: true } }
      );

      return jsonResponse({ viewUrl: signed.url }, 200);
    }

    return jsonResponse(
      { error: "유효하지 않은 action입니다. 'upload' 또는 'view'를 사용하세요." },
      400
    );
  } catch (_error) {
    return jsonResponse({ error: "서버 오류가 발생했습니다." }, 500);
  }
});
