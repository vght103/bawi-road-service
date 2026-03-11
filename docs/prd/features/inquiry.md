# 문의하기

> 상태: 구현완료
> 최종 수정일: 2026-03-11
> 관련 페이지: src/pages/inquiry.astro, src/react-pages/inquiry/

## 개요

이름/연락처/문의내용을 입력하여 1:1 상담을 신청하는 문의 폼. 카카오톡 또는 전화로 답변을 받는다.

## 문제 정의

AI 챗봇이나 웹사이트 정보만으로 해결되지 않는 상세한 상담이 필요한 사용자를 위해, 간편한 문의 폼을 통해 상담 요청을 접수할 수 있어야 한다.

## 사용자 스토리

- [x] 사용자는 이름/연락처/문의내용을 입력하여 상담을 신청할 수 있다
- [x] 제출 완료 후 안내 화면이 표시된다

## 요구사항

### Must (필수)

- REQ-048: 이름, 연락처, 문의 내용을 입력받아 inquiry_list 테이블에 저장한다
- REQ-049: 연락처 입력 시 자동 하이픈 포맷(`010-XXXX-XXXX`)을 적용한다
- REQ-050: 유입 경로(`?from=` 파라미터)가 inquiry_list.source에 저장된다
- REQ-051: 제출 완료 후 성공 화면(체크 아이콘 + 홈 이동 버튼)을 표시한다

### Nice-to-have (선택)

없음

## 상세 스펙

### UI/UX

#### 폼 화면

- 상단 안내: "카카오톡 또는 전화로 빠르게 연락드려요."
- 이름 (필수, 텍스트)
- 연락처 (필수, tel 타입, 자동 하이픈)
- 문의 내용 (필수, textarea)
- 제출 버튼

#### 성공 화면

- 초록 체크 아이콘 + "문의가 접수되었습니다" 메시지
- "홈으로 돌아가기" 버튼

### 데이터 모델

#### inquiry_list 테이블

| 필드 | 타입 | 설명 |
|------|------|------|
| id | bigint (PK) | 자동 증가 |
| name | text | 이름 |
| phone | text | 연락처 |
| message | text | 문의 내용 |
| source | text (nullable) | 유입 경로 |
| created_at | timestamptz | 생성 시각 |

### API

- `createInquiry(data: InquiryInsert)` — `src/api/inquiry/inquiries.ts`, Supabase anon 클라이언트로 직접 insert

### 비즈니스 로직

- 로그인 불필요 — anon 키로 직접 insert
- 하이픈 포맷: 입력 중 자동 `010-XXXX-XXXX` 형식 적용
- 클라이언트 유효성 검사: 필수 필드 빈값 체크 (useState 기반, zod 미사용)
- useMutation 미사용 — 직접 async/await로 처리

### 유입 경로 추적

| 위치 | source 값 |
|------|----------|
| 홈 히어로 | home-hero |
| 홈 CTA | home-cta |
| 챗봇 메시지 CTA | chatbot-message |
| 챗봇 고정 CTA | chatbot-fixed |

### 엣지케이스

- 필수 필드 미입력: 각 필드별 에러 메시지 표시
- 제출 중: LoadingOverlay + 버튼 비활성화
- 제출 실패: 인라인 에러 메시지
- Supabase 미설정(개발환경): 에러 반환

## 수용 기준 (Acceptance Criteria)

- [x] AC-48: 이름/연락처/문의내용 입력 후 제출하면 DB에 저장된다 ← REQ-048
- [x] AC-49: 연락처 입력 시 자동 하이픈이 적용된다 ← REQ-049
- [x] AC-50: 유입 경로가 source 필드에 저장된다 ← REQ-050
- [x] AC-51: 제출 완료 후 성공 화면이 표시된다 ← REQ-051

## 제약 사항

- Edge Function 없음 — 클라이언트에서 Supabase 직접 insert
- 답변은 수동 (카카오톡/전화)
- RLS: anon 사용자 insert 허용, select/update/delete는 관리자만

## 미결 사항

없음
