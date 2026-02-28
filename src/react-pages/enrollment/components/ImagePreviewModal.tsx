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
  fileName: string;
}

export default function ImagePreviewModal({
  open,
  onOpenChange,
  imageUrl,
  fileName,
}: ImagePreviewModalProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (!nextOpen) {
      setImageLoaded(false);
    }
    onOpenChange(nextOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[90vw] md:max-w-[700px] p-0 overflow-hidden bg-white">
        <DialogTitle className="sr-only">{fileName} 미리보기</DialogTitle>
        <div className="relative flex items-center justify-center min-h-[200px] max-h-[80vh]">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <LoaderIcon className="w-6 h-6 text-brown animate-spin" />
            </div>
          )}
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
