import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

// clsx로 조건부 클래스 변환 후 twMerge로 Tailwind 충돌 제거
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
