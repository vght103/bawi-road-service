import { useState } from "react";
import type { UseMutationResult } from "@tanstack/react-query";
import { CheckCircleIcon, EyeIcon, Trash2Icon } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import type { DocumentType, EnrollmentDocument } from "@/types/enrollment";
import ImagePreviewModal from "./ImagePreviewModal";

const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface DocumentUploadCardProps {
  title: string;
  description: string;
  enrollmentId: string;
  documentType: DocumentType;
  existingDocument?: EnrollmentDocument;
  accept?: string;
  uploadMutation: UseMutationResult<EnrollmentDocument, Error, { file: File; enrollmentId: string; documentType: DocumentType; existingDocumentId?: string }>;
  deleteMutation: UseMutationResult<void, Error, { documentId: string }>;
}

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
  const [previewOpen, setPreviewOpen] = useState(false);

  function handleFileSelect(file: File) {
    uploadMutation.mutate({
      file,
      enrollmentId,
      documentType,
      existingDocumentId: existingDocument?.id,
    });
  }

  const isImage = existingDocument && IMAGE_MIME_TYPES.includes(existingDocument.mime_type);

  function handleDelete() {
    if (!existingDocument) return;
    if (!window.confirm("업로드된 파일을 삭제하시겠습니까?")) return;

    deleteMutation.mutate({
      documentId: existingDocument.id,
    });
  }

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
