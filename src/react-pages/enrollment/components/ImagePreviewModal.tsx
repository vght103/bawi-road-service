import { useState } from "react";
import { LoaderIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImagePreviewModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  imageUrl: string;
  fileName: string; // alt 텍스트 및 제목으로 사용
}

// 업로드된 이미지를 화면 내에서 바로 확인할 수 있는 모달
// 닫을 때 로딩 상태를 초기화하여 다음에 열 때 스피너가 다시 표시됨
export default function ImagePreviewModal({
  open,
  onOpenChange,
  imageUrl,
  fileName,
}: ImagePreviewModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false); // false: 스피너, true: 이미지 표시

  // 모달 닫힐 때 imageLoaded 초기화
  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setImageLoaded(false);
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[700px] p-0 overflow-hidden bg-white">
        {/* 스크린 리더용 숨겨진 제목 */}
        <DialogTitle className="sr-only">{fileName} 미리보기</DialogTitle>

        <div className="relative flex items-center justify-center min-h-[200px] max-h-[80vh]">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoaderIcon className="w-6 h-6 text-brown animate-spin" />
            </div>
          )}
          {/* 로딩 중: opacity-0, 완료: opacity-100으로 부드럽게 전환 */}
          <img
            src={imageUrl}
            alt={fileName}
            onLoad={() => setImageLoaded(true)}
            className={`max-w-full max-h-[80vh] object-contain transition-opacity ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
