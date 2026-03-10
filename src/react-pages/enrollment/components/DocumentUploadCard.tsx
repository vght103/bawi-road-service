import { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { CheckCircleIcon, EyeIcon, Trash2Icon } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import type { DocumentType, EnrollmentDocument } from "@/types/enrollment";
import ImagePreviewModal from "./ImagePreviewModal";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"]; // 이미지로 간주할 MIME 타입

interface DocumentUploadCardProps {
  title: string; // 카드 제목 (예: "항공권")
  description: string; // 카드 설명
  enrollmentId: string; // 이 서류가 속한 수속 신청 ID
  documentType: DocumentType; // 서류 종류 코드
  existingDocument?: EnrollmentDocument; // 이미 업로드된 서류 (없으면 undefined)
  accept?: string; // 허용 파일 확장자
  uploadMutation: UseMutationResult<EnrollmentDocument, Error, { file: File; enrollmentId: string; documentType: DocumentType; existingDocumentId?: string }>;
  deleteMutation: UseMutationResult<void, Error, { documentId: string }>;
}

// 수속 서류 업로드 카드 — 서류 없으면 업로드 영역, 있으면 완료 상태 + 재업로드 영역 표시
export default function DocumentUploadCard({
  title,
  description,
  enrollmentId,
  documentType,
  existingDocument,
  accept,
  uploadMutation,
  deleteMutation,
}: DocumentUploadCardProps) {
  const [previewOpen, setPreviewOpen] = useState(false); // 이미지 미리보기 모달 상태

  // 파일 선택 시 즉시 업로드 (기존 서류가 있으면 덮어쓰기)
  function handleFileSelect(file: File) {
    uploadMutation.mutate({
      file,
      enrollmentId,
      documentType,
      existingDocumentId: existingDocument?.id,
    });
  }

  const isImage = existingDocument && IMAGE_MIME_TYPES.includes(existingDocument.mime_type); // 미리보기 버튼 표시 여부

  // 삭제 확인 후 서버에서 제거
  function handleDelete() {
    if (!existingDocument) return;
    if (!window.confirm("업로드된 파일을 삭제하시겠습니까?")) return;

    deleteMutation.mutate({
      documentId: existingDocument.id,
    });
  }

  // 서류가 있는 경우: 완료 상태 UI
  if (existingDocument) {
    return (
      <div className="rounded-[10px] border border-beige-dark bg-white p-5">
        <h4 className="font-semibold text-brown-dark text-sm mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>

        <div className="flex items-center gap-2 p-3 rounded-[10px] border border-green-200 bg-green-50">
          <div
            className={`flex items-center gap-2 flex-1 min-w-0 ${
              isImage ? "cursor-pointer" : ""
            }`}
            onClick={isImage ? () => setPreviewOpen(true) : undefined}
          >
            <CheckCircleIcon className="w-5 h-5 text-green-600 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-green-800 truncate">
                {existingDocument.file_name}
              </p>
              <p className="text-xs text-green-600">업로드 완료</p>
            </div>
          </div>

          {/* 미리보기(이미지만) / 삭제 버튼 */}
          <div className="flex items-center gap-1 shrink-0">
            {isImage && (
              <button
                type="button"
                onClick={() => setPreviewOpen(true)}
                className="p-1.5 rounded-full hover:bg-green-100 transition-colors"
              >
                <EyeIcon className="w-4 h-4 text-green-600" />
              </button>
            )}
            <button
              type="button"
              onClick={handleDelete}
              className="p-1.5 rounded-full hover:bg-red-100 transition-colors"
            >
              <Trash2Icon className="w-4 h-4 text-red-400 hover:text-red-600" />
            </button>
          </div>
        </div>

        {isImage && (
          <ImagePreviewModal
            open={previewOpen}
            onOpenChange={setPreviewOpen}
            imageUrl={existingDocument.file_url}
            fileName={existingDocument.file_name}
          />
        )}

        {/* 서류가 있어도 재업로드(교체) 가능 */}
        <div className="mt-3">
          <FileUpload
            label="파일 업로드"
            accept={accept}
            onFileSelect={handleFileSelect}
            uploading={uploadMutation.isPending}
            disabled={uploadMutation.isPending}
            compact
          />
        </div>
      </div>
    );
  }

  // 서류가 없는 경우: 기본 업로드 영역
  return (
    <div className="rounded-[10px] border border-beige-dark bg-white p-5">
      <h4 className="font-semibold text-brown-dark text-sm mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      <FileUpload
        label="파일 업로드"
        accept={accept}
        onFileSelect={handleFileSelect}
        uploading={uploadMutation.isPending}
        disabled={uploadMutation.isPending}
      />
      {uploadMutation.isError && (
        <p className="text-terracotta text-xs mt-2">
          {uploadMutation.error instanceof Error
            ? uploadMutation.error.message
            : "업로드에 실패했습니다."}
        </p>
      )}
    </div>
  );
}
