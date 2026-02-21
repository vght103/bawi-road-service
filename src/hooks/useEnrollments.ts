import { useQuery } from "@tanstack/react-query";
import type { Enrollment } from "@/types/enrollment";
import { fetchMyEnrollments } from "@/api/enrollment/enrollments";

export function useEnrollments(userId: string | undefined) {
  const {
    data,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["enrollments", userId],
    queryFn: async () => {
      const result = await fetchMyEnrollments(userId!);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: !!userId,
  });

  const enrollments: Enrollment[] = data ?? [];
  const error = queryError instanceof Error ? queryError.message : null;

  return { enrollments, loading, error };
}
