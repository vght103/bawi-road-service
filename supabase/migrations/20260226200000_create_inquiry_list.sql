-- 문의 제출 폼 테이블 생성
CREATE TABLE inquiry_list (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- RLS 활성화
ALTER TABLE inquiry_list ENABLE ROW LEVEL SECURITY;

-- 익명 사용자 INSERT 허용 (누구나 문의 폼 제출 가능)
CREATE POLICY "Allow anonymous insert inquiry" ON inquiry_list
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- 인증된 사용자 INSERT 허용
CREATE POLICY "Allow authenticated insert inquiry" ON inquiry_list
  FOR INSERT
  TO authenticated
  WITH CHECK (true);
