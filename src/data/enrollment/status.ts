import type { EnrollmentStatus } from "@/types/enrollment";

export const STATUS_CONFIG: Record<
  EnrollmentStatus,
  { label: string; color: string; bgColor: string; order: number; description: string }
> = {
  PENDING: {
    label: "접수 대기",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50 border-yellow-200",
    order: 0,
    description: "수속 신청이 접수되었습니다. 담당자 확인 후 연락드리겠습니다.",
  },
  CONFIRMED: {
    label: "수속 확정",
    color: "text-blue-700",
    bgColor: "bg-blue-50 border-blue-200",
    order: 1,
    description: "수속이 확정되었습니다. 필요 서류를 준비해주세요.",
  },
  DOCUMENTS_PENDING: {
    label: "서류 준비중",
    color: "text-purple-700",
    bgColor: "bg-purple-50 border-purple-200",
    order: 2,
    description: "서류 업로드 및 확인이 진행 중입니다.",
  },
  READY_TO_DEPART: {
    label: "출국 준비 완료",
    color: "text-green-700",
    bgColor: "bg-green-50 border-green-200",
    order: 3,
    description: "모든 준비가 완료되었습니다. 출국 일정을 확인해주세요.",
  },
  COMPLETED: {
    label: "수속 완료",
    color: "text-gray-700",
    bgColor: "bg-gray-50 border-gray-200",
    order: 4,
    description: "모든 수속이 완료되었습니다.",
  },
  CANCELLED: {
    label: "취소됨",
    color: "text-red-700",
    bgColor: "bg-red-50 border-red-200",
    order: -1,
    description: "수속이 취소되었습니다.",
  },
};

export const STATUS_STEPS: EnrollmentStatus[] = ["PENDING", "CONFIRMED", "DOCUMENTS_PENDING", "READY_TO_DEPART"];
