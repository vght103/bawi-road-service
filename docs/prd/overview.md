# 바위유학 서비스 - 프로젝트 기획 개요

> 최종 수정일: 2026-03-11

## 프로젝트 목적

필리핀 어학연수를 알아보는 사용자에게 어학원 검색, AI 상담, 견적 요청, 수속 신청까지 원스톱 서비스를 제공한다.

## 대상 사용자

- 학생 (Student): 필리핀 어학연수를 알아보는 사용자
- 관리자 (Admin): bawi-abroad-admin에서 관리

## 기술 스택

- Frontend: Astro + React 19 (클라이언트 컴포넌트)
- Backend: Supabase (PostgreSQL + RLS + Edge Functions)
- Hosting: Cloudflare Pages
- Storage: Cloudflare R2
- AI: OpenAI GPT-4.1-mini (챗봇)

## 핵심 기능 목록

1. AI 상담 챗봇 (`features/ai-chatbot.md`)
2. 어학원 검색/상세 (`features/academy-search.md`)
3. 견적 요청 (`features/quote.md`)
4. 등록 신청 (`features/enrollment.md`)
5. 인증 (`features/auth.md`)
6. 마이페이지 (`features/my-page.md`)
7. 문의하기 (`features/inquiry.md`)
8. 정보 페이지 (`features/info-pages.md`)

## 사용자 핵심 플로우

```
홈 → 어학원 검색 → 상세 확인 → 견적 요청 → 상담 → 수속 신청 → 마이페이지에서 진행 확인
      ↕
   AI 챗봇 상담 (어디서든 접근 가능)
```
