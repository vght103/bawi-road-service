# PRD 인덱스

> 기능별 기획서와 소스 파일 매핑

## 기능 매핑

| 기능 ID | PRD 파일 | 관련 소스 패턴 | 상태 | REQ 범위 |
|---------|----------|---------------|------|----------|
| home | features/home.md | src/pages/index.astro, src/react-pages/home/** | 구현완료 | REQ-001~006 |
| ai-chatbot | features/ai-chatbot.md | src/**/chat/**, supabase/functions/ai-chat/** | 구현완료 | REQ-026~033 |
| enrollment | features/enrollment.md | src/**/enrollment/**, supabase/functions/storage-presign/** | 구현완료 | REQ-034~041 |
| quote | features/quote.md | src/**/quote/** | 구현완료 | REQ-020~025 |
| academy-search | features/academy-search.md | src/**/academy/**, src/**/academies/** | 구현완료 | REQ-007~012 |
| auth | features/auth.md | src/**/auth/**, src/stores/authStore.ts | 구현완료 | REQ-013~019 |
| my-page | features/my-page.md | src/**/my/** | 구현완료 | REQ-042~047 |
| inquiry | features/inquiry.md | src/**/inquiry/** | 구현완료 | REQ-048~051 |
| info-pages | features/info-pages.md | src/**/process/**, src/**/visa-info/**, src/**/why-philippines/** | 구현완료 | REQ-052~054 |

## 공통 소스 (모든 PRD에 해당)

- src/components/** (공통 UI 컴포넌트)
- src/lib/** (공통 유틸리티)
- src/layouts/** (레이아웃)
- src/stores/** (전역 상태 — authStore 제외)

## 요구사항 추적표

> 신규 기능부터 REQ → AC → TC 추적 관리

| REQ | 기능 ID | AC | TC | 상태 |
|-----|---------|-----|-----|------|
| REQ-001 | home | AC-1 | - | 구현완료 |
| REQ-002 | home | AC-2 | - | 구현완료 |
| REQ-003 | home | AC-3 | - | 구현완료 |
| REQ-004 | home | AC-4 | - | 구현완료 |
| REQ-005 | home | AC-5 | - | 구현완료 |
| REQ-006 | home | AC-6 | - | 구현완료 |
| REQ-007 | academy-search | AC-7 | - | 구현완료 |
| REQ-008 | academy-search | AC-8 | - | 구현완료 |
| REQ-009 | academy-search | AC-9 | - | 구현완료 |
| REQ-010 | academy-search | AC-10 | - | 구현완료 |
| REQ-011 | academy-search | AC-11 | - | 구현완료 |
| REQ-012 | academy-search | AC-12 | - | 구현완료 |
| REQ-013 | auth | AC-13 | - | 구현완료 |
| REQ-014 | auth | AC-14 | - | 구현완료 |
| REQ-015 | auth | AC-15 | - | 구현완료 |
| REQ-016 | auth | AC-16 | - | 구현완료 |
| REQ-017 | auth | AC-17 | - | 구현완료 |
| REQ-018 | auth | AC-18 | - | 구현완료 |
| REQ-019 | auth | AC-19 | - | 구현완료 |
| REQ-020 | quote | AC-20 | - | 구현완료 |
| REQ-021 | quote | AC-21 | - | 구현완료 |
| REQ-022 | quote | AC-22 | - | 구현완료 |
| REQ-023 | quote | AC-23 | - | 구현완료 |
| REQ-024 | quote | AC-24 | - | 구현완료 |
| REQ-025 | quote | AC-25 | - | 구현완료 |
| REQ-026 | ai-chatbot | AC-26 | - | 구현완료 |
| REQ-027 | ai-chatbot | AC-27 | - | 구현완료 |
| REQ-028 | ai-chatbot | AC-28 | - | 구현완료 |
| REQ-029 | ai-chatbot | AC-29 | - | 구현완료 |
| REQ-030 | ai-chatbot | AC-30 | - | 구현완료 |
| REQ-031 | ai-chatbot | AC-31 | - | 구현완료 |
| REQ-032 | ai-chatbot | AC-32 | - | 구현완료 |
| REQ-033 | ai-chatbot | AC-33 | - | 구현완료 |
| REQ-034 | enrollment | AC-34 | - | 구현완료 |
| REQ-035 | enrollment | AC-35 | - | 구현완료 |
| REQ-036 | enrollment | AC-36 | - | 구현완료 |
| REQ-037 | enrollment | AC-37 | - | 구현완료 |
| REQ-038 | enrollment | AC-38 | - | 구현완료 |
| REQ-039 | enrollment | AC-39 | - | 구현완료 |
| REQ-040 | enrollment | AC-40 | - | 구현완료 |
| REQ-041 | enrollment | AC-41 | - | 구현완료 |
| REQ-042 | my-page | AC-42 | - | 구현완료 |
| REQ-043 | my-page | AC-43 | - | 구현완료 |
| REQ-044 | my-page | AC-44 | - | 구현완료 |
| REQ-045 | my-page | AC-45 | - | 구현완료 |
| REQ-046 | my-page | AC-46 | - | 구현완료 |
| REQ-047 | my-page | AC-47 | - | 구현완료 |
| REQ-048 | inquiry | AC-48 | - | 구현완료 |
| REQ-049 | inquiry | AC-49 | - | 구현완료 |
| REQ-050 | inquiry | AC-50 | - | 구현완료 |
| REQ-051 | inquiry | AC-51 | - | 구현완료 |
| REQ-052 | info-pages | AC-52 | - | 구현완료 |
| REQ-053 | info-pages | AC-53 | - | 구현완료 |
| REQ-054 | info-pages | AC-54 | - | 구현완료 |

## 산출물 경로

| 산출물 | 경로 | 설명 |
|--------|------|------|
| 기능별 PRD | `docs/prd/features/` | 기능 기획서 |
| 변경 이력 | `docs/prd/changelog.md` | PRD 변경 로그 |
| 결정사항 로그 | `docs/prd/adr/` | 기술/비즈니스 결정 근거 |
| 검증 리포트 | `docs/prd/reports/` | verify 결과 (팀 공유용) |
