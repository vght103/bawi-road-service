export interface Course {
  name: string;         // 코스명
  category: string;     // 카테고리 (ESL, IELTS, TOEIC 등)
  manToMan: number;     // 1:1 수업 시간
  group: number;        // 그룹 수업 시간
  optional: number;     // 선택 수업 시간
  pricePerWeek: number; // 주당 수업료 (USD)
  desc: string;         // 코스 설명
}

export interface Dormitory {
  type: string;         // 기숙사 타입 (1인실, 2인실 등)
  pricePerWeek: number; // 주당 숙소비 (USD)
  meals: string;        // 식사 포함 여부 (주 3식 등)
  desc: string;         // 기숙사 설명
}

export interface Academy {
  id: string;              // 어학원 고유 ID ("1", "2", ...)
  name: string;            // 어학원명
  region: string;          // 지역 (세부, 바기오 등)
  style: string;           // 학습 스타일 (스파르타, 세미스파르타)
  desc: string;            // 어학원 소개 설명
  price: string;           // 대표 가격 표시용 ("$1,350")
  rating: string;          // 평점 ("4.5")
  tags: string[];          // 태그 목록 (ESL, IELTS 등)
  image: string;           // 대표 이미지 URL
  courses: Course[];       // 제공 코스 목록
  dormitories: Dormitory[];// 기숙사 옵션 목록
}

export const academies: Academy[] = [
  {
    id: "smeag",
    name: "SMEAG Capital",
    region: "세부",
    style: "스파르타",
    desc: "세부 최대 규모 어학원. IELTS, TOEIC 공인시험 센터를 보유하고 있어 시험 준비에 최적화된 환경.",
    price: "$1,350",
    rating: "4.5",
    tags: ["ESL", "IELTS", "TOEIC"],
    image: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80",
    courses: [
      { name: "ESL General", category: "ESL", manToMan: 4, group: 3, optional: 1, pricePerWeek: 150, desc: "기본 ESL 과정. 1:1 수업 4시간 + 그룹 3시간." },
      { name: "ESL Intensive", category: "ESL", manToMan: 6, group: 2, optional: 1, pricePerWeek: 180, desc: "집중 ESL 과정. 1:1 수업 6시간으로 빠른 실력 향상." },
      { name: "IELTS Preparation", category: "IELTS", manToMan: 4, group: 4, optional: 0, pricePerWeek: 200, desc: "IELTS 시험 대비 과정. 실전 모의시험 + 집중 피드백." },
      { name: "TOEIC Intensive", category: "TOEIC", manToMan: 4, group: 3, optional: 1, pricePerWeek: 180, desc: "TOEIC 집중 과정. 파트별 전략 학습 + 매주 실전 모의시험." },
    ],
    dormitories: [
      { type: "1인실", pricePerWeek: 200, meals: "주 3식", desc: "개인 공간에서 집중 학습" },
      { type: "2인실", pricePerWeek: 150, meals: "주 3식", desc: "합리적인 가격, 룸메이트와 함께" },
      { type: "3인실", pricePerWeek: 120, meals: "주 3식", desc: "가장 경제적인 옵션" },
      { type: "4인실", pricePerWeek: 100, meals: "주 3식", desc: "최저가, 다양한 친구와 교류" },
    ],
  },
  {
    id: "cpi",
    name: "CPI (Cebu Pelis Institute)",
    region: "세부",
    style: "세미스파르타",
    desc: "리조트형 캠퍼스로 수영장, 헬스장 등 시설이 뛰어남. ESL 과정이 강하며 쾌적한 학습 환경 제공.",
    price: "$1,480",
    rating: "4.7",
    tags: ["ESL", "스피킹"],
    image: "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80",
    courses: [
      { name: "ESL Intensive", category: "ESL", manToMan: 5, group: 2, optional: 1, pricePerWeek: 170, desc: "집중 ESL 과정. 1:1 5시간 + 그룹 2시간 구성." },
      { name: "ESL Light", category: "ESL", manToMan: 4, group: 1, optional: 2, pricePerWeek: 145, desc: "여유로운 ESL 과정. 자습 시간을 충분히 확보." },
      { name: "Power Speaking", category: "스피킹", manToMan: 6, group: 1, optional: 1, pricePerWeek: 195, desc: "스피킹 집중 과정. 1:1 6시간으로 회화 실력 극대화." },
      { name: "IELTS General", category: "IELTS", manToMan: 4, group: 3, optional: 1, pricePerWeek: 185, desc: "IELTS 대비 과정. 기초부터 실전까지." },
    ],
    dormitories: [
      { type: "1인실", pricePerWeek: 220, meals: "주 3식", desc: "프라이빗 공간, 리조트급 시설" },
      { type: "2인실", pricePerWeek: 170, meals: "주 3식", desc: "쾌적한 2인 공간" },
      { type: "3인실", pricePerWeek: 140, meals: "주 3식", desc: "가성비 좋은 3인실" },
    ],
  },
  {
    id: "pines",
    name: "PINES Main",
    region: "바기오",
    style: "스파르타",
    desc: "바기오의 명문 스파르타 어학원. 시원한 기후와 집중적인 커리큘럼으로 단기간 실력 향상에 최적.",
    price: "$1,200",
    rating: "4.4",
    tags: ["ESL", "IELTS"],
    image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
    courses: [
      { name: "Power ESL", category: "ESL", manToMan: 4, group: 4, optional: 0, pricePerWeek: 140, desc: "기본 ESL 과정. 균형 잡힌 수업 구성." },
      { name: "Premium ESL", category: "ESL", manToMan: 5, group: 2, optional: 1, pricePerWeek: 165, desc: "프리미엄 ESL. 1:1 수업 강화 버전." },
      { name: "IELTS 보장반", category: "IELTS", manToMan: 4, group: 4, optional: 0, pricePerWeek: 190, desc: "IELTS 점수 보장반. 12주 이상 등록 시 점수 보장." },
      { name: "TOEIC 집중반", category: "TOEIC", manToMan: 4, group: 3, optional: 1, pricePerWeek: 165, desc: "TOEIC 단기 점수 향상 과정." },
    ],
    dormitories: [
      { type: "2인실", pricePerWeek: 130, meals: "주 3식", desc: "기본 2인실, 쾌적한 환경" },
      { type: "4인실", pricePerWeek: 95, meals: "주 3식", desc: "경제적인 4인실" },
      { type: "6인실", pricePerWeek: 75, meals: "주 3식", desc: "최저가 옵션, 친구 사귀기 좋음" },
    ],
  },
  {
    id: "ev",
    name: "EV Academy",
    region: "세부",
    style: "세미스파르타",
    desc: "세부 시내 위치. 깔끔한 신축 캠퍼스와 체계적인 커리큘럼으로 인기가 많은 어학원.",
    price: "$1,400",
    rating: "4.6",
    tags: ["ESL", "IELTS", "비즈니스"],
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
    courses: [
      { name: "ESL Classic", category: "ESL", manToMan: 4, group: 2, optional: 2, pricePerWeek: 155, desc: "클래식 ESL 과정. 자율학습 시간 포함." },
      { name: "ESL Intensive", category: "ESL", manToMan: 6, group: 2, optional: 0, pricePerWeek: 185, desc: "집중 ESL. 1:1 6시간으로 빠른 향상." },
      { name: "IELTS Preparation", category: "IELTS", manToMan: 4, group: 4, optional: 0, pricePerWeek: 195, desc: "IELTS 대비 과정. 매주 모의시험 제공." },
      { name: "Business English", category: "비즈니스", manToMan: 4, group: 2, optional: 2, pricePerWeek: 175, desc: "비즈니스 영어. 프레젠테이션, 이메일, 회의 영어." },
    ],
    dormitories: [
      { type: "1인실", pricePerWeek: 210, meals: "주 3식", desc: "신축 시설, 개인 공간" },
      { type: "2인실", pricePerWeek: 160, meals: "주 3식", desc: "깔끔한 2인 룸" },
      { type: "4인실", pricePerWeek: 110, meals: "주 3식", desc: "합리적인 가격의 4인실" },
    ],
  },
  {
    id: "cia",
    name: "CIA Academy",
    region: "세부",
    style: "세미스파르타",
    desc: "막탄 신캠퍼스로 이전. 바다 근처 리조트 캠퍼스에서 학습과 여가를 동시에 즐길 수 있음.",
    price: "$1,420",
    rating: "4.5",
    tags: ["ESL", "TOEFL", "TOEIC"],
    image: "https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80",
    courses: [
      { name: "ESL Regular", category: "ESL", manToMan: 4, group: 2, optional: 2, pricePerWeek: 155, desc: "기본 ESL 과정. 균형 잡힌 커리큘럼." },
      { name: "ESL Intensive", category: "ESL", manToMan: 5, group: 3, optional: 0, pricePerWeek: 180, desc: "집중 ESL. 1:1 5시간 + 그룹 3시간." },
      { name: "TOEFL Preparation", category: "TOEFL", manToMan: 4, group: 4, optional: 0, pricePerWeek: 200, desc: "TOEFL 시험 대비. 영역별 집중 학습." },
      { name: "TOEIC 집중반", category: "TOEIC", manToMan: 4, group: 3, optional: 1, pricePerWeek: 175, desc: "TOEIC 점수 향상 과정." },
      { name: "IELTS 과정", category: "IELTS", manToMan: 4, group: 4, optional: 0, pricePerWeek: 195, desc: "IELTS 준비 과정. 실전 모의시험 포함." },
    ],
    dormitories: [
      { type: "1인실", pricePerWeek: 215, meals: "주 3식", desc: "오션뷰 가능, 프라이빗" },
      { type: "2인실", pricePerWeek: 165, meals: "주 3식", desc: "쾌적한 2인실" },
      { type: "3인실", pricePerWeek: 130, meals: "주 3식", desc: "합리적인 가격" },
      { type: "4인실", pricePerWeek: 105, meals: "주 3식", desc: "경제적인 다인실" },
    ],
  },
  {
    id: "beci",
    name: "BECI Main",
    region: "바기오",
    style: "세미스파르타",
    desc: "바기오의 대표 세미스파르타. SP트레이너 프로그램으로 발음 교정에 강점. 쾌적한 학습 환경.",
    price: "$1,150",
    rating: "4.3",
    tags: ["ESL", "스피킹"],
    image: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=600&q=80",
    courses: [
      { name: "Speed ESL", category: "ESL", manToMan: 4, group: 3, optional: 1, pricePerWeek: 130, desc: "기본 ESL 과정. 효율적인 수업 구성." },
      { name: "LEAP ESL", category: "ESL", manToMan: 6, group: 1, optional: 1, pricePerWeek: 160, desc: "1:1 집중 ESL. 빠른 실력 향상 목표." },
      { name: "SP Program", category: "스피킹", manToMan: 4, group: 2, optional: 2, pricePerWeek: 155, desc: "스피킹 교정 프로그램. 영상 촬영 후 발음 분석." },
      { name: "IELTS 과정", category: "IELTS", manToMan: 4, group: 4, optional: 0, pricePerWeek: 175, desc: "IELTS 대비. 실전 연습 중심." },
    ],
    dormitories: [
      { type: "1인실", pricePerWeek: 175, meals: "주 3식", desc: "조용한 개인 공간" },
      { type: "2인실", pricePerWeek: 125, meals: "주 3식", desc: "기본 2인실" },
      { type: "4인실", pricePerWeek: 85, meals: "주 3식", desc: "가장 경제적인 옵션" },
      { type: "6인실", pricePerWeek: 70, meals: "주 3식", desc: "최저가, 활발한 교류" },
    ],
  },
];
