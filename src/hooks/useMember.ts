import { useStore } from "@nanostores/react";
import { $member, $loading } from "@/stores/authStore";

// DB members 테이블 기반 회원 프로필 훅 (useAuth의 Supabase Auth 유저와 구분)
export function useMember() {
  const member = useStore($member);
  const isLoading = useStore($loading);

  return { member, isLoading };
}
