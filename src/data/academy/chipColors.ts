/** 어학원 학습 스타일 칩 색상 */
export const STYLE_CHIP_COLORS: Record<string, string> = {
  세미스파르타: "bg-accent-green text-white",
  스파르타: "bg-terracotta text-white",
};

/** 코스/태그 칩 색상 */
export const TAG_CHIP_COLORS: Record<string, string> = {
  ESL: "bg-accent-green-light text-accent-green-dark",
  IELTS: "bg-amber-100 text-amber-700",
  TOEIC: "bg-blue-100 text-blue-700",
  TOEFL: "bg-purple-100 text-purple-700",
  비즈니스: "bg-terracotta-light text-terracotta",
  스피킹: "bg-pink-100 text-pink-700",
};

const DEFAULT_STYLE_CHIP = "bg-brown-light text-white";
const DEFAULT_TAG_CHIP = "bg-beige text-brown";

export function getStyleChipClass(style: string): string {
  return STYLE_CHIP_COLORS[style] ?? DEFAULT_STYLE_CHIP;
}

export function getTagChipClass(tag: string): string {
  return TAG_CHIP_COLORS[tag] ?? DEFAULT_TAG_CHIP;
}
