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
  total_fee DECIMAL,
  quote_count INT NOT NULL DEFAULT 1,
  email_sent BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS 정책
ALTER TABLE quote_logs ENABLE ROW LEVEL SECURITY;

-- 누구나 삽입 가능 (비로그인 폼)
CREATE POLICY "Anyone can insert quote logs"
  ON quote_logs FOR INSERT WITH CHECK (true);

-- 로그인 사용자는 본인 데이터만 조회
CREATE POLICY "Users can read own quote logs"
  ON quote_logs FOR SELECT
  USING (auth.uid() = user_id);

-- Admin은 전체 조회
CREATE POLICY "Admin can read all quote logs"
  ON quote_logs FOR SELECT
  USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'ADMIN'));

-- 이메일 기준 견적 횟수 조회 RPC
CREATE OR REPLACE FUNCTION get_quote_count(p_email TEXT)
RETURNS INT
LANGUAGE SQL
SECURITY DEFINER
AS $$
  SELECT COALESCE(COUNT(*)::INT, 0) FROM quote_logs WHERE email = p_email;
$$;
