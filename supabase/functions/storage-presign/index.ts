import { AwsClient } from "https://esm.sh/aws4fetch@1.0.20";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "http://localhost:3000",
  "http://localhost:4321",
  "https://bawiroad.com",
  "https://www.bawiroad.com",
  "https://dev.bawi-road-service.pages.dev",
];

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

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get("Origin");
  return {
    "Access-Control-Allow-Origin":
      origin && ALLOWED_ORIGINS.includes(origin)
        ? origin
        : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Headers":
      "authorization, x-client-info, apikey, content-type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
  };
}

function jsonResponse(
  body: Record<string, unknown>,
  status: number,
  corsHeaders: Record<string, string>
) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function extractObjectKey(fileUrl: string): string | null {
  try {
    const url = new URL(fileUrl);
    return url.pathname.slice(1);
  } catch {
    return null;
  }
}

async function isAdmin(
  supabase: ReturnType<typeof createClient>,
  userId: string
): Promise<boolean> {
  const { data: member } = await supabase
    .from("members")
    .select("role")
    .eq("id", userId)
    .single();

  return member?.role === "ADMIN";
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return jsonResponse({ error: "인증이 필요합니다." }, 401, corsHeaders);
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();
    if (authError || !user) {
      return jsonResponse(
        { error: "유효하지 않은 인증입니다." },
        401,
        corsHeaders
      );
    }

    const body = await req.json();
    const { action } = body;

    if (action === "upload") {
      const { fileName, fileSize, mimeType, enrollmentId } = body;

      if (!fileName || !fileSize || !mimeType || !enrollmentId) {
        return jsonResponse(
          { error: "필수 파라미터가 누락되었습니다." },
          400,
          corsHeaders
        );
      }

      if (fileSize > MAX_FILE_SIZE) {
        return jsonResponse(
          { error: "파일 크기는 10MB 이하여야 합니다." },
          400,
          corsHeaders
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return jsonResponse(
          { error: "허용되지 않는 파일 형식입니다." },
          400,
          corsHeaders
        );
      }

      const { data: enrollment, error: enrollmentError } = await supabase
        .from("enrollments")
        .select("id")
        .eq("id", enrollmentId)
        .eq("user_id", user.id)
        .single();

      if (enrollmentError || !enrollment) {
        return jsonResponse(
          { error: "이 수속 신청에 대한 접근 권한이 없습니다." },
          403,
          corsHeaders
        );
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

      return jsonResponse(
        { uploadUrl: signed.url, objectKey },
        200,
        corsHeaders
      );
    }

    if (action === "admin-upload") {
      const { fileName, fileSize, mimeType, enrollmentId } = body;

      if (!fileName || !fileSize || !mimeType || !enrollmentId) {
        return jsonResponse(
          { error: "필수 파라미터가 누락되었습니다." },
          400,
          corsHeaders
        );
      }

      if (fileSize > MAX_FILE_SIZE) {
        return jsonResponse(
          { error: "파일 크기는 10MB 이하여야 합니다." },
          400,
          corsHeaders
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        return jsonResponse(
          { error: "허용되지 않는 파일 형식입니다." },
          400,
          corsHeaders
        );
      }

      // 어드민 역할 확인
      if (!(await isAdmin(supabase, user.id))) {
        return jsonResponse(
          { error: "어드민만 이 작업을 수행할 수 있습니다." },
          403,
          corsHeaders
        );
      }

      // enrollment 존재 확인 (소유권 검증 없음)
      const { data: enrollment, error: enrollmentError } = await supabase
        .from("enrollments")
        .select("id")
        .eq("id", enrollmentId)
        .single();

      if (enrollmentError || !enrollment) {
        return jsonResponse(
          { error: "수속 신청을 찾을 수 없습니다." },
          404,
          corsHeaders
        );
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

      return jsonResponse(
        { uploadUrl: signed.url, objectKey },
        200,
        corsHeaders
      );
    }

    if (action === "view") {
      const { documentId } = body;

      if (!documentId) {
        return jsonResponse(
          { error: "documentId가 필요합니다." },
          400,
          corsHeaders
        );
      }

      const { data: docRecord, error: docError } = await supabase
        .from("enrollment_documents")
        .select("file_url, enrollment_id, enrollments!inner(user_id)")
        .eq("id", documentId)
        .single();

      if (docError || !docRecord) {
        return jsonResponse(
          { error: "문서를 찾을 수 없습니다." },
          404,
          corsHeaders
        );
      }

      const enrollmentData = docRecord.enrollments as unknown as {
        user_id: string;
      };
      if (enrollmentData.user_id !== user.id && !(await isAdmin(supabase, user.id))) {
        return jsonResponse(
          { error: "이 문서에 대한 접근 권한이 없습니다." },
          403,
          corsHeaders
        );
      }

      const objectKey = extractObjectKey(docRecord.file_url);
      if (!objectKey) {
        return jsonResponse(
          { error: "파일 URL을 처리할 수 없습니다." },
          500,
          corsHeaders
        );
      }

      const url = new URL(`${R2_ENDPOINT}/${R2_BUCKET}/${objectKey}`);
      url.searchParams.set("X-Amz-Expires", "900");

      const signed = await r2.sign(
        new Request(url, { method: "GET" }),
        { aws: { signQuery: true } }
      );

      return jsonResponse({ viewUrl: signed.url }, 200, corsHeaders);
    }

    if (action === "delete") {
      const { documentId } = body;

      if (!documentId) {
        return jsonResponse(
          { error: "documentId가 필요합니다." },
          400,
          corsHeaders
        );
      }

      const { data: docRecord, error: docError } = await supabase
        .from("enrollment_documents")
        .select("id, file_url, enrollment_id, enrollments!inner(user_id)")
        .eq("id", documentId)
        .single();

      if (docError || !docRecord) {
        return jsonResponse(
          { error: "문서를 찾을 수 없습니다." },
          404,
          corsHeaders
        );
      }

      const ownerData = docRecord.enrollments as unknown as {
        user_id: string;
      };
      if (ownerData.user_id !== user.id && !(await isAdmin(supabase, user.id))) {
        return jsonResponse(
          { error: "이 문서에 대한 삭제 권한이 없습니다." },
          403,
          corsHeaders
        );
      }

      const objectKey = extractObjectKey(docRecord.file_url);
      if (!objectKey) {
        return jsonResponse(
          { error: "파일 URL을 처리할 수 없습니다." },
          500,
          corsHeaders
        );
      }

      // Sequential: DB delete first, then R2 cleanup (C-2 fix)
      const { error: dbError } = await supabase
        .from("enrollment_documents")
        .delete()
        .eq("id", documentId);

      if (dbError) {
        return jsonResponse(
          { error: "문서 레코드 삭제에 실패했습니다." },
          500,
          corsHeaders
        );
      }

      // R2 cleanup (best-effort after DB success)
      try {
        const deleteUrl = new URL(
          `${R2_ENDPOINT}/${R2_BUCKET}/${objectKey}`
        );
        const signed = await r2.sign(
          new Request(deleteUrl, { method: "DELETE" }),
          { aws: { signQuery: true } }
        );
        const r2Response = await fetch(signed.url, { method: "DELETE" });
        if (!r2Response.ok && r2Response.status !== 404) {
          console.error("R2 파일 삭제 실패:", r2Response.status);
        }
      } catch (r2Error) {
        console.error("R2 삭제 중 오류:", r2Error);
      }

      return jsonResponse({ success: true }, 200, corsHeaders);
    }

    return jsonResponse(
      {
        error:
          "유효하지 않은 action입니다. 'upload', 'admin-upload', 'view', 'delete'를 사용하세요.",
      },
      400,
      corsHeaders
    );
  } catch (_error) {
    return jsonResponse(
      { error: "서버 오류가 발생했습니다." },
      500,
      corsHeaders
    );
  }
});
