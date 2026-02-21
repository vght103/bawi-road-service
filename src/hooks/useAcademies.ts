import { useQuery } from "@tanstack/react-query";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { academies as fallbackAcademies } from "@/data/academies";
import type { Academy } from "@/data/academies";

async function fetchAcademies(): Promise<Academy[]> {
  if (!supabaseConfigured) return fallbackAcademies;

  const { data, error } = await supabase.from("academies").select("*").order("id");

  if (error || !data || data.length === 0) return fallbackAcademies;

  return data.map((row: Record<string, unknown>) => ({
    id: row.id as string,
    name: row.name as string,
    region: row.region as string,
    style: row.style as string,
    desc: row.desc as string,
    rating: row.rating as string,
    tags: row.tags as string[],
    image: row.image as string,
    courses: row.courses as Academy["courses"],
    dormitories: row.dormitories as Academy["dormitories"],
  }));
}

export function useAcademies() {
  const { data: academies = fallbackAcademies, isLoading: loading } = useQuery({
    queryKey: ["academies"],
    queryFn: fetchAcademies,
    placeholderData: fallbackAcademies,
  });

  return { academies, loading };
}
