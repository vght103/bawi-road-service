// 어학원이 제공하는 개별 코스 정보
export interface Course {
  name: string;          // 코스명
  category: string;      // 분류 (ESL, IELTS, TOEIC 등)
  manToMan: number;      // 1:1 수업 시간/주
  group: number;         // 그룹 수업 시간/주
  optional: number;      // 선택 수업 시간/주
  pricePerWeek: number;  // 주당 수업료 (KRW)
  desc: string;
}

// 어학원 기숙사 옵션 정보
export interface Dormitory {
  type: string;          // 기숙사 종류 (1인실, 2인실, 홈스테이 등)
  pricePerWeek: number;  // 주당 숙소비 (KRW)
  meals: string;         // 식사 제공 방식
  desc: string;
}

// 어학원 기본 정보 (목록/카드용)
export interface Academy {
  id: string;
  name: string;
  region: string;        // 세부, 바기오, 마닐라 등
  academy_system: string; // 스파르타, 세미스파르타, 자율형 등
  desc: string;
  tags: string[];        // ESL, IELTS, 스피킹 등
  images: string[];      // 첫 번째가 대표 이미지
  courses: Course[];
  dormitories: Dormitory[];
  established_year?: number;
  capacity?: number;
  korean_ratio?: string;
  location_detail?: string;
  website?: string;
}

// 어학원 상세 정보 (상세 페이지 전용 추가 필드)
export interface AcademyDetail extends Academy {
  address?: string;
  shortDesc?: string;        // 한 줄 소개
  description?: string;      // 긴 소개 문단
  facilities?: string[];
  pros?: string[];
  cons?: string[];
  recommendedFor?: string[];
}
