import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/lib/supabase";
import type { Profile } from "@/contexts/AuthContext";

async function fetchProfile(userId: string): Promise<Profile | null> {
  const { data } = await supabase
    .from("profiles")
    .select("id, name, phone, role")
    .eq("id", userId)
    .single();
  return data as Profile | null;
}

export function useProfile() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile = null, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: () => fetchProfile(user!.id),
    enabled: !!user,
    staleTime: Infinity,
  });

  function clearProfile() {
    queryClient.removeQueries({ queryKey: ["profile"] });
  }

  return { profile, loading: isLoading, clearProfile };
}
