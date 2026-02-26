export interface Course {
  name: string; // 코스명
  category: string; // 카테고리 (ESL, IELTS, TOEIC 등)
  manToMan: number; // 1:1 수업 시간
  group: number; // 그룹 수업 시간
  optional: number; // 선택 수업 시간
  pricePerWeek: number; // 주당 수업료 (KRW)
  desc: string; // 코스 설명
}

export interface Dormitory {
  type: string; // 기숙사 타입 (1인실, 2인실 등)
  pricePerWeek: number; // 주당 숙소비 (KRW)
  meals: string; // 식사 포함 여부 (주 3식 등)
  desc: string; // 기숙사 설명
}

export interface Academy {
  id: string; // 어학원 고유 ID ("1", "2", ...)
  name: string; // 어학원명
  region: string; // 지역 (세부, 바기오 등)
  academy_system: string; // 학습 시스템 (스파르타, 세미스파르타)
  desc: string; // 어학원 소개 설명
  tags: string[]; // 태그 목록 (ESL, IELTS 등)
  images: string[]; // 이미지 URL 목록 (첫 번째가 대표)
  courses: Course[]; // 제공 코스 목록
  dormitories: Dormitory[]; // 기숙사 옵션 목록
  established_year?: number;
  capacity?: number;
  korean_ratio?: string;
  location_detail?: string;
  website?: string;
}

export interface AcademyDetail extends Academy {
  address?: string;
  shortDesc?: string;
  description?: string;
  facilities?: string[];
  pros?: string[];
  cons?: string[];
  recommendedFor?: string[];
}
