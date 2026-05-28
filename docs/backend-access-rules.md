# 백엔드 접근 규칙 (Service 프로젝트용 요약)

> **전체 규칙은 `bawi-abroad-admin/docs/backend-access-rules.md` (통합 문서)를 참조하세요.**
> 백엔드 관련 변경 사항은 반드시 통합 문서를 기준으로 합니다.

---

## 핵심 규칙 요약

### 권한 원칙

- **Admin**: 모든 데이터에 전체 CRUD 권한
- **Student**: 본인 소유 데이터(`user_id = auth.uid()`)에만 접근 가능
- 프론트엔드 격리는 UX 목적. **실제 보안은 서버(RLS + Edge Function)에서 담당**

### RLS 정책 패턴

- Admin: `FOR ALL` + `members.role = 'ADMIN'`
- Student: 작업별(SELECT/INSERT 등) 개별 정책 + 소유권 조건

### Data API GRANT (2026-10-30 정책 변경 대비)

- 2026-10-30부터 **기존 프로젝트도** 신규 생성되는 `public` 스키마 테이블이 Data API에 기본 노출되지 않음
- 신규 테이블은 RLS와 별개로 명시적 `GRANT` 없으면 PostgREST/supabase-js 접근 차단 (403/406)
- 신규 테이블 생성 시 필수: `GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE {테이블명} TO authenticated;`
- 기존 테이블은 영향 없음. 서비스 레포는 마이그레이션 직접 작성하지 않으나, 어드민에서 추가된 테이블을 사용할 때 권한 누락 증상이 보이면 이 규칙을 참고

### Edge Function 권한 패턴

- Admin 전용 액션: `checkIsAdmin()` 검증
- Student 액션: 소유권 검증 (`user_id = userId`)
- 공용 액션: Admin이면 통과, 아니면 소유권 검증

### 파일 업로드 (Service 전용)

- 사용 액션: `action: "upload"`, `uploaded_by: "STUDENT"`
- `admin-upload` 사용 금지
- 업로드 3단계: presigned URL 요청 → R2 PUT → DB INSERT
- 파일 제한: 10MB, MIME whitelist (pdf, jpeg, png, webp)
- 이미지 압축: `compressIfImage()` 적용 권장

---

*통합 문서 위치: `bawi-abroad-admin/docs/backend-access-rules.md`*
*최종 수정일: 2026-05-28*
