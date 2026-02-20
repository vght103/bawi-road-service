# Project Rules

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
