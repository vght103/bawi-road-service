# Dark Mode 전환 가이드

## 현재 적용 범위

| 영역 | 상태 | 비고 |
|------|------|------|
| Navbar | ✅ 완료 | 전역 공유 — 모든 페이지에 적용됨 |
| Footer | ✅ 완료 | 전역 공유 — 모든 페이지에 적용됨 |
| HomePage (Hero) | ✅ 완료 | aurora-bg, glass-warm 카드, 그라데이션 텍스트 |
| HomePage (Academies) | ✅ 완료 | 다크 카드, 스와이퍼 버튼 |
| HomePage (Why) | ✅ 완료 | cream 카드 + glow-border |
| HomePage (Process) | ✅ 완료 | cream 카드 + glow-border |
| HomePage (CTA) | ✅ 완료 | gradient orb 장식, glow CTA |
| AuthStatus (드롭다운) | ✅ 완료 | Navbar 내 드롭다운 다크 매칭 |
| /academies | ❌ 미적용 | 라이트 테마 유지 |
| /academy/:id | ❌ 미적용 | 라이트 테마 유지 |
| /quote | ❌ 미적용 | 라이트 테마 유지 |
| /about | ❌ 미적용 | 라이트 테마 유지 |
| /with-bawi | ❌ 미적용 | 라이트 테마 유지 |
| /why-philippines | ❌ 미적용 | 라이트 테마 유지 |
| /process | ❌ 미적용 | 라이트 테마 유지 |
| /visa-info | ❌ 미적용 | 라이트 테마 유지 |
| /enrollment | ❌ 미적용 | 라이트 테마 유지 |
| /login, /signup | ❌ 미적용 | 라이트 테마 유지 |
| /my (마이페이지) | ❌ 미적용 | 라이트 테마 유지 |

---

## 다크 팔레트 (`src/index.css` @theme inline)

| 변수명 | 값 | 용도 |
|--------|-----|------|
| `--color-dark-base` | `#2A2118` | 페이지 배경 (가장 어두움) |
| `--color-dark-surface` | `#342A20` | 섹션 배경 (base보다 약간 밝음) |
| `--color-dark-card` | `#3E3328` | 카드 배경 |
| `--color-dark-card-hover` | `#4A3E32` | 카드 호버 |
| `--color-dark-border` | `#5C4E3E` | 카드/요소 테두리 |
| `--color-dark-border-subtle` | `#463828` | 섹션 구분선 (미묘한 border) |
| `--color-dark-text` | `#F5E6D8` | 주요 텍스트 (흰색 느낌) |
| `--color-dark-text-secondary` | `#D4B896` | 보조 텍스트 |
| `--color-dark-text-muted` | `#A08E7A` | 비활성/힌트 텍스트 |
| `--color-dark-card-elevated` | `#5E4F40` | 강조 카드 (더 밝은 배경) |
| `--color-dark-accent-orange` | `#E8723A` | 오렌지 액센트 (기존 terracotta 대체) |

---

## 유틸리티 클래스

### `glass`
- 용도: 반투명 다크 카드 (Hero 영역 등)
- 스타일: `rgba(62,51,40,0.7)` + `backdrop-blur(20px)` + 골드 border

### `glass-light`
- 용도: 뱃지, 태그 (반투명 + blur)
- 스타일: `rgba(62,51,40,0.5)` + `backdrop-blur(16px)`

### `glass-warm`
- 용도: Hero의 AI 챗봇 카드, 견적 카드
- 스타일: `rgba(196,168,130,0.15)` + `backdrop-blur(20px)` + 웜 베이지 border
- 특징: 다크 배경 위에서 따뜻한 반투명 느낌

### `text-gradient-accent`
- 용도: 강조 텍스트 (예: "든든한", "무료로 확인")
- 스타일: `linear-gradient(135deg, #C4603A → #E8723A → #F0A500)`

### `glow-border`
- 용도: cream 카드의 그라데이션 전체 테두리
- 스타일: `::before` pseudo로 `terracotta → orange → green` 그라데이션 border (3px)
- 주의: `position: relative` 자동 부여됨

### `glow-cta`
- 용도: CTA 버튼의 glow 효과
- 스타일: `box-shadow` 오렌지 glow + hover 시 확대

### `aurora-bg`
- 용도: Hero 섹션 배경 장식
- 스타일: `::before`로 radial-gradient 3개 + 8초 애니메이션

---

## 전환 패턴 (Light → Dark 치환표)

### 배경

| Light | Dark |
|-------|------|
| `bg-cream` | `bg-dark-base` |
| `bg-white` | `bg-dark-surface` 또는 `bg-dark-card` |
| `bg-beige` | `bg-dark-surface` |

### 텍스트

| Light | Dark |
|-------|------|
| `text-brown-text` / `text-brown-dark` | `text-dark-text` |
| `text-brown` | `text-dark-text-secondary` |
| `text-brown-light` | `text-dark-text-muted` |
| `text-terracotta` | `text-dark-accent-orange` |
| `text-accent-green-dark` | `text-accent-green` (밝기 유지) |

### 테두리

| Light | Dark |
|-------|------|
| `border-beige-dark` | `border-dark-border` |
| `border-beige` | `border-dark-border-subtle` |

### 카드

| Light | Dark |
|-------|------|
| `bg-white border-beige-dark` | `bg-dark-card border-dark-border` |
| `bg-white shadow-lg` | `glass` 또는 `bg-dark-card` |
| 호버 `hover:shadow-lg` | `hover:shadow-[0_8px_30px_rgba(196,96,58,0.12)]` |

### 뱃지/칩

| Light | Dark |
|-------|------|
| `bg-green-badge text-accent-green-dark` | `glass-light text-dark-accent-orange` |
| `bg-terracotta-light text-terracotta` | `bg-dark-accent-orange/15 text-dark-accent-orange` |

### 버튼

| Light | Dark |
|-------|------|
| Primary `bg-terracotta` | `bg-gradient-to-r from-terracotta to-[#E8723A]` + `glow-cta` |
| Secondary `bg-white border-beige-dark` | `bg-white/90 text-brown-dark border-white/40` 또는 `bg-dark-card border-dark-border text-dark-text` |

### 입력 필드

| Light | Dark |
|-------|------|
| `bg-white border-beige-dark` | `bg-white rounded-[10px] border border-white/50` (입력은 흰색 유지) |
| `placeholder:text-brown-light` | `placeholder:text-dark-text-muted` |

---

## 섹션 배경 교차 패턴

다크 모드에서 섹션 구분감을 주기 위해 `dark-base`와 `dark-surface`를 번갈아 사용:

```
Hero        → bg-dark-base (aurora-bg)
Trust Bar   → bg-dark-surface
Academies   → bg-dark-base
Why         → bg-dark-surface
Process     → bg-dark-base
CTA         → bg-dark-surface
```

---

## 콘텐츠 카드 스타일 옵션

| 스타일 | 적합한 곳 | 클래스 |
|--------|-----------|--------|
| 다크 카드 | 어학원 목록, 일반 카드 | `bg-dark-card border-dark-border` |
| Glass 카드 | Hero 영역, 강조 영역 | `glass` 또는 `glass-warm` |
| Cream 카드 + glow-border | 정보 카드 (Why, Process) | `bg-cream glow-border` |
| Elevated 카드 | 강조가 필요한 카드 | `bg-dark-card-elevated` |

---

## 주의사항

1. **Navbar/Footer는 전역** — 이미 다크로 전환됨. 다른 페이지의 라이트 콘텐츠와 자연스럽게 어울리는 구조
2. **cream 카드에 glow-border 사용 시** — 카드에 `bg-cream`이 필수 (배경이 있어야 mask가 작동)
3. **aurora-bg 사용 시** — 내부 콘텐츠에 `relative z-10` 추가 (::before 위로)
4. **glass-warm 사용 시** — 내부 텍스트는 `text-dark-text` 계열 사용
5. **라이트 페이지와의 전환** — Navbar/Footer가 다크이므로, 콘텐츠만 라이트여도 자연스러움
