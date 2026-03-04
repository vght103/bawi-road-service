-- chat_rate_limits: IP별 단일 행, upsert 패턴으로 원자적 레이트 리밋
CREATE TABLE IF NOT EXISTS chat_rate_limits (
  ip TEXT PRIMARY KEY,
  request_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS 활성화: 직접 접근 차단 (service_role + SECURITY DEFINER 함수로만 접근)
ALTER TABLE chat_rate_limits ENABLE ROW LEVEL SECURITY;

-- 원자적 레이트 리밋 체크 + 카운트 증가
CREATE OR REPLACE FUNCTION check_rate_limit(
  p_ip TEXT,
  p_max_requests INTEGER DEFAULT 10,
  p_window_seconds INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_count INTEGER;
BEGIN
  INSERT INTO chat_rate_limits (ip, request_count, window_start)
  VALUES (p_ip, 1, now())
  ON CONFLICT (ip) DO UPDATE SET
    request_count = CASE
      WHEN chat_rate_limits.window_start + (p_window_seconds || ' seconds')::INTERVAL < now()
      THEN 1
      ELSE chat_rate_limits.request_count + 1
    END,
    window_start = CASE
      WHEN chat_rate_limits.window_start + (p_window_seconds || ' seconds')::INTERVAL < now()
      THEN now()
      ELSE chat_rate_limits.window_start
    END
  RETURNING request_count INTO v_count;

  RETURN v_count <= p_max_requests;
END;
$$;

-- 1시간 이상 오래된 행 정리 (선택적 호출용)
CREATE OR REPLACE FUNCTION cleanup_stale_rate_limits()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM chat_rate_limits
  WHERE window_start < now() - INTERVAL '1 hour';
END;
$$;
