// 약관 조항 내 콘텐츠 블록 타입 (paragraph / ol / ul / info-box)
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "ol"; items: ListItem[] }
  | { type: "ul"; items: string[] }
  | { type: "info-box"; entries: { label: string; value: string }[] };

// 순서 있는 목록 항목 — 단순 문자열 또는 bold/subItems를 가진 객체
export type ListItem =
  | string
  | { text: string; bold?: boolean; subItems?: string[] };

// 약관 개별 조항 구조
export interface TermsArticle {
  id: string;     // articleToPlainText에서 조항 조회에 사용 (예: "1", "10-2")
  title: string;  // 조항 제목 (예: "제1조 (목적)")
  blocks: ContentBlock[];
}

// 약관 문서 전체 구조
export interface TermsDocument {
  pageTitle: string;      // 약관 페이지 제목
  effectiveDate: string;  // 시행일
  articles: TermsArticle[];
}
