/** 약관 문서의 콘텐츠 블록 타입 */
export type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "ol"; items: ListItem[] }
  | { type: "ul"; items: string[] }
  | { type: "info-box"; entries: { label: string; value: string }[] };

/** 순서 리스트 아이템 (단순 텍스트 or 하위 목록 포함) */
export type ListItem =
  | string
  | { text: string; bold?: boolean; subItems?: string[] };

/** 약관 개별 조항 */
export interface TermsArticle {
  id: string;
  title: string;
  blocks: ContentBlock[];
}

/** 약관 문서 전체 */
export interface TermsDocument {
  pageTitle: string;
  effectiveDate: string;
  articles: TermsArticle[];
}
