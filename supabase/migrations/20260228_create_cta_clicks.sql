CREATE TABLE cta_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
  cta_type TEXT NOT NULL,        -- 'quote' | 'inquiry'
  source TEXT NOT NULL,          -- 'bubble' | 'static'
  clicked_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_cta_clicks_session ON cta_clicks (session_id);
CREATE INDEX idx_cta_clicks_type ON cta_clicks (cta_type, clicked_at DESC);

ALTER TABLE cta_clicks ENABLE ROW LEVEL SECURITY;

-- 비인증 사용자도 INSERT 가능 (챗봇은 비인증)
CREATE POLICY "allow_insert_cta_clicks" ON cta_clicks
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- 관리자만 조회 가능
CREATE POLICY "admin_read_cta_clicks" ON cta_clicks
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM members WHERE members.id = auth.uid() AND members.role = 'ADMIN')
  );
