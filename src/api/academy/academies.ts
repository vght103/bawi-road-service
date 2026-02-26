import { supabase, supabaseConfigured } from "@/lib/supabase";
import type { Academy, AcademyDetail } from "@/data/academies";

export async function fetchAcademies(): Promise<Academy[]> {
  if (!supabaseConfigured) return [];

  const { data, error } = await supabase.from("academies").select("*").order("id");

  if (error || !data || data.length === 0) return [];

  return data
    .map((row: Record<string, unknown>) => ({
      id: row.id as string,
      name: row.name as string,
      region: row.region as string,
      academy_system: row.academy_system as string,
      desc: row.desc as string,
      tags: row.tags as string[],
      images: (row.images as string[]) ?? [],
      courses: row.courses as Academy["courses"],
      dormitories: row.dormitories as Academy["dormitories"],
      established_year: row.established_year as number | undefined,
      capacity: row.capacity as number | undefined,
      korean_ratio: row.korean_ratio as string | undefined,
      location_detail: row.location_detail as string | undefined,
      website: row.website as string | undefined,
    }))
    .sort((a, b) => Number(a.id) - Number(b.id));
}

export async function fetchAcademy(id: string): Promise<AcademyDetail | null> {
  if (!supabaseConfigured) return null;

  const { data, error } = await supabase
    .from("academies")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;

  const row = data as Record<string, unknown>;
  return {
    id: row.id as string,
    name: row.name as string,
    region: row.region as string,
    academy_system: row.academy_system as string,
    desc: row.desc as string,
    tags: row.tags as string[],
    images: (row.images as string[]) ?? [],
    courses: row.courses as Academy["courses"],
    dormitories: row.dormitories as Academy["dormitories"],
    established_year: row.established_year as number | undefined,
    capacity: row.capacity as number | undefined,
    korean_ratio: row.korean_ratio as string | undefined,
    location_detail: row.location_detail as string | undefined,
    website: row.website as string | undefined,
    address: row.address as string | undefined,
    shortDesc: (row.short_desc as string) ?? undefined,
    description: row.description as string | undefined,
    facilities: row.facilities as string[] | undefined,
    pros: row.pros as string[] | undefined,
    cons: row.cons as string[] | undefined,
    recommendedFor: (row.recommended_for as string[]) ?? undefined,
  };
}
