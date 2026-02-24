-- find_email_by_name_and_phone: 이름과 전화번호로 이메일 찾기
-- STUDENT role 사용자만 대상
-- 이메일을 마스킹하여 반환 (예: ba***oad@gmail.com)

CREATE OR REPLACE FUNCTION find_email_by_name_and_phone(
  p_name TEXT,
  p_phone TEXT
)
RETURNS TABLE(masked_email TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  raw_email TEXT;
  local_part TEXT;
  domain_part TEXT;
  masked TEXT;
BEGIN
  SELECT u.email INTO raw_email
  FROM auth.users u
  JOIN members m ON m.id = u.id
  WHERE m.name = p_name
    AND m.phone = p_phone
    AND m.role = 'STUDENT';

  IF raw_email IS NULL THEN
    RETURN;
  END IF;

  local_part := split_part(raw_email, '@', 1);
  domain_part := split_part(raw_email, '@', 2);

  IF length(local_part) <= 2 THEN
    masked := local_part || '***';
  ELSE
    masked := left(local_part, 2) || repeat('*', LEAST(length(local_part) - 2, 3)) ||
              CASE WHEN length(local_part) > 5 THEN right(local_part, length(local_part) - 5) ELSE '' END;
  END IF;

  masked_email := masked || '@' || domain_part;
  RETURN NEXT;
END;
$$;

-- verify_member_by_name_and_email: 이름과 이메일로 회원 존재 여부 확인
-- 비밀번호 재설정 전 본인 확인용 (STUDENT role만)

CREATE OR REPLACE FUNCTION verify_member_by_name_and_email(
  p_name TEXT,
  p_email TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1
    FROM auth.users u
    JOIN members m ON m.id = u.id
    WHERE m.name = p_name
      AND u.email = p_email
      AND m.role = 'STUDENT'
  );
END;
$$;
