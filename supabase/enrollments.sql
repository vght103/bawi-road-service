-- ============================================
-- Enrollment System Schema
-- ============================================

-- 수속 상태 enum
CREATE TYPE enrollment_status AS ENUM (
  'PENDING',
  'CONFIRMED',
  'DOCUMENTS_PENDING',
  'READY_TO_DEPART',
  'COMPLETED',
  'CANCELLED'
);

-- 서류 타입 enum
CREATE TYPE document_type AS ENUM (
  'FLIGHT_TICKET',
  'TRAVEL_INSURANCE',
  'ADMISSION_LETTER',
  'INVOICE'
);

-- 업로더 타입 enum
CREATE TYPE document_uploader AS ENUM (
  'STUDENT',
  'ADMIN'
);

-- ============================================
-- enrollments 테이블
-- ============================================
CREATE TABLE enrollments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  academy_id TEXT NOT NULL,
  academy_name TEXT NOT NULL,
  course_name TEXT NOT NULL,
  dormitory_type TEXT NOT NULL,
  duration_weeks INTEGER NOT NULL CHECK (duration_weeks BETWEEN 1 AND 52),
  start_date DATE NOT NULL,
  status enrollment_status NOT NULL DEFAULT 'PENDING',
  terms_agreed BOOLEAN NOT NULL DEFAULT FALSE,
  refund_policy_agreed BOOLEAN NOT NULL DEFAULT FALSE,
  student_note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enrollments_updated_at
  BEFORE UPDATE ON enrollments
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- enrollment_documents 테이블
-- ============================================
CREATE TABLE enrollment_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  uploaded_by document_uploader NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL DEFAULT 0,
  mime_type TEXT NOT NULL DEFAULT 'application/octet-stream',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- RLS (Row Level Security)
-- ============================================
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollment_documents ENABLE ROW LEVEL SECURITY;

-- 학생: 자기 수속만 조회/생성
CREATE POLICY "Students can view own enrollments"
  ON enrollments FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Students can create own enrollments"
  ON enrollments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 관리자: 모든 수속 조회/수정
CREATE POLICY "Admins can view all enrollments"
  ON enrollments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can update all enrollments"
  ON enrollments FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role = 'ADMIN'
    )
  );

-- 서류: 자기 수속의 서류 조회
CREATE POLICY "Students can view own documents"
  ON enrollment_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = enrollment_documents.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

-- 서류: 학생은 자기 수속에 서류 업로드
CREATE POLICY "Students can upload own documents"
  ON enrollment_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = enrollment_documents.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

-- 서류: 학생은 자기 수속의 서류 삭제
CREATE POLICY "Students can delete own documents"
  ON enrollment_documents FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = enrollment_documents.enrollment_id
      AND enrollments.user_id = auth.uid()
    )
  );

-- 서류: 관리자는 모든 서류 조회/업로드
CREATE POLICY "Admins can view all documents"
  ON enrollment_documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role = 'ADMIN'
    )
  );

CREATE POLICY "Admins can upload all documents"
  ON enrollment_documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM members
      WHERE members.id = auth.uid()
      AND members.role = 'ADMIN'
    )
  );

-- ============================================
-- 인덱스
-- ============================================
CREATE INDEX idx_enrollments_user_id ON enrollments(user_id);
CREATE INDEX idx_enrollments_status ON enrollments(status);
CREATE INDEX idx_enrollment_documents_enrollment_id ON enrollment_documents(enrollment_id);
