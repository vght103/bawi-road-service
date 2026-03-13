import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Enrollment, EnrollmentDocument, DocumentType } from "@/types/enrollment";
import { fetchEnrollmentWithDocuments } from "@/api/enrollment/enrollments";
import {
  uploadDocumentToR2,
  saveDocumentRecord,
} from "@/api/enrollment/documents";
import { getUploadPresignedUrl, deleteDocumentFromR2 } from "@/api/storage/presign";
import { compressIfImage } from "@/lib/imageCompression";

const R2_PUBLIC_URL = import.meta.env.PUBLIC_R2_PUBLIC_URL as string; // 업로드 파일 공개 URL 기반

// 수강 신청 정보와 첨부 서류 목록을 조회하는 훅
export function useEnrollment(id: string | undefined) {
  const {
    data,
    isLoading: loading,
    error: queryError,
  } = useQuery({
    queryKey: ["enrollment", id],
    queryFn: async () => {
      const result = await fetchEnrollmentWithDocuments(id!);
      if (result.error) throw new Error(result.error);
      return result.data;
    },
    enabled: !!id,
  });

  const enrollment: Enrollment | null = data ?? null;
  const documents: EnrollmentDocument[] = data?.documents ?? [];
  const error = queryError instanceof Error ? queryError.message : null;

  return { enrollment, documents, loading, error };
}

interface UploadDocumentParams {
  file: File;
  enrollmentId: string;
  documentType: DocumentType;
  existingDocumentId?: string; // 교체 시 기존 서류 ID
}

// 서류 파일을 R2에 업로드하고 DB에 기록하는 훅 (이미지 압축 + Presigned URL 병렬 처리)
export function useUploadDocument(enrollmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ file, enrollmentId, documentType, existingDocumentId }: UploadDocumentParams) => {
      // 이미지 압축과 Presigned URL 발급을 병렬 처리
      const [compressed, presignResult] = await Promise.all([
        compressIfImage(file),
        getUploadPresignedUrl({
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type,
          enrollmentId,
        }),
      ]);

      if (presignResult.error || !presignResult.data) {
        throw new Error(presignResult.error ?? "Presigned URL 발급에 실패했습니다.");
      }

      const { uploadUrl, objectKey } = presignResult.data;

      const uploadResult = await uploadDocumentToR2(compressed, uploadUrl);
      if (uploadResult.error) {
        throw new Error(uploadResult.error);
      }

      const publicFileUrl = `${R2_PUBLIC_URL}/${objectKey}`;
      const saveResult = await saveDocumentRecord({
        enrollment_id: enrollmentId,
        document_type: documentType,
        uploaded_by: "STUDENT",
        file_name: file.name,
        file_url: publicFileUrl,
        file_size: compressed.size,
        mime_type: compressed.type,
      });

      if (saveResult.error || !saveResult.data) {
        throw new Error(saveResult.error ?? "문서 정보 저장에 실패했습니다.");
      }

      // 교체 시 기존 파일 삭제. 실패해도 업로드 흐름 중단하지 않음
      if (existingDocumentId) {
        await deleteDocumentFromR2(existingDocumentId).catch(() => {});
      }

      return saveResult.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", enrollmentId] });
    },
  });
}

interface DeleteDocumentParams {
  documentId: string;
}

// R2 파일과 DB 레코드를 함께 삭제하는 훅
export function useDeleteDocument(enrollmentId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ documentId }: DeleteDocumentParams) => {
      const result = await deleteDocumentFromR2(documentId);
      if (result.error) {
        throw new Error(result.error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enrollment", enrollmentId] });
    },
  });
}
