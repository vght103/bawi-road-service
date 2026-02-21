import { FileTextIcon, DownloadIcon } from "lucide-react";
import type { EnrollmentDocument } from "@/types/enrollment";

interface DocumentViewCardProps {
  title: string;
  description: string;
  document: EnrollmentDocument | undefined;
}

function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

export default function DocumentViewCard({
  title,
  description,
  document,
}: DocumentViewCardProps) {
  return (
    <div className="rounded-[10px] border border-beige-dark bg-white p-5">
      <h4 className="font-semibold text-brown-dark text-sm mb-1">{title}</h4>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>

      {document ? (
        <div className="flex items-center gap-3 p-3 rounded-[10px] border border-beige-dark bg-beige/30">
          <FileTextIcon className="w-5 h-5 text-brown shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-brown-dark truncate">{document.file_name}</p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(document.file_size)} · {new Date(document.created_at).toLocaleDateString("ko-KR")}
            </p>
          </div>
          <a
            href={document.file_url}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-full hover:bg-beige transition-colors"
          >
            <DownloadIcon className="w-4 h-4 text-brown" />
          </a>
        </div>
      ) : (
        <div className="p-4 rounded-[10px] border border-dashed border-beige-dark text-center">
          <FileTextIcon className="w-6 h-6 text-muted-foreground/50 mx-auto mb-1" />
          <p className="text-xs text-muted-foreground">아직 업로드된 문서가 없습니다</p>
        </div>
      )}
    </div>
  );
}
