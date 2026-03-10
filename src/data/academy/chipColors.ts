// 학습 시스템 유형별 칩 색상 (스파르타, 세미스파르타, 자율형 등)
export const ACADEMY_SYSTEM_CHIP_COLORS: Record<string, string> = {
  세미스파르타: "bg-accent-green text-white",
  스파르타: "bg-terracotta text-white",
  자율형: "bg-blue-500 text-white",
};

// 코스/태그별 칩 색상 (ESL, IELTS 등)
export const TAG_CHIP_COLORS: Record<string, string> = {
  ESL: "bg-accent-green-light text-accent-green-dark",
  IELTS: "bg-amber-100 text-amber-700",
  TOEIC: "bg-blue-100 text-blue-700",
  TOEFL: "bg-purple-100 text-purple-700",
  비즈니스: "bg-terracotta-light text-terracotta",
  스피킹: "bg-pink-100 text-pink-700",
};

const DEFAULT_ACADEMY_SYSTEM_CHIP = "bg-brown-light text-white"; // 매핑 없는 학습 시스템 기본 색상
const DEFAULT_TAG_CHIP = "bg-beige text-brown"; // 매핑 없는 태그 기본 색상

// 학습 시스템명에 해당하는 칩 색상 클래스 반환
export function getAcademySystemChipClass(academySystem: string): string {
  return ACADEMY_SYSTEM_CHIP_COLORS[academySystem] ?? DEFAULT_ACADEMY_SYSTEM_CHIP;
}

// 태그명에 해당하는 칩 색상 클래스 반환
export function getTagChipClass(tag: string): string {
  return TAG_CHIP_COLORS[tag] ?? DEFAULT_TAG_CHIP;
}
