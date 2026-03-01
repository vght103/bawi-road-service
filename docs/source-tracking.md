# Source 유입 경로 추적 가이드

## 1. 개요

bawi-road-service에서는 사용자가 어떤 경로를 통해 우리의 핵심 행동 유도(CTA) 페이지로 진입했는지 추적하는 시스템을 운영합니다.

**작동 원리:**
- 사이트 내 모든 주요 CTA 링크에 `?from=` 쿼리 파라미터를 붙입니다
- 각 폼 페이지(무료 견적, 1:1 상담, 수속 신청 등)에서 `searchParams.get("from")`으로 이 값을 추출합니다
- 추출한 값을 DB의 `source` 컬럼에 저장하여 유입 경로를 기록합니다
- Admin 대시보드에서 이 데이터를 활용하여 유입 경로별 전환율, 사용자 행동, 마케팅 효과를 분석할 수 있습니다

이를 통해 어느 페이지/요소에서의 CTA가 실제로 가장 효과적인지 데이터 기반으로 파악할 수 있습니다.

---

## 2. 전체 source 값 목록

모든 CTA 링크에서 사용하는 `?from=` 파라미터 값들을 정의합니다.

| `?from=` 값 | 진입 위치 | 설명 |
|---|---|---|
| `home-hero` | 홈페이지 히어로 섹션 | 메인 배너의 CTA 버튼 - 페이지 진입 시 첫 눈에 띄는 행동 유도 |
| `home-cta` | 홈페이지 하단 CTA | 페이지 하단 행동 유도 섹션 - 사용자가 서비스 설명을 읽은 후의 CTA |
| `navbar` | 네비게이션 바 | 상단 GNB 메뉴의 CTA 버튼 |
| `footer` | 푸터 | 하단 푸터 링크의 CTA 버튼 |
| `academy-detail` | 어학원 상세 페이지 | 어학원 정보를 확인하고 견적 요청으로 전환 |
| `visa-info` | 비자 정보 페이지 | 비자 안내 페이지에서 문의로 전환 |
| `with-bawi` | 바위로드와 함께 페이지 | 서비스 소개 페이지에서 신청으로 전환 |
| `my-page` | 마이페이지 | 로그인 후 마이페이지에서 신청 진행 |
| `chatbot-message` | 챗봇 AI 응답 말풍선 | AI 챗봇이 추천한 CTA 버튼 클릭 |
| `chatbot-fixed` | 챗봇 하단 고정 버튼 | 채팅 입력창 위의 고정 CTA 버튼 |
| `NULL` | 직접 접속 / 추적되지 않는 경로 | URL 직접 입력 또는 `?from=` 파라미터 없이 접근하는 경우 |

---

## 3. 저장되는 테이블

각 폼 제출 시 해당 테이블의 `source` 컬럼에 저장되는 정보입니다.

| 테이블 | `source` 컬럼 타입 | 저장 시점 | 설명 |
|---|---|---|---|
| `quote_list` | `text` | 무료 견적 요청 폼 제출 시 | 사용자가 견적 신청을 할 때 유입 경로 기록 |
| `inquiry_list` | `text` | 1:1 상담 신청 폼 제출 시 | 사용자가 상담 신청을 할 때 유입 경로 기록 |
| `enrollments` | `text` | 수속 신청 폼 제출 시 | 사용자가 수속을 신청할 때 유입 경로 기록 |
| `cta_clicks` | `text` | 챗봇 CTA 클릭 즉시 | 챗봇 AI가 제공한 CTA 버튼 클릭 이벤트 즉시 기록 (chatbot-message, chatbot-fixed만 해당) |

**주의사항:**
- `cta_clicks` 테이블은 폼 제출과 무관하게 **클릭 이벤트만으로도** 기록됩니다
- 다른 테이블들은 실제 폼 제출이 성공할 때만 기록됩니다
- `source` 컬럼이 NULL이면 추적되지 않은 유입으로 간주합니다

---

## 4. 데이터 흐름

### 4.1 일반 페이지에서의 폼 제출 흐름

가장 일반적인 흐름입니다. 홈페이지, 비자 정보 페이지, 어학원 상세 페이지 등에서 시작됩니다.

```
[홈페이지의 CTA 버튼]
href="/quote?from=home-hero"
  |
  v
[견적 요청 폼 페이지 (QuotePage)]
searchParams.get("from") → "home-hero"
const source = searchParams.get("from")
  |
  v
[폼 제출]
payload = {
  name, email, course, ...
  source: "home-hero"   <-- 포함
}
  |
  v
[Supabase RPC 호출]
quote_list 테이블에 행 추가
source 컬럼 = "home-hero"
```

**관련 파일:**
- `src/react-pages/quote/QuotePage.tsx` - 견적 요청 폼
- `src/react-pages/inquiry/InquiryPage.tsx` - 상담 신청 폼
- `src/react-pages/enrollment/EnrollmentApplyPage.tsx` - 수속 신청 폼
- `src/api/quote/quoteApi.ts` - 견적 API
- `src/api/inquiry/inquiryApi.ts` - 상담 API
- `src/api/enrollment/enrollmentApi.ts` - 수속 API

---

### 4.2 챗봇 전용 이중 추적 흐름

챗봇은 두 가지 방식으로 추적합니다. 사용자가 즉시 클릭할 수도, 나중에 폼을 제출할 수도 있기 때문입니다.

```
[챗봇 메시지]
"이 과정이 적합할 것 같아요! 견적받기?"
  |
  +------ 경로 A: 즉시 추적 ------+
  |                                |
  |  [CtaButton 클릭]              |
  |  trackCtaClick()               |
  |  PUT /ai-chat                  |
  |  (cta_clicks 테이블에 기록)      |
  |  source = "chatbot-message"    |
  |                                |
  +------- 경로 B: 지연 추적 -------+
  |
  | [견적 페이지로 이동]
  | href="/quote?from=chatbot-message"
  |   |
  |   v
  | [견적 폼 작성 및 제출]
  | quote_list 테이블에 기록
  | source = "chatbot-message"
```

**중요:** 챗봇 CTA를 통한 사용자는 두 테이블에 모두 나타날 수 있습니다.
- `cta_clicks`: 버튼 클릭 직후
- `quote_list` / `inquiry_list` / `enrollments`: 폼 제출 후

**관련 파일:**
- `src/api/chat/chatApi.ts` - 챗봇 API (trackCtaClick 함수)
- `src/react-pages/chat/ChatPage.tsx` - 챗봇 페이지
- `src/react-pages/chat/components/CtaButton.tsx` - CTA 버튼 컴포넌트
- `supabase/functions/ai-chat/index.ts` - Edge Function (PUT handler for cta_clicks)
- `bawi-abroad-admin/src/api/chat-history/chat-history-type.ts` - Admin 타입 정의

---

## 5. 새 링크 추가 시 규칙

새로운 CTA 링크를 추가할 때 반드시 따라야 할 규칙입니다.

### 5.1 URL 패턴

모든 CTA 링크에 `?from={출처}` 파라미터를 **반드시 포함**합니다.

```tsx
// 올바른 예
<a href="/quote?from=home-hero">견적 받기</a>
<Link to="/inquiry?from=navbar">상담 신청</Link>
<button onClick={() => navigate("/enrollment?from=footer")}>신청하기</button>

// 잘못된 예 (from 파라미터 없음)
<a href="/quote">견적 받기</a>  // source가 NULL로 저장됨
```

### 5.2 네이밍 컨벤션

`?from=` 값의 네이밍 패턴:

```
{페이지 또는 섹션}-{요소 또는 위치}
```

**예시:**
- `home-hero`: 홈페이지의 히어로 섹션
- `home-cta`: 홈페이지의 CTA 섹션
- `academy-detail`: 어학원 상세 페이지
- `chatbot-message`: 챗봇 메시지의 CTA
- `chatbot-fixed`: 챗봇 고정 버튼
- `navbar`: 네비게이션 바
- `footer`: 푸터

**규칙:**
- 모두 소문자 사용
- 단어는 하이픈(-)으로 구분
- 의미 있는 영어 단어 사용 (약자 X)
- 길이는 2~3개 단어 범위 내

### 5.3 체크리스트

새로운 CTA 링크 추가 시:

- [ ] 링크 URL에 `?from={출처}` 파라미터 포함
- [ ] `?from=` 값이 위 목록(섹션 2)에 있거나, 없으면 목록에 추가
- [ ] 네이밍 컨벤션을 따랐는지 확인
- [ ] 목표 페이지에서 `searchParams.get("from")`으로 추출 가능한지 확인
- [ ] 폼 제출 시 source 값이 payload에 포함되는지 확인
- [ ] 이 문서의 섹션 2 "전체 source 값 목록" 업데이트

---

## 6. 구현 패턴

### 6.1 폼 페이지에서 source 추출 (React)

```tsx
// src/react-pages/quote/QuotePage.tsx 예시
import { useSearchParams } from "react-router-dom";

export function QuotePage() {
  const [searchParams] = useSearchParams();
  const source = searchParams.get("from"); // "home-hero", "navbar" 등

  const handleSubmit = async (formData) => {
    const payload = {
      ...formData,
      source: source || undefined, // NULL이면 undefined로 처리
    };

    await submitQuote(payload);
  };

  return (
    // 폼 UI
  );
}
```

### 6.2 API 호출 함수

```tsx
// src/api/quote/quoteApi.ts 예시
export async function submitQuote(data: {
  name: string;
  email: string;
  source?: string | null;
  // ... 다른 필드
}) {
  const supabase = createClient();

  const { data: result, error } = await supabase
    .from("quote_list")
    .insert([
      {
        name: data.name,
        email: data.email,
        source: data.source, // source 컬럼에 저장
        // ... 다른 필드
      },
    ])
    .select();

  if (error) throw error;
  return result;
}
```

### 6.3 챗봇 CTA 클릭 추적

```tsx
// src/react-pages/chat/components/CtaButton.tsx 예시
import { trackCtaClick } from "@/api/chat/chatApi";

export function CtaButton({ action, label }) {
  const handleClick = async () => {
    // 즉시 추적
    await trackCtaClick({
      source: action === "quote" ? "chatbot-message" : "chatbot-fixed",
      action_type: action,
    });

    // 페이지 이동
    navigate(`/quote?from=chatbot-message`);
  };

  return <button onClick={handleClick}>{label}</button>;
}
```

---

## 7. 관련 파일 전체 목록

### 프론트엔드 - 폼 페이지

- **`src/react-pages/quote/QuotePage.tsx`** - 무료 견적 요청 폼 페이지
- **`src/react-pages/inquiry/InquiryPage.tsx`** - 1:1 상담 신청 폼 페이지
- **`src/react-pages/enrollment/EnrollmentApplyPage.tsx`** - 수속 신청 폼 페이지

### 프론트엔드 - API 호출

- **`src/api/quote/quoteApi.ts`** - 견적 관련 API 함수 및 source 처리
- **`src/api/inquiry/inquiryApi.ts`** - 상담 관련 API 함수 및 source 처리
- **`src/api/enrollment/enrollmentApi.ts`** - 수속 관련 API 함수 및 source 처리
- **`src/api/chat/chatApi.ts`** - 챗봇 API 함수 (trackCtaClick 함수 포함)

### 프론트엔드 - 챗봇 컴포넌트

- **`src/react-pages/chat/ChatPage.tsx`** - 챗봇 페이지 메인
- **`src/react-pages/chat/components/CtaButton.tsx`** - 챗봇 CTA 버튼 컴포넌트
- **`src/react-pages/chat/components/ChatMessage.tsx`** - 챗봇 메시지 표시 (CTA 렌더링)

### 백엔드 - Edge Function

- **`supabase/functions/ai-chat/index.ts`** - AI 챗봇 Edge Function
  - POST handler: AI 응답 생성
  - PUT handler: `cta_clicks` 테이블에 클릭 이벤트 저장

### Admin - 타입 정의

- **`bawi-abroad-admin/src/api/chat-history/chat-history-type.ts`** - Admin에서 사용하는 chat-history 및 cta_clicks 관련 타입

### Supabase - 테이블 스키마

- **`supabase/migrations/`** - 각 테이블의 `source` 컬럼 정의
  - `quote_list(source text)`
  - `inquiry_list(source text)`
  - `enrollments(source text)`
  - `cta_clicks(source text)`

---

## 8. Admin 대시보드에서의 활용

Admin에서는 이 source 데이터를 활용하여 다음을 분석할 수 있습니다.

### 분석 시나리오

1. **유입 경로별 전환율**
   - 어느 페이지의 CTA에서 가장 많은 사용자가 폼을 제출했는가?
   - `home-hero` vs `navbar` vs `academy-detail` 비교

2. **챗봇의 효과성**
   - `chatbot-message`와 `chatbot-fixed`의 클릭률 및 전환율 비교
   - `cta_clicks` 테이블의 데이터 분석

3. **페이지별 효율성**
   - 각 출발지별 평균 처리 시간, 완료율 등

4. **마케팅 최적화**
   - 성과가 낮은 CTA 위치 개선
   - 성과가 높은 CTA 위치 강화

### 쿼리 예시 (Supabase SQL)

```sql
-- 유입 경로별 견적 요청 건수
SELECT source, COUNT(*) as count
FROM quote_list
WHERE source IS NOT NULL
GROUP BY source
ORDER BY count DESC;

-- 챗봇 CTA 클릭 현황
SELECT source, action_type, COUNT(*) as count
FROM cta_clicks
GROUP BY source, action_type
ORDER BY count DESC;

-- 유입 경로별 견적 → 상담 전환율
SELECT
  q.source,
  COUNT(DISTINCT q.id) as quote_count,
  COUNT(DISTINCT i.id) as inquiry_count,
  ROUND(100.0 * COUNT(DISTINCT i.id) / COUNT(DISTINCT q.id), 2) as conversion_rate
FROM quote_list q
LEFT JOIN inquiry_list i ON q.user_id = i.user_id AND q.source = i.source
WHERE q.source IS NOT NULL
GROUP BY q.source
ORDER BY conversion_rate DESC;
```

---

## 9. 문제 해결

### Q: source 값이 NULL로 저장되는 경우가 많습니다.

**원인:**
- 링크에 `?from=` 파라미터가 없음
- 사용자가 직접 URL을 입력하거나 북마크에서 접속
- 외부 링크나 검색 엔진에서 유입

**해결:**
- 모든 내부 CTA 링크에 `?from=` 파라미터 추가 확인
- NULL 유입도 추적의 가치가 있으므로, admin에서 "직접 접속"으로 분류

### Q: 특정 source 값을 추가하고 싶습니다.

**절차:**
1. 새 링크에 `?from=새값` 파라미터 추가
2. 목표 폼 페이지에서 `searchParams.get("from")`으로 추출 가능한지 확인
3. 이 문서의 섹션 2 "전체 source 값 목록"에 행 추가
4. 필요하면 관련 팀에 알림 (admin에서 분석할 때 새 source 값을 인식하도록)

### Q: 챗봇 CTA를 클릭해도 `cta_clicks` 테이블에 기록되지 않습니다.

**확인:**
1. `src/api/chat/chatApi.ts`의 `trackCtaClick` 함수가 실행되는지 확인
2. `supabase/functions/ai-chat/index.ts`의 PUT handler가 정상 작동하는지 확인
3. 브라우저 콘솔에서 API 호출 오류 확인
4. Supabase의 `cta_clicks` 테이블에 권한(RLS)이 설정되어 있는지 확인

### Q: 폼 제출 시 source가 전달되지 않습니다.

**확인:**
1. 폼 페이지에서 `const source = searchParams.get("from")`으로 추출되는지 확인
2. 폼 제출 함수(API)가 `source` 필드를 payload에 포함하는지 확인
3. Supabase 테이블의 `source` 컬럼이 nullable인지 확인 (default NULL 가능)
4. 네트워크 탭에서 요청 payload 확인

---

## 10. 변경 이력

| 버전 | 날짜 | 변경 사항 |
|---|---|---|
| 1.0 | 2026-03-01 | 초판 작성 - 전체 source 추적 시스템 문서화 |

---

## 11. 참고자료

- Supabase 테이블 정의: 프로젝트 저장소의 `supabase/migrations/` 참고
- Backend Access Rules: `docs/backend-access-rules.md` 참고
- 프론트엔드 환경 설정: 프로젝트 README 참고
