import { useState } from "react";
import { CheckCircleIcon, EyeIcon, LoaderIcon } from "lucide-react";
import FileUpload from "@/components/FileUpload";
import { useUploadDocument, useDocumentViewUrl } from "@/hooks/useEnrollment";
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
}

export default function DocumentUploadCard({
  title,
  description,
  enrollmentId,
  documentType,
  existingDocument,
  accept,
}: DocumentUploadCardProps) {
  const uploadMutation = useUploadDocument(enrollmentId);
  const viewUrlMutation = useDocumentViewUrl();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  function handleFileSelect(file: File) {
    uploadMutation.mutate({ file, enrollmentId, documentType });
  }

  const isImage = existingDocument && IMAGE_MIME_TYPES.includes(existingDocument.mime_type);

  async function handlePreview() {
    if (!existingDocument || !isImage) return;

    setPreviewOpen(true);
    setPreviewUrl(null);

    try {
      const viewUrl = await viewUrlMutation.mutateAsync(existingDocument.file_url);
      setPreviewUrl(viewUrl);
    } catch {
      setPreviewOpen(false);
    }
  }

  if (existingDocument) {
    return (
      <div className="rounded-[10px] border border-beige-dark bg-white p-5">
        <h4 className="font-semibold text-brown-dark text-sm mb-1">{title}</h4>
        <p className="text-xs text-muted-foreground mb-3">{description}</p>
        <div
          className={`flex items-center gap-2 p-3 rounded-[10px] border border-green-200 bg-green-50 ${
            isImage ? "cursor-pointer hover:bg-green-100 transition-colors" : ""
          }`}
          onClick={isImage ? handlePreview : undefined}
        >
          <CheckCircleIcon className="w-5 h-5 text-green-600 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800 truncate">
              {existingDocument.file_name}
            </p>
            <p className="text-xs text-green-600">업로드 완료</p>
          </div>
          {isImage && (
            <div className="p-1">
              {viewUrlMutation.isPending ? (
                <LoaderIcon className="w-4 h-4 text-green-600 animate-spin" />
              ) : (
                <EyeIcon className="w-4 h-4 text-green-600" />
              )}
            </div>
          )}
        </div>

        <ImagePreviewModal
          open={previewOpen}
          onOpenChange={setPreviewOpen}
          imageUrl={previewUrl}
          fileName={existingDocument.file_name}
        />
      </div>
    );
  }

  return (
    <div className="rounded-[10px] border border-beige-dark bg-white p-5">
      <h4 className="font-semibold text-brown-dark text-sm mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      <FileUpload
        label={`${title} 업로드`}
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
