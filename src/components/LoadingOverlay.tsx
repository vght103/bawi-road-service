import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  visible: boolean;
}

export default function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  );
}
