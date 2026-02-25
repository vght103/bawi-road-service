# Project Rules

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

## Code Style

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
