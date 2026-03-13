import { Loader2 } from "lucide-react";

interface LoadingOverlayProps {
  visible: boolean; // false이면 아무것도 렌더링하지 않음
}

// 전체 화면 로딩 오버레이 — 작업 중 사용자 인터랙션 차단
export default function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <Loader2 className="w-12 h-12 text-white animate-spin" />
    </div>
  );
}
