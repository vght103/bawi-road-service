import bawiLoading from "@/assets/bawi-loading.webp";

interface LoadingOverlayProps {
  visible: boolean;
}

export default function LoadingOverlay({ visible }: LoadingOverlayProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="flex flex-col items-center">
        <img
          src={bawiLoading}
          alt="로딩 중"
          className="w-28 h-28 object-contain"
          width={112}
          height={112}
        />
        <div className="flex items-center gap-1.5 mt-3">
          <span className="loading-dot w-2 h-2 bg-white rounded-full" />
          <span className="loading-dot w-2 h-2 bg-white rounded-full" />
          <span className="loading-dot w-2 h-2 bg-white rounded-full" />
        </div>
      </div>
    </div>
  );
}
