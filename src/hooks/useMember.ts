import { useQuery } from "@tanstack/react-query";
import { useAuthContext } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Member } from "@/contexts/AuthContext";

async function fetchMember(userId: string): Promise<Member | null> {
  const { data } = await supabase.from("members").select("id, name, phone, role").eq("id", userId).single();
  return data as Member | null;
}

export function useMember() {
  const { user } = useAuthContext();

  const { data: member = null, isLoading } = useQuery({
    queryKey: ["member", user?.id],
    queryFn: () => fetchMember(user!.id),
    enabled: !!user,
    staleTime: Infinity,
  });

  return { member, isLoading };
}
