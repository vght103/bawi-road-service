import { useState, useEffect } from "react";
import type { Enrollment } from "@/types/enrollment";
import type { EnrollmentDocument } from "@/types/enrollment";
import { fetchEnrollment } from "@/api/enrollment/enrollments";
import { fetchDocuments } from "@/api/enrollment/documents";

export function useEnrollment(id: string | undefined) {
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [documents, setDocuments] = useState<EnrollmentDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function load() {
      setLoading(true);

      const enrollmentResult = await fetchEnrollment(id!);
      if (enrollmentResult.error) {
        setError(enrollmentResult.error);
        setLoading(false);
        return;
      }
      setEnrollment(enrollmentResult.data);

      if (enrollmentResult.data) {
        const docsResult = await fetchDocuments(id!);
        setDocuments(docsResult.data);
      }

      setLoading(false);
    }

    load();
  }, [id]);

  return { enrollment, documents, loading, error };
}
