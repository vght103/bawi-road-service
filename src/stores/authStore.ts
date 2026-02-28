import { atom } from "nanostores";
import type { User, Session } from "@supabase/supabase-js";
import { supabase, supabaseConfigured } from "@/lib/supabase";

export type UserRole = "ADMIN" | "STUDENT";

export interface Member {
  id: string;
  name: string | null;
  phone: string | null;
  role: UserRole;
}

export const $user = atom<User | null>(null);
export const $session = atom<Session | null>(null);
export const $loading = atom(true);
export const $member = atom<Member | null>(null);

async function fetchMember(userId: string) {
  if (!supabaseConfigured) return;
  const { data } = await supabase
    .from("members")
    .select("id, name, phone, role")
    .eq("id", userId)
    .single();
  if (data) {
    $member.set(data as Member);
  }
}

// Initialize auth state
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
  $loading.set(false);
}

export async function signUp(
  email: string,
  password: string,
  metadata: { name: string; phone: string },
): Promise<{ error: string | null }> {
  if (!supabaseConfigured)
    return { error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name: metadata.name, phone: metadata.phone } },
  });
  return { error: error?.message ?? null };
}

export async function signIn(
  email: string,
  password: string,
): Promise<{ error: string | null }> {
  if (!supabaseConfigured)
    return { error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  const { data: member } = await supabase
    .from("members")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (member?.role !== "STUDENT") {
    await supabase.auth.signOut();
    return { error: "가입된 회원 정보가 없습니다. 회원가입을 먼저 진행해주세요." };
  }

  return { error: null };
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut();
  $member.set(null);
}

export async function changePassword(
  newPassword: string,
): Promise<{ error: string | null }> {
  if (!supabaseConfigured)
    return { error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  const { error } = await supabase.auth.updateUser({ password: newPassword });
  return { error: error?.message ?? null };
}

export async function deleteAccount(): Promise<{ error: string | null }> {
  if (!supabaseConfigured)
    return { error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  const { error } = await supabase.rpc("delete_own_account");
  if (error) return { error: error.message };
  await supabase.auth.signOut();
  $member.set(null);
  return { error: null };
}

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
  if (!data || data.length === 0)
    return { maskedEmail: null, error: "일치하는 회원 정보를 찾을 수 없습니다." };
  return { maskedEmail: data[0].masked_email, error: null };
}

export async function sendPasswordResetEmail(
  name: string,
  email: string,
): Promise<{ error: string | null }> {
  if (!supabaseConfigured)
    return { error: "일시적인 서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요." };
  const { data: verified, error: verifyError } = await supabase.rpc(
    "verify_member_by_name_and_email",
    { p_name: name, p_email: email },
  );
  if (verifyError) return { error: verifyError.message };
  if (!verified)
    return { error: "일치하는 회원 정보를 찾을 수 없습니다." };
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  });
  if (error) return { error: error.message };
  return { error: null };
}
