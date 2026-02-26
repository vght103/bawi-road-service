import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { InquiryInsert } from "@/types/inquiry";

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
