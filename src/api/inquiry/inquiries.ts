import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { InquiryInsert } from "@/types/inquiry";

// 상담 문의를 inquiry_list 테이블에 저장 (상담 신청 폼 제출 시 호출)
export async function createInquiry(
  data: InquiryInsert
): Promise<{ error: string | null }> {
  if (!supabaseConfigured) {
    return { error: "서버에 연결할 수 없습니다." };
  }

  const { error } = await supabase
    .from("inquiry_list")
    .insert(data);

  if (error) {
    return { error: error.message };
  }

  return { error: null };
}
