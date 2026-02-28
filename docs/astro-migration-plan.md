# Astro 마이그레이션 플랜

## Context

현재 `bawi-road-service`는 React 19 + Vite SPA로, 검색엔진 크롤러에게 빈 `<div id="root">`만 보여주는 SEO 한계가 있음. 네이버 등 JS 미실행 크롤러에서 메타태그/콘텐츠를 읽지 못함. Astro SSG로 전환하여 빌드 시 완성된 HTML을 생성하고, 인터랙티브 부분만 React island로 유지.

**방향**: 점진적 전환 / 같은 레포 / Cloudflare Pages SSG 유지

---

## 현재 페이지 분류 (18개)

### STATIC → Astro로 재작성 (6개, SEO 핵심)
| 페이지 | 파일 | 특징 |
|--------|------|------|
| 왜 필리핀? | WhyPhilippinesPage.tsx | 콘텐츠 + 스크롤 애니메이션 |
| 절차 안내 | ProcessPage.tsx | 단계별 가이드 |
| 비자 정보 | VisaInfoPage.tsx | 탭 + 테이블 |
| 바위와 함께 | WithBawiPage.tsx | 서비스 소개 |
| 개인정보처리방침 | PrivacyPolicyPage.tsx | 텍스트 |
| 이용약관 | TermsOfServicePage.tsx | 텍스트 |

### INTERACTIVE → React island로 감싸기 (12개)
| 페이지 | 파일 | React 필요 이유 |
|--------|------|----------------|
| 홈 | HomePage.tsx | useQuery, AI 검색, Swiper |
| 어학원 검색 | AcademySearchPage.tsx | 필터, 검색, useQuery |
| 어학원 상세 | AcademyDetailPage.tsx | 동적 데이터, Swiper |
| 견적 요청 | QuotePage.tsx | 폼, 날짜선택, Supabase |
| 문의하기 | InquiryPage.tsx | 폼, Supabase |
| AI 상담 | ChatPage.tsx | SSE 스트리밍, 세션 |
| 로그인 | LoginPage.tsx | Auth |
| 회원가입 | SignupPage.tsx | Auth + zod |
| 계정찾기 | FindAccountPage.tsx | Auth |
| 비밀번호 재설정 | ResetPasswordPage.tsx | Auth |
| 마이페이지 | MyPage.tsx | Auth + useQuery |
| 등록 신청/상세 | Enrollment*.tsx | Auth + 파일업로드 |

---

## 마이그레이션 단계

### Phase 1: Astro 프로젝트 셋업
**파일 변경**: 설정 파일 추가/수정

1. `pnpm add astro @astrojs/react @astrojs/tailwind @astrojs/cloudflare`
2. `astro.config.mjs` 생성
   ```js
   import { defineConfig } from 'astro/config';
   import react from '@astrojs/react';
   import tailwind from '@astrojs/tailwind';
   export default defineConfig({
     integrations: [react(), tailwind()],
     output: 'static',
   });
   ```
3. `tsconfig.json` Astro용으로 수정
4. `package.json` scripts 변경:
   - `dev` → `astro dev`
   - `build` → `astro build`
   - `preview` → `astro preview`
5. 기존 Vite 관련 설정 제거 (`vite.config.ts`)
6. `src/pages/` 기존 React 페이지를 `src/react-pages/`로 이동 (Astro가 src/pages를 라우트로 사용하므로)

### Phase 2: Astro 레이아웃 & 공통 컴포넌트
**파일 생성**: `src/layouts/`, `src/components/` Astro 버전

1. `src/layouts/BaseLayout.astro` 생성
   - `<html>`, `<head>` (메타태그 props로 받기), `<body>`
   - Navbar, Footer 포함
   - Tailwind CSS, 폰트 로드
2. `src/components/Navbar.astro` 생성
   - 정적 메뉴: 순수 Astro (HTML + CSS)
   - 모바일 메뉴 토글: `<script>` 태그로 바닐라 JS
   - 인증 상태 표시: React island (`<AuthStatus client:load />`)
3. `src/components/Footer.astro` 생성 (순수 Astro, JS 불필요)
4. `src/components/AuthStatus.tsx` 생성 (Navbar용 React island)

### Phase 3: 정적 페이지 마이그레이션 (6개)
**핵심 SEO 작업** — 완성된 HTML 생성

각 페이지를 `.astro` 파일로 재작성:
1. `src/pages/why-philippines.astro`
2. `src/pages/process.astro`
3. `src/pages/visa-info.astro`
4. `src/pages/with-bawi.astro`
5. `src/pages/privacy.astro`
6. `src/pages/terms.astro`

**작업 패턴** (각 페이지 동일):
- `BaseLayout`으로 감싸기 (title, description props)
- JSX → Astro 템플릿으로 변환 (className → class, 등)
- IntersectionObserver 스크롤 애니메이션 → `<script>` 태그
- `<Link to="/">` → `<a href="/">`
- lucide-react 아이콘 → Astro에서 직접 import (또는 astro-icon)
- **결과: JS 0바이트, 완성된 HTML**

### Phase 4: 인터랙티브 페이지 마이그레이션 (12개)
기존 React 컴포넌트를 Astro island로 감싸기

각 페이지에 Astro wrapper 생성:
```astro
---
// src/pages/academies.astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import AcademySearchPage from '@/react-pages/academy/AcademySearchPage';
---
<BaseLayout title="필리핀 어학원 비교·검색" description="...">
  <AcademySearchPage client:load />
</BaseLayout>
```

**페이지별 hydration 전략**:
| 페이지 | 전략 | 이유 |
|--------|------|------|
| HomePage | `client:load` | 첫 화면 즉시 필요 |
| AcademySearchPage | `client:load` | 검색 기능 즉시 필요 |
| AcademyDetailPage | `client:load` | 동적 데이터 |
| QuotePage | `client:load` | 폼 |
| InquiryPage | `client:load` | 폼 |
| ChatPage | `client:load` | 실시간 채팅 |
| Auth 페이지 (4개) | `client:load` | 폼 + 인증 |
| MyPage | `client:load` | 인증 필요 |
| Enrollment (2개) | `client:load` | 인증 + 복잡한 폼 |

**인터랙티브 페이지 내부 변경점**:
- `react-router-dom`의 `Link` → 일반 `<a>` 태그
- `useNavigate()` → `window.location.href`
- `useParams()` → Astro에서 props로 전달
- Navbar/Footer 제거 (BaseLayout이 담당)
- `Seo` 컴포넌트 제거 (BaseLayout이 담당)

### Phase 5: AuthContext 처리
**핵심 과제** — React island 간 인증 상태 공유

1. `nanostores` 설치 (`pnpm add nanostores @nanostores/react`)
2. `src/stores/authStore.ts` 생성
   - Supabase `onAuthStateChange` 리스너
   - `$user`, `$session`, `$loading` atoms
3. 기존 `AuthContext` → nanostore로 전환
4. 각 React island에서 `useStore($user)` 사용
5. `ProtectedRoute` → Astro middleware 또는 island 내 체크

### Phase 6: 동적 라우트 처리
`/academy/:id` 같은 동적 라우트:

```astro
---
// src/pages/academy/[id].astro
import BaseLayout from '@/layouts/BaseLayout.astro';
import AcademyDetailPage from '@/react-pages/academy/AcademyDetailPage';
const { id } = Astro.params;
---
<BaseLayout title="어학원 상세" description="어학원 상세 정보">
  <AcademyDetailPage id={id} client:load />
</BaseLayout>
```

- SSG에서는 `getStaticPaths()`로 빌드 시 모든 ID 열거 필요
- 또는 `/academy/[id].astro`에서 `client:load`로 클라이언트 렌더링 유지

### Phase 7: 정리 & 최적화
1. 기존 Vite 설정 파일 제거 (`vite.config.ts`)
2. 불필요한 의존성 제거 (`react-router-dom`, `react-helmet-async`, `puppeteer`)
3. `ScrollToTop`, `LoadingOverlay` 등 SPA 전용 컴포넌트 제거
4. Cloudflare Pages 빌드 설정 업데이트
5. `sitemap.xml` → `@astrojs/sitemap` 통합으로 자동 생성
6. `robots.txt` 유지

---

## 파일 구조 (마이그레이션 후)

```
src/
├── layouts/
│   └── BaseLayout.astro          # HTML head + Navbar + Footer
├── pages/                         # Astro 라우트 (SSG HTML 생성)
│   ├── index.astro                # / (HomePage island)
│   ├── academies.astro            # /academies (island)
│   ├── academy/
│   │   └── [id].astro             # /academy/:id (island)
│   ├── why-philippines.astro      # 순수 Astro (JS 0)
│   ├── process.astro              # 순수 Astro (JS 0)
│   ├── visa-info.astro            # 순수 Astro (JS 0)
│   ├── with-bawi.astro            # 순수 Astro (JS 0)
│   ├── quote.astro                # island
│   ├── inquiry.astro              # island
│   ├── chat.astro                 # island
│   ├── login.astro                # island
│   ├── signup.astro               # island
│   ├── find-account.astro         # island
│   ├── reset-password.astro       # island
│   ├── my.astro                   # island
│   ├── enrollment/
│   │   ├── apply.astro            # island
│   │   └── [id].astro             # island
│   ├── privacy.astro              # 순수 Astro (JS 0)
│   └── terms.astro                # 순수 Astro (JS 0)
├── components/
│   ├── Navbar.astro               # Astro + 바닐라 JS
│   ├── Footer.astro               # 순수 Astro
│   ├── AuthStatus.tsx             # React island (Navbar용)
│   ├── Seo.astro                  # Astro 메타태그 (Helmet 대체)
│   └── ui/                        # shadcn (React, 기존 유지)
├── react-pages/                   # 기존 React 페이지 (island용)
│   ├── home/HomePage.tsx
│   ├── academy/
│   ├── quote/QuotePage.tsx
│   ├── inquiry/InquiryPage.tsx
│   ├── chat/ChatPage.tsx
│   ├── auth/
│   ├── my/MyPage.tsx
│   └── enrollment/
├── stores/
│   └── authStore.ts               # nanostores (AuthContext 대체)
├── api/                           # 기존 유지
├── hooks/                         # 기존 유지 (AuthContext → nanostore 전환)
├── lib/                           # 기존 유지
├── data/                          # 기존 유지
└── types/                         # 기존 유지
```

---

## SEO 개선 효과

| 항목 | Before (React SPA) | After (Astro SSG) |
|------|--------------------|--------------------|
| 정적 페이지 HTML | 빈 `<div id="root">` | 완성된 HTML + 메타태그 |
| 네이버 크롤링 | X | O |
| Google 크롤링 | O (JS 실행) | O (즉시) |
| SNS 미리보기 | X | O |
| 정적 페이지 JS | ~250KB React 번들 | 0 KB |
| LCP | JS 로드 후 렌더링 | 즉시 렌더링 |
| sitemap | 수동 관리 | @astrojs/sitemap 자동 |

---

## 의존성 변경

### 추가
- `astro`
- `@astrojs/react`
- `@astrojs/tailwind`
- `@astrojs/sitemap`
- `nanostores`
- `@nanostores/react`

### 제거
- `react-router-dom` (Astro 파일 라우팅)
- `react-helmet-async` (Astro head 관리)
- `puppeteer` (프리렌더 불필요)
- `vite-plugin-prerender` (이미 제거됨)

### 유지
- `react`, `react-dom` (island용)
- `@tanstack/react-query` (island 내 데이터)
- `@supabase/supabase-js`
- `tailwindcss`, shadcn, lucide-react, swiper, etc.

---

## 작업 순서 & 예상 작업량

| Phase | 작업 | 예상 |
|-------|------|------|
| 1 | Astro 셋업 + 설정 | 작음 |
| 2 | Layout + Navbar/Footer | 중간 |
| 3 | 정적 페이지 6개 | 중간 (반복 작업) |
| 4 | 인터랙티브 페이지 12개 | 중간 (wrapper 생성) |
| 5 | AuthContext → nanostores | 중간 |
| 6 | 동적 라우트 | 작음 |
| 7 | 정리 + 배포 확인 | 작음 |

---

## 검증 방법

1. `pnpm run build` → `dist/` 에 각 라우트별 `index.html` 생성 확인
2. 정적 페이지 HTML에 메타태그 + 콘텐츠 포함 확인 (`cat dist/why-philippines/index.html | head -50`)
3. 인터랙티브 페이지 정상 hydration 확인 (`pnpm run preview`)
4. 인증 플로우 동작 확인 (로그인 → 마이페이지)
5. Cloudflare Pages 배포 테스트

---

## 리스크 & 대응

| 리스크 | 대응 |
|--------|------|
| nanostores 인증 공유 복잡 | island 내부에서 개별 Supabase auth 리스너 유지 가능 |
| Swiper Astro 호환 | React island 내에서 사용하므로 문제 없음 |
| 동적 라우트 SSG | `getStaticPaths()` 또는 client-side 렌더링 유지 |
| shadcn 호환 | React island 내에서 사용하므로 문제 없음 |
