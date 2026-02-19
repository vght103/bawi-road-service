import { useState, useEffect } from "react";
import { supabase, supabaseConfigured } from "@/lib/supabase";
import { academies as fallbackAcademies } from "@/data/academies";
import type { Academy } from "@/data/academies";

export function useAcademies() {
  const [academies, setAcademies] = useState<Academy[]>(fallbackAcademies);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    async function fetchAcademies() {
      const { data, error } = await supabase
        .from("academies")
        .select("*")
        .order("id");

      if (!error && data && data.length > 0) {
        const mapped: Academy[] = data.map((row: Record<string, unknown>) => ({
          id: row.id as string,
          name: row.name as string,
          region: row.region as string,
          style: row.style as string,
          desc: row.desc as string,
          price: row.price as string,
          rating: row.rating as string,
          tags: row.tags as string[],
          image: row.image as string,
          courses: row.courses as Academy["courses"],
          dormitories: row.dormitories as Academy["dormitories"],
        }));
        setAcademies(mapped);
      }
      setLoading(false);
    }

    fetchAcademies();
  }, []);

  return { academies, loading };
}
