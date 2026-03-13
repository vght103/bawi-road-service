import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL ?? "";
const supabaseAnonKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY ?? "";

// 필수 환경변수가 모두 설정되어 있는지 여부. API 함수에서 호출 전 확인용
export const supabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// 전역 Supabase 클라이언트. supabaseConfigured가 false면 사용하지 말 것
export const supabase = supabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (null as unknown as ReturnType<typeof createClient>);
