import { useState, useRef } from "react";
import { UploadIcon, XIcon, FileIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  label: string;              // 업로드 영역 안내 문구
  accept?: string;            // 허용 파일 형식 (기본: PDF, JPG, PNG)
  maxSizeMB?: number;         // 최대 파일 크기 (MB, 기본: 10)
  onFileSelect?: (file: File) => void;
  onFileRemove?: () => void;
  disabled?: boolean;
  uploading?: boolean;        // true이면 스피너 표시
  compact?: boolean;          // true이면 한 줄짜리 작은 버튼 레이아웃
  className?: string;
}

// 파일 선택 전 점선 버튼 → 선택 후 파일명/크기 + 삭제 버튼 표시
// compact 모드: 파일 선택 후 UI를 별도 표시하지 않고 부모가 상태 관리
export default function FileUpload({
  label,
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSizeMB = 10,
  onFileSelect,
  onFileRemove,
  disabled = false,
  uploading = false,
  compact = false,
  className,
}: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // 파일 선택 핸들러 — 크기 검증 후 부모에 전달, input value 초기화
  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setError(null);

    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`파일 크기는 ${maxSizeMB}MB 이하여야 합니다.`);
      return;
    }

    if (!compact) {
      setSelectedFile(file);
    }
    onFileSelect?.(file);
    // 동일한 파일을 다시 선택할 수 있도록 input 값을 초기화
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  // 파일 제거 핸들러 — 로컬 상태 초기화 후 onFileRemove 호출
  function handleRemove() {
    setSelectedFile(null);
    setError(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    onFileRemove?.();
  }

  // 바이트를 읽기 좋은 크기 문자열로 변환 (B / KB / MB)
  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes}B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
  }

  return (
    <div className={cn("space-y-2", className)}>
      {/* 숨겨진 파일 input — 버튼 클릭 시 프로그래밍 방식으로 열림 */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        className="hidden"
      />

      {/* 파일 선택 후: 파일명 + 크기 표시, 업로드 중이면 스피너 */}
      {selectedFile ? (
        <div className="flex items-center gap-3 p-3 rounded-[10px] border border-beige-dark bg-white">
          {uploading ? (
            <div className="w-5 h-5 border-2 border-brown/30 border-t-brown rounded-full animate-spin shrink-0" />
          ) : (
            <FileIcon className="w-5 h-5 text-brown shrink-0" />
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-brown-dark truncate">
              {selectedFile.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {uploading ? "업로드 중..." : formatFileSize(selectedFile.size)}
            </p>
          </div>
          {/* 업로드 중 삭제 버튼 숨김 */}
          {!uploading && (
            <button
              type="button"
              onClick={handleRemove}
              className="p-1 rounded-full hover:bg-beige transition-colors"
              disabled={disabled}
            >
              <XIcon className="w-4 h-4 text-brown" />
            </button>
          )}
        </div>
      ) : (
        /* 파일 선택 전: 점선 버튼 */
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={disabled || uploading}
          className={cn(
            "w-full rounded-[10px] border-2 border-dashed transition-all",
            compact ? "p-3" : "p-6 text-center",
            disabled
              ? "border-gray-200 bg-gray-50 cursor-not-allowed"
              : "border-beige-dark hover:border-brown/30 hover:bg-beige/30 cursor-pointer"
          )}
        >
          {compact ? (
            /* compact: 아이콘 + 라벨 한 줄 */
            <div className="flex items-center justify-center gap-2">
              <UploadIcon className="w-4 h-4 text-brown/50" />
              <p className="text-xs font-medium text-brown-dark">{label}</p>
            </div>
          ) : (
            /* 일반: 큰 아이콘 + 라벨 + 허용 형식 안내 */
            <>
              <UploadIcon className="w-8 h-8 text-brown/50 mx-auto mb-2" />
              <p className="text-sm font-medium text-brown-dark">{label}</p>
              <p className="text-xs text-muted-foreground mt-1">
                PDF, JPG, PNG (최대 {maxSizeMB}MB)
              </p>
            </>
          )}
        </button>
      )}

      {/* 파일 검증 에러 (크기 초과 등) */}
      {error && <p className="text-terracotta text-xs">{error}</p>}
    </div>
  );
}
