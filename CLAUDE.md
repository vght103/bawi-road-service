# Project Rules

## 문제 확인 및 해결 원칙

- **근본 원인 먼저**: 문제 발생 시 해결책부터 제시하지 않는다. 반드시 근본적인 발생 원인을 먼저 분석하고 설명한 뒤에 해결 방안을 논의한다.

---

## 관련 프로젝트

| 프로젝트          | 경로                                                   | 설명                 |
| ----------------- | ------------------------------------------------------ | -------------------- |
| **서비스 (현재)** | `./` (이 프로젝트)                                      | 고객용 서비스 페이지 |
| **어드민**        | 별도 레포: `bawi-abroad-admin`                          | 관리자 백오피스      |

- "어드민에도 적용해", "admin 프로젝트에도 같이 해" → `bawi-abroad-admin` 프로젝트를 의미
- "서비스 작업해" → 현재 이 프로젝트(`bawi-road-service`)를 의미
- 두 프로젝트는 같은 Supabase 백엔드를 공유하므로, DB 스키마/Edge Function 변경 시 양쪽 영향 고려

---

## Package Manager

- **pnpm만 사용**. npm, yarn 사용 금지
- 패키지 설치: `pnpm install`, `pnpm add`
- 스크립트 실행: `pnpm run dev`, `pnpm run build` 등

## Component Co-location

- **페이지 전용 컴포넌트**: `src/pages/{page}/components/` 에 생성
- **전역 공통 컴포넌트**: `src/components/` 에 생성
- 컴포넌트가 단일 페이지에서만 사용되면 반드시 해당 페이지 폴더 안에 배치할 것

## API & Type 구조

- `src/api/{page}/` 폴더에 페이지별 API 호출 함수 + 관련 타입을 함께 관리
- 폴더명은 `src/pages/` 구조와 동일하게 미러링
- **전역 공통 API 유틸** (supabase client 등): `src/lib/` 에 유지

## Naming Convention

- Supabase 연동 타입/필드는 DB와 동일하게 **snake_case** 사용 (`academy_name`, `duration_weeks`)
- 변환 레이어 없이 Supabase 응답을 그대로 사용

## Icons

- **lucide-react만 사용**. 인라인 SVG 직접 작성 금지
- `import { IconName } from "lucide-react"` 형태로 import

## Code Style

- **주석 필수**: 비개발자도 이해할 수 있도록 한글 주석을 항상 작성할 것
  - `//` 인라인 스타일 사용 (JSDoc `/** */` 사용 금지)
  - 함수: 위에 `//` 한 줄로 무엇을 하는 함수인지 설명
  - 변수/상수: 옆에 `//` 로 어떤 값인지 설명
  - 타입/interface 필드: 옆에 `//` 로 설명 (예시값, 단위 등 불필요)
  - 복잡한 로직: 왜 이렇게 하는지 이유만 간결하게
  - 과도한 주석 금지: 이름만으로 의미가 명확한 필드는 주석 생략 가능
- 콜백 변수명에 한 글자 약어 금지. 의미가 명확한 이름 사용할 것
  - `academies.map(a => ...)` → `academies.map(academy => ...)`
  - `courses.filter(c => ...)` → `courses.filter(course => ...)`
  - `errors.forEach(e => ...)` → `errors.forEach(error => ...)`
- 예외: `index`의 `i`, 좌표의 `x`/`y` 등 관례적으로 통용되는 경우는 허용

## 백엔드 접근 규칙 (필수 숙지)

> **상세 문서: `docs/backend-access-rules.md` (요약) / 전체: `bawi-abroad-admin/docs/backend-access-rules.md`**

새로운 API, 테이블, Edge Function을 추가/수정할 때 반드시 이 규칙을 따릅니다.

- **Admin = 모든 데이터에 전체 CRUD 권한**
- **Student = 본인 소유(`user_id = auth.uid()`) 데이터에만 접근 가능**
- 모든 테이블에 RLS 활성화. Admin은 `FOR ALL`, Student는 작업별 개별 정책
- **RLS 정책에서 `auth.users` 테이블 직접 조회 금지** — `authenticated` role에 `auth` 스키마 SELECT 권한 없음. 반드시 `members` 테이블 또는 `auth.jwt()` 사용
- RLS 정책 어드민 검증: `members` 테이블 방식 사용 (`EXISTS (SELECT 1 FROM members WHERE members.id = auth.uid() AND members.role = 'ADMIN')`)
- Edge Function에서 `serviceClient`(service_role) 사용 시 **코드 레벨 권한 검증 필수** (RLS 우회되므로)
- 프론트엔드 가드는 UX 목적. 실제 보안은 서버(RLS + Edge Function)에서 담당
- 파일 업로드: Service는 `upload` 액션 + `uploaded_by: "STUDENT"` 사용. `admin-upload` 사용 금지

---

## Custom Hook 사용 기준

- **커스텀 훅 사용하지 않는 경우**: 단순 GET/POST API 호출 1~2개로 끝나는 페이지 (목록, 상세 등)
  - 컴포넌트에서 `useQuery`/`useMutation` 직접 사용
  - API 함수는 `src/api/` 레이어에 위치
- **커스텀 훅 사용하는 경우**:
  - 복잡한 로직 캡슐화가 필요할 때 (파일 업로드, 다단계 mutation 등)
  - 여러 컴포넌트에서 재사용 + 추가 로직이 있을 때 (캐시 관리 등)
- 훅 위치: `src/hooks/`

## Data (상수) 구조

- `src/data/{page}/` 폴더에 페이지별 상수 데이터 관리
- 폴더명은 `src/pages/` 구조와 동일하게 미러링
- **전역 공통 상수**: `src/constants/` 에 생성

## Skills 참조 규칙

- `.claude/skills/` 폴더에 React 코딩 스킬 규칙 존재
- `vercel-react-best-practices/rules/` 중 React 관련 규칙(rerender-_, rendering-_, js-_, client-_, bundle-\*)만 참조
- Next.js/Vercel 전용 규칙(server-\*, async-api-routes, async-dependencies 등)은 무시 — 이 프로젝트는 Astro + React 클라이언트 컴포넌트 구조
- `frontend-design/` 스킬은 UI 작업 시 참조

## 개발 워크플로우 (Phase 기반)

이 프로젝트는 기획 → 개발 → 검증의 Phase 기반 워크플로우를 따른다.
각 Phase는 게이트 조건을 충족해야 다음으로 진행할 수 있다.

### 절대 원칙

1. **질문 먼저, 문서 나중** — 기능 요청 시 즉시 구현/문서 작성 금지. 먼저 질문으로 요구사항 확인
2. **REQ-### 추적** — 모든 요구사항은 `REQ-001` 형식 ID로 관리하고 기획→코드→테스트까지 추적
3. **미결(❓) 관리** — 미결 항목이 있으면 다음 Phase로 넘어가지 않는다
4. **결정 근거 기록** — 기술/비즈니스 결정은 ADR로 남긴다
5. **사용자 확인 게이트** — 각 Phase 완료 시 사용자 "확인" 필수

### Phase 1: 기획 (PRD)

**트리거:** "기능 추가해줘", "~만들어줘", "기획서 써줘"

1. 즉시 구현하지 말고, 문제 정의 질문부터 수행
2. 답변 수집 후 `/prd` 스킬로 기획서 작성
3. 요구사항에 `REQ-###` ID 부여
4. 미결 항목은 ❓ 마크로 기획서에 남김

**게이트:** 사용자 "맞아요" 확인 + 미결 항목 0건 + REQ-### 등록 완료

### Phase 2: 개발

**트리거:** Phase 1 통과 후 "개발해줘", "구현해줘"

1. 해당 PRD를 먼저 읽는다 (`docs/prd/features/{feature-id}.md`)
2. 구현 계획을 먼저 정리한다 (영향 파일, 작업 목록)
3. 구현하면서 `docs/prd/index.md`의 REQ-### ↔ 소스 패턴 매핑 업데이트
4. 기술적 결정이 필요한 경우 ADR 기록 (`docs/prd/adr/`)

**게이트:** 빌드 성공 + 타입 에러 0건

### Phase 3: 검증

**트리거:** 개발 완료 후 "검증해줘", "verify", 커밋/PR 전

1. `/verify` 스킬 실행 (scope-check → spec-check → qa 순차)
2. 검증 리포트 `docs/prd/reports/{날짜}-{브랜치}.md`에 저장
3. FAIL 항목 있으면 수정 후 재검증

**게이트:** 종합 판정 PASS 또는 WARN (FAIL 시 커밋 금지)

### 산출물 구조

```
docs/prd/
├── index.md              # 기능-소스 매핑 (Source of Truth)
├── overview.md            # 전체 서비스 기획
├── changelog.md           # PRD 변경 이력
├── features/              # 기능별 PRD
│   ├── ai-chatbot.md
│   └── enrollment.md
├── adr/                   # 결정사항 로그 (Architecture Decision Records)
│   └── 001-why-react-hook-form.md
└── reports/               # 검증 리포트 (팀 공유용)
    └── 2026-03-11-dev.md
```

### 요구사항 추적 체계

```
REQ-001 (기획) → src/pages/quote/** (코드) → AC-1,2 (검증) → TC-1,2 (QA)
```

- `docs/prd/index.md`에 추적표 유지
- 코드 변경 시 매핑 업데이트
- spec-check가 REQ 기반으로 검증

### 관련 스킬

| 스킬           | 용도                         | Phase |
| -------------- | ---------------------------- | ----- |
| `/prd`         | 기획서 생성/수정/조회        | 1     |
| `/spec-check`  | AC 대비 구현 검증            | 3     |
| `/qa`          | 테스트 케이스 + QA           | 3     |
| `/scope-check` | 기획 외 변경 감지            | 3     |
| `/verify`      | 종합 검증 (위 3개 순차 실행) | 3     |

### ADR 형식

기술/비즈니스 결정 시 `docs/prd/adr/{번호}-{제목}.md`에 기록:

```markdown
# ADR-{번호}: {결정 제목}

> 날짜: {YYYY-MM-DD}
> 상태: 승인 / 보류 / 폐기

## 배경

[왜 이 결정이 필요한지]

## 결정

[무엇을 선택했는지]

## 근거

[왜 이것을 선택했는지]

## 대안

[고려했지만 선택하지 않은 것들]
```

## Notion 연동 규칙

> **프로젝트 진행상황 & TODO 페이지**: `31b51e2c-a7b2-813a-913c-f7149c0dd6c0`

- **구현 완료 시**: Notion 페이지의 해당 TODO 항목을 `[x]`로 변경하고, 구현 내용 설명을 간략히 추가
- **새 기능 추가 시**: "구현 완료" 섹션에 `[x]` 항목으로 추가
- **새 TODO 발견 시**: 적절한 섹션에 `[ ]` 항목으로 추가
- 업데이트 시 `notion-fetch`로 현재 내용을 먼저 확인한 뒤 `notion-update-page`로 수정

## Pages Folder Structure

- 페이지 폴더는 kebab-case 사용 (e.g., `academy-detail/`)
- 관련 페이지는 하나의 폴더로 그룹핑 (e.g., `academy/`에 Search + Detail)

```
src/pages/
├── academy/        (AcademySearchPage + AcademyDetailPage)
├── auth/           (LoginPage + SignupPage)
├── home/
├── why-philippines/
├── process/
├── visa-info/
├── quote/
└── my/
```
