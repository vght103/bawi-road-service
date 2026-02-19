-- quote_logs 테이블
CREATE TABLE quote_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  preferred_date TEXT,
  academy_id TEXT NOT NULL,
  academy_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  dormitory_type TEXT NOT NULL,
  duration_weeks INT NOT NULL,
  start_date DATE,
  quote_count INT NOT NULL DEFAULT 1,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 이메일 기준 견적 횟수 조회 RPC
CREATE OR REPLACE FUNCTION get_quote_count(p_email TEXT)
RETURNS INT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT COALESCE(COUNT(*)::INT, 0) FROM quote_logs WHERE email = p_email;
$$;
