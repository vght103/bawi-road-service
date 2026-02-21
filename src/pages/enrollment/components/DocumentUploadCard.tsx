import FileUpload from "@/components/FileUpload";

interface DocumentUploadCardProps {
  title: string;
  description: string;
  accept?: string;
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
  disabled?: boolean;
}

export default function DocumentUploadCard({
  title,
  description,
  accept,
  onFileSelect,
  onFileRemove,
  disabled = false,
}: DocumentUploadCardProps) {
  return (
    <div className="rounded-[10px] border border-beige-dark bg-white p-5">
      <h4 className="font-semibold text-brown-dark text-sm mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      <FileUpload
        label={`${title} 업로드`}
        accept={accept}
        onFileSelect={onFileSelect}
        onFileRemove={onFileRemove}
        disabled={disabled}
      />
    </div>
  );
}
