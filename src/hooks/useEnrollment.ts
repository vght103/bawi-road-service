import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Enrollment, EnrollmentDocument, DocumentType } from "@/types/enrollment";
import { fetchEnrollment } from "@/api/enrollment/enrollments";
import {
  fetchDocuments,
  uploadDocumentToR2,
  saveDocumentRecord,
} from "@/api/enrollment/documents";
import { getUploadPresignedUrl, getViewPresignedUrl } from "@/api/storage/presign";
import { compressIfImage } from "@/lib/imageCompression";

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

interface UploadDocumentParams {
  file: File;
  enrollmentId: string;
  documentType: DocumentType;
}

export function useUploadDocument(enrollmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, enrollmentId, documentType }: UploadDocumentParams) => {
      // 1. Compress image if needed
      const compressed = await compressIfImage(file);

      // 2. Get presigned upload URL
      const presignResult = await getUploadPresignedUrl({
        fileName: compressed.name,
        fileSize: compressed.size,
        mimeType: compressed.type,
        enrollmentId,
      });

      if (presignResult.error || !presignResult.data) {
        throw new Error(presignResult.error ?? "Presigned URL 발급에 실패했습니다.");
      }

      const { uploadUrl, objectKey } = presignResult.data;

      // 3. Upload to R2
      const uploadResult = await uploadDocumentToR2(compressed, uploadUrl);
      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      // 4. Save record in DB
      const saveResult = await saveDocumentRecord({
        enrollment_id: enrollmentId,
        document_type: documentType,
        uploaded_by: "STUDENT",
        file_name: file.name,
        file_url: objectKey,
        file_size: compressed.size,
        mime_type: compressed.type,
      });

      if (saveResult.error || !saveResult.data) {
        throw new Error(saveResult.error ?? "문서 정보 저장에 실패했습니다.");
      }

      return saveResult.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", enrollmentId] });
    },
  });
}

export function useDocumentViewUrl() {
  return useMutation({
    mutationFn: async (objectKey: string) => {
      const result = await getViewPresignedUrl(objectKey);

      if (result.error || !result.data) {
        throw new Error(result.error ?? "문서 URL 발급에 실패했습니다.");
      }

      return result.data.viewUrl;
    },
  });
}
