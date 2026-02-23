import { LoaderIcon } from "lucide-react";

interface LoadingOverlayProps {
  visible: boolean;
  message?: string;
}

export default function LoadingOverlay({ visible, message }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="bg-white rounded-2xl px-8 py-6 shadow-xl flex flex-col items-center gap-3">
        <LoaderIcon className="w-8 h-8 text-brown animate-spin" />
        {message && (
          <p className="text-sm text-brown-dark font-medium">{message}</p>
        )}
      </div>
    </div>
  );
}
