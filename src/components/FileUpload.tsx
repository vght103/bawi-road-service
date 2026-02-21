import { useState, useRef } from "react";
import { UploadIcon, XIcon, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;
  accept?: string;
  maxSizeMB?: number;
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
  disabled?: boolean;
  className?: string;
}

export default function FileUpload({
  label,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSizeMB = 10,
  onFileSelect,
  onFileRemove,
  disabled = false,
  className,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
      return;
    }

    setSelectedFile(file);
    onFileSelect?.(file);
  }

  function handleRemove() {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFileRemove?.();
  }

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {selectedFile ? (
        <div className="flex items-center gap-3 p-3 rounded-[10px] border border-beige-dark bg-white">
          <FileIcon className="w-5 h-5 text-brown shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-brown-dark truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(selectedFile.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleRemove}
            className="p-1 rounded-full hover:bg-beige transition-colors"
            disabled={disabled}
          >
            <XIcon className="w-4 h-4 text-brown" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled}
          className={cn(
            "w-full p-6 rounded-[10px] border-2 border-dashed transition-all text-center",
            disabled
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-beige-dark hover:border-brown/30 hover:bg-beige/30 cursor-pointer"
          )}
        >
          <UploadIcon className="w-8 h-8 text-brown/50 mx-auto mb-2" />
          <p className="text-sm font-medium text-brown-dark">{label}</p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, JPG, PNG (최대 {maxSizeMB}MB)
          </p>
        </button>
      )}

      {error && <p className="text-terracotta text-xs">{error}</p>}
    </div>
  );
}
