import { useStore } from "@nanostores/react";
import { $member, $loading } from "@/stores/authStore";

export function useMember() {
  const member = useStore($member);
  const isLoading = useStore($loading);

  return { member, isLoading };
}
