CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  initial_query TEXT NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]'::jsonb,
  message_count INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_chat_sessions_created_at ON chat_sessions (created_at DESC);

ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "admin_full_access" ON chat_sessions
  FOR ALL
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM members WHERE members.id = auth.uid() AND members.role = 'ADMIN')
  );
