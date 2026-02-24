-- 비로그인 사용자(anon)가 RPC 호출할 수 있도록 권한 부여
GRANT EXECUTE ON FUNCTION find_email_by_name_and_phone(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION find_email_by_name_and_phone(TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION verify_member_by_name_and_email(TEXT, TEXT) TO anon;
GRANT EXECUTE ON FUNCTION verify_member_by_name_and_email(TEXT, TEXT) TO authenticated;

-- PostgREST schema cache 리로드
NOTIFY pgrst, 'reload schema';
