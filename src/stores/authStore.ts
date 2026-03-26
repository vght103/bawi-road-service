import { atom } from "nanostores";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, supabaseConfigured } from "@/lib/supabase";

export type UserRole = "ADMIN" | "STUDENT";

// DB members 테이블 회원 프로필 (Supabase Auth 유저와 별도 관리)
export interface Member {
  id: string; // Supabase Auth user.id와 동일
  name: string | null;
  phone: string | null;
  role: UserRole;
}

// 전역 인증 상태 (nanostores atom)
export const $user = atom<User | null>(null);
export const $session = atom<Session | null>(null);
export const $loading = atom(true); // 초기 인증 확인 중 true
export const $member = atom<Member | null>(null);

// members 테이블에서 회원 프로필 조회 후 $member에 저장
let fetchingMemberId: string | null = null; // 중복 호출 방지 플래그
async function fetchMember(userId: string) {
  if (!supabaseConfigured) return;
  if (fetchingMemberId === userId) return; // 동일 유저 중복 요청 차단
  fetchingMemberId = userId;
  const { data } = await supabase.from("members").select("id, name, phone, role").eq("id", userId).single();
  if (data) {
    $member.set(data as Member);
  }
  fetchingMemberId = null;
}

// 앱 최초 로드 시 인증 상태 초기화
if (supabaseConfigured) {
  supabase.auth.getSession().then(({ data: { session } }) => {
    $session.set(session);
    $user.set(session?.user ?? null);
    $loading.set(false);
    if (session?.user) {
      fetchMember(session.user.id);
    }
  });

  supabase.auth.onAuthStateChange((_event, session) => {
    $session.set(session);
    $user.set(session?.user ?? null);
    if (session?.user) {
      fetchMember(session.user.id);
    } else {
      $member.set(null);
    }
  });
} else {
  // 환경변수 미설정 시에도 UI 블로킹 방지
  $loading.set(false);
}

// 회원가입
export async function signUp(
  email: string,
  password: string,
  metadata: { name: string; phone: string },
): Promise<{ error: string | null }> {
  if (!supabaseConfigured) return { error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: metadata.name, phone: metadata.phone } },
  });
  return { error: error?.message ?? null };
}

// 로그인. STUDENT 역할만 허용하며 ADMIN 계정은 즉시 로그아웃 처리
export async function signIn(email: string, password: string): Promise<{ error: string | null }> {
  if (!supabaseConfigured) return { error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const { data: member } = await supabase.from("members").select("role").eq("id", data.user.id).single();

  if (member?.role !== "STUDENT") {
    await supabase.auth.signOut();
    return { error: "가입된 회원 정보가 없습니다. 회원가입을 먼저 진행해주세요." };
  }

  return { error: null };
}

// 로그아웃 후 회원 프로필 상태 초기화
export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
  $member.set(null);
}

// 비밀번호 변경
export async function changePassword(newPassword: string): Promise<{ error: string | null }> {
  if (!supabaseConfigured) return { error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error: error?.message ?? null };
}

// delete_own_account RPC로 회원 데이터 삭제 후 자동 로그아웃
export async function deleteAccount(): Promise<{ error: string | null }> {
  if (!supabaseConfigured) return { error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  const { error } = await supabase.rpc("delete_own_account");
  if (error) return { error: error.message };
  await supabase.auth.signOut();
  $member.set(null);
  return { error: null };
}

// 이름+전화번호로 이메일 찾기. 마스킹된 형태로 반환 (예: ab***@gmail.com)
export async function findEmail(
  name: string,
  phone: string,
): Promise<{ maskedEmail: string | null; error: string | null }> {
  if (!supabaseConfigured)
    return { maskedEmail: null, error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  const { data, error } = await supabase.rpc("find_email_by_name_and_phone", {
    p_name: name,
    p_phone: phone,
  });
  if (error) return { maskedEmail: null, error: error.message };
  if (!data || data.length === 0) return { maskedEmail: null, error: "일치하는 회원 정보를 찾을 수 없습니다." };
  return { maskedEmail: data[0].masked_email, error: null };
}

// 이름+이메일로 회원 검증 후 비밀번호 재설정 이메일 발송
export async function sendPasswordResetEmail(name: string, email: string): Promise<{ error: string | null }> {
  if (!supabaseConfigured) return { error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  const { data: verified, error: verifyError } = await supabase.rpc("verify_member_by_name_and_email", {
    p_name: name,
    p_email: email,
  });
  if (verifyError) return { error: verifyError.message };
  if (!verified) return { error: "일치하는 회원 정보를 찾을 수 없습니다." };
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) return { error: error.message };
  return { error: null };
}
