import { useQuery } from "@tanstack/react-query";
import type { Enrollment, EnrollmentDocument } from "@/types/enrollment";
import { fetchEnrollment } from "@/api/enrollment/enrollments";
import { fetchDocuments } from "@/api/enrollment/documents";

export function useEnrollment(id: string | undefined) {
  const {
    data,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["enrollment", id],
    queryFn: async () => {
      const enrollmentResult = await fetchEnrollment(id!);
      if (enrollmentResult.error) throw new Error(enrollmentResult.error);

      let documents: EnrollmentDocument[] = [];
      if (enrollmentResult.data) {
        const docsResult = await fetchDocuments(id!);
        documents = docsResult.data;
      }

      return {
        enrollment: enrollmentResult.data,
        documents,
      };
    },
    enabled: !!id,
  });

  const enrollment: Enrollment | null = data?.enrollment ?? null;
  const documents: EnrollmentDocument[] = data?.documents ?? [];
  const error = queryError instanceof Error ? queryError.message : null;

  return { enrollment, documents, loading, error };
}
