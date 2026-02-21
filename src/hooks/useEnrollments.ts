import { useState, useEffect } from "react";
import type { Enrollment } from "@/types/enrollment";
import { fetchMyEnrollments } from "@/api/enrollment/enrollments";

export function useEnrollments(userId: string | undefined) {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);
      const result = await fetchMyEnrollments(userId!);
      setEnrollments(result.data);
      setError(result.error);
      setLoading(false);
    }

    load();
  }, [userId]);

  return { enrollments, loading, error };
}
