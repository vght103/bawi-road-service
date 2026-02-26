-- ============================================================
-- Migration: expand_academies
-- Date: 2026-02-26
--
-- Part 1a: Ensure schema matches (rename, drop, detail columns)
-- Part 1b: Add 5 new columns to academies table
-- Part 2: Update existing 6 academies with new + detail data
-- Part 3: Insert 15 new academies
-- ============================================================

-- ============================================================
-- PART 1a: Ensure schema matches current state
-- (style -> academy_system rename, rating removal, detail columns)
-- These may already exist on the live DB; IF NOT EXISTS / IF EXISTS for safety.
-- ============================================================

-- Rename style -> academy_system (skip if already renamed)
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'academies' AND column_name = 'style') THEN
    ALTER TABLE academies RENAME COLUMN style TO academy_system;
  END IF;
END $$;

-- Drop rating column if it still exists
ALTER TABLE academies DROP COLUMN IF EXISTS rating;

-- Ensure detail columns exist (may have been added via dashboard)
ALTER TABLE academies ADD COLUMN IF NOT EXISTS address text;
ALTER TABLE academies ADD COLUMN IF NOT EXISTS short_desc text;
ALTER TABLE academies ADD COLUMN IF NOT EXISTS description text;
ALTER TABLE academies ADD COLUMN IF NOT EXISTS facilities text[];
ALTER TABLE academies ADD COLUMN IF NOT EXISTS pros text[];
ALTER TABLE academies ADD COLUMN IF NOT EXISTS cons text[];
ALTER TABLE academies ADD COLUMN IF NOT EXISTS recommended_for text[];

-- ============================================================
-- PART 1b: Add 5 new comparison columns
-- ============================================================

ALTER TABLE academies ADD COLUMN IF NOT EXISTS established_year integer;
ALTER TABLE academies ADD COLUMN IF NOT EXISTS capacity integer;
ALTER TABLE academies ADD COLUMN IF NOT EXISTS korean_ratio text;
ALTER TABLE academies ADD COLUMN IF NOT EXISTS location_detail text;
ALTER TABLE academies ADD COLUMN IF NOT EXISTS website text;

-- ============================================================
-- PART 2: UPDATE existing 6 academies
-- ============================================================

-- id=1: SMEAG Capital
UPDATE academies SET
  established_year = 2006,
  capacity = 400,
  korean_ratio = '약 40%',
  location_detail = '세부 시티',
  website = 'https://smeag.com',
  address = 'Emilio Osmeña St, Guadalupe, Cebu City',
  short_desc = '세부 최대 규모 스파르타 어학원. IELTS/TOEIC 공인시험 센터 보유.',
  description = 'SMEAG Capital은 2006년 설립된 세부 최대 규모의 어학원입니다. IELTS, TOEIC 공인시험 센터를 운영하여 별도 이동 없이 시험 응시가 가능합니다. 스파르타 캠퍼스로 평일 외출 불가이며, 체계적인 커리큘럼과 높은 학업 강도로 단기간 실력 향상에 최적화되어 있습니다.',
  facilities = ARRAY['수영장','헬스장','카페테리아','자습실','매점','세탁 서비스'],
  pros = ARRAY['IELTS/TOEIC 공인시험 센터 보유','대형 캠퍼스, 다양한 부대시설','체계적인 스파르타 커리큘럼'],
  cons = ARRAY['평일 외출 불가 (스파르타)','노후된 건물 일부 있음','한국인 비율 높은 편'],
  recommended_for = ARRAY['IELTS/TOEIC 점수가 필요한 분','단기 집중으로 실력을 올리고 싶은 분','자기 관리가 어려운 분']
WHERE id = '1';

-- id=2: CPI
UPDATE academies SET
  established_year = 2015,
  capacity = 250,
  korean_ratio = '약 30~40%',
  location_detail = '막탄 뉴타운 인근',
  website = 'https://cpiedu.net',
  address = 'Lapu-Lapu City, Mactan, Cebu',
  short_desc = '리조트형 캠퍼스의 세미스파르타. 쾌적한 환경에서 효율적 학습.',
  description = 'CPI는 2015년 개원한 리조트형 어학원입니다. 수영장, 헬스장 등 프리미엄 시설과 깔끔한 기숙사를 제공합니다. 세미스파르타 시스템으로 평일 저녁까지 의무자습이 있으며, ESL과 스피킹 과정에 강점이 있습니다.',
  facilities = ARRAY['수영장','헬스장','카페','자습실','와이파이 라운지','세탁실'],
  pros = ARRAY['리조트급 시설과 깔끔한 기숙사','균형 잡힌 세미스파르타 시스템','다양한 액티비티 프로그램'],
  cons = ARRAY['시내와 다소 거리 있음','일부 시간대 와이파이 제한','가격대가 약간 높은 편'],
  recommended_for = ARRAY['쾌적한 환경에서 공부하고 싶은 분','ESL/스피킹 실력을 올리고 싶은 분','적당한 학업 강도를 원하는 분']
WHERE id = '2';

-- id=3: PINES Main
UPDATE academies SET
  established_year = 2001,
  capacity = 270,
  korean_ratio = '약 30~40%',
  location_detail = '바기오 시내',
  website = 'https://pinesacademy.com',
  address = 'Cooyeesan Plaza, Naguilian Road, Baguio City',
  short_desc = '바기오 명문 스파르타. 시원한 기후에서 집중 학습.',
  description = 'PINES는 2001년 설립된 바기오의 대표 스파르타 어학원입니다. 시원한 바기오 기후와 EOP(English Only Policy)를 통해 영어 몰입 환경을 제공합니다. IELTS 보장반이 유명하며, 체계적인 레벨 테스트와 커리큘럼을 운영합니다.',
  facilities = ARRAY['자습실','카페테리아','헬스장','매점','세탁 서비스','공용 라운지'],
  pros = ARRAY['바기오 시원한 기후, 학습 집중도 높음','IELTS 보장반 명성','엄격한 EOP 운영'],
  cons = ARRAY['마닐라에서 버스 5~6시간','주변 편의시설 부족','엄격한 규율이 부담될 수 있음'],
  recommended_for = ARRAY['IELTS 점수가 필요한 분','영어 몰입 환경을 원하는 분','더운 날씨를 피하고 싶은 분']
WHERE id = '3';

-- id=4: EV Academy
UPDATE academies SET
  established_year = 2004,
  capacity = 300,
  korean_ratio = '약 30~40%',
  location_detail = '세부 시티',
  website = 'https://ev-academy.com',
  address = 'Governor M. Cuenco Ave, Cebu City',
  short_desc = '세부 시내 신축 캠퍼스. 체계적 커리큘럼의 세미스파르타.',
  description = 'EV Academy는 2004년 설립, 2017년 신축 캠퍼스로 이전한 세부의 인기 어학원입니다. 깔끔한 시설과 체계적인 커리큘럼으로 유명합니다. 스파르타/세미스파르타 코스를 선택할 수 있어 유연하며, 비즈니스 영어 과정도 인기입니다.',
  facilities = ARRAY['수영장','헬스장','카페','시네마룸','자습실','매점'],
  pros = ARRAY['2017년 신축 깔끔한 시설','스파르타/세미스파르타 선택 가능','세부 시내 편리한 위치'],
  cons = ARRAY['인기가 많아 조기 마감 잦음','주말 액티비티 별도 비용','한국인 비율이 높아질 수 있음'],
  recommended_for = ARRAY['깔끔한 시설을 중시하는 분','비즈니스 영어가 필요한 분','세부 시내 편리한 위치를 원하는 분']
WHERE id = '4';

-- id=5: CIA Academy
UPDATE academies SET
  established_year = 2003,
  capacity = 250,
  korean_ratio = '약 30~40%',
  location_detail = '세부 막탄',
  website = 'https://cia-academy.com',
  address = 'Mactan Newtown, Lapu-Lapu City, Cebu',
  short_desc = '막탄 신캠퍼스의 세미스파르타. 바다 근처 리조트형.',
  description = 'CIA Academy는 2003년 설립되어 2022년 막탄 신캠퍼스로 이전했습니다. 바다 근처 리조트 캠퍼스에서 학습과 여가를 동시에 즐길 수 있습니다. 의무 단어 테스트, TOEFL/TOEIC 전문 과정 등 체계적인 관리 시스템을 갖추고 있습니다.',
  facilities = ARRAY['수영장','헬스장','카페테리아','자습실','농구장','매점'],
  pros = ARRAY['2022년 신축 막탄 캠퍼스','바다 인접 리조트 환경','TOEFL/TOEIC 전문 과정'],
  cons = ARRAY['세부 시내와 다소 거리','리조트 환경이 학업 방해 가능','막탄 지역 외식 옵션 제한'],
  recommended_for = ARRAY['리조트 환경에서 공부하고 싶은 분','TOEFL/TOEIC 점수가 필요한 분','바다 근처를 선호하는 분']
WHERE id = '5';

-- id=6: BECI Main
UPDATE academies SET
  established_year = 2003,
  capacity = 150,
  korean_ratio = '약 30~40%',
  location_detail = '바기오 시내',
  website = 'https://beciedu.com',
  address = '381 Purok 7, Dongtogan, Baguio City',
  short_desc = '바기오 대표 세미스파르타. SP트레이너 발음 교정 특화.',
  description = 'BECI는 2003년 설립된 바기오의 대표 세미스파르타 어학원입니다. 독자적인 SP(Speaking Prescription) 트레이너 프로그램으로 발음 교정에 강점이 있습니다. 영상 촬영 후 발음 분석 피드백을 제공하며, 소규모 운영으로 관리가 세심합니다.',
  facilities = ARRAY['자습실','카페테리아','헬스장','공용 라운지','세탁실','정원'],
  pros = ARRAY['SP 발음 교정 프로그램 독보적','소규모 운영으로 세심한 관리','바기오 시원한 기후'],
  cons = ARRAY['시설이 다소 노후','소규모라 코스 선택폭 좁음','바기오 접근성 (마닐라에서 5~6시간)'],
  recommended_for = ARRAY['발음 교정이 필요한 분','소규모 환경을 선호하는 분','스피킹 중심 학습을 원하는 분']
WHERE id = '6';

-- ============================================================
-- PART 3: INSERT 15 new academies (id 7~21)
-- ============================================================

-- id=7: CPILS
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '7',
  'CPILS',
  '세부',
  '스파르타',
  '2001년 세부 최초 설립 어학원. IELTS/TOEIC 공인시험 센터 보유. 원어민 수업 포함 다양한 프로그램.',
  ARRAY['ESL','IELTS','TOEIC'],
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"ESL General","category":"ESL","manToMan":4,"group":3,"optional":1,"pricePerWeek":200000,"desc":"1:1 4시간 + 그룹 3시간 + 선택 1시간. 기초부터 중급까지 전반적인 영어 실력 향상."},
    {"name":"ESL Intensive","category":"ESL","manToMan":5,"group":3,"optional":0,"pricePerWeek":250000,"desc":"1:1 5시간 + 그룹 3시간. 집중적인 ESL 학습으로 빠른 실력 향상."},
    {"name":"IELTS Preparation","category":"IELTS","manToMan":4,"group":4,"optional":0,"pricePerWeek":300000,"desc":"1:1 4시간 + 그룹 4시간. IELTS 전문 대비 과정."},
    {"name":"TOEIC Intensive","category":"TOEIC","manToMan":4,"group":3,"optional":1,"pricePerWeek":250000,"desc":"1:1 4시간 + 그룹 3시간 + 선택 1시간. TOEIC 집중 대비."}
  ]'::jsonb,
  '[
    {"type":"1인실","pricePerWeek":300000,"meals":"주3식","desc":"1인실 개인 공간. 주 3식 식사 포함."},
    {"type":"2인실","pricePerWeek":220000,"meals":"주3식","desc":"2인실 룸메이트 배정. 주 3식 식사 포함."},
    {"type":"3인실","pricePerWeek":180000,"meals":"주3식","desc":"3인실 공유. 주 3식 식사 포함."},
    {"type":"4인실","pricePerWeek":150000,"meals":"주3식","desc":"4인실 공유. 가장 경제적인 옵션."}
  ]'::jsonb,
  2001, 300, '약 35%', '세부 시티', 'https://cpils.com',
  'MJ Cuenco Ave, Cebu City',
  '세부 최초 어학원. IELTS/TOEIC 공인센터 보유.',
  'CPILS는 2001년 세부 최초로 설립된 역사 깊은 어학원입니다. 한국 정부 최초 인증 어학원으로, 원어민 강사 수업을 포함한 다양한 프로그램을 제공합니다. IELTS/TOEIC 공인시험 센터를 운영하여 캠퍼스 내에서 시험 응시가 가능합니다.',
  ARRAY['수영장','헬스장','카페테리아','자습실','매점','세탁실','농구장'],
  ARRAY['세부 최초 설립, 긴 운영 노하우','IELTS/TOEIC 공인시험 센터','원어민 강사 수업 포함'],
  ARRAY['건물이 다소 노후','스파르타 규율이 엄격','시설 현대화 부족'],
  ARRAY['IELTS/TOEIC 점수가 필요한 분','원어민 수업을 원하는 분','체계적 스파르타를 원하는 분']
);

-- id=8: Philinter
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '8',
  'Philinter',
  '세부',
  '세미스파르타',
  '막탄 위치의 다국적 어학원. 국적 쿼터제로 한국인 비율 극히 낮으며 다양한 국적의 학생과 교류 가능.',
  ARRAY['ESL','IELTS','비즈니스'],
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"ESL Intensive","category":"ESL","manToMan":4,"group":3,"optional":1,"pricePerWeek":200000,"desc":"1:1 4시간 + 그룹 3시간 + 선택 1시간. 균형 잡힌 ESL 과정."},
    {"name":"Power Speaking","category":"ESL","manToMan":5,"group":2,"optional":1,"pricePerWeek":250000,"desc":"1:1 5시간 + 그룹 2시간 + 선택 1시간. 스피킹 집중 과정."},
    {"name":"IELTS Foundation","category":"IELTS","manToMan":4,"group":4,"optional":0,"pricePerWeek":280000,"desc":"1:1 4시간 + 그룹 4시간. IELTS 기초 대비 과정."},
    {"name":"Business English","category":"비즈니스","manToMan":4,"group":2,"optional":2,"pricePerWeek":250000,"desc":"1:1 4시간 + 그룹 2시간 + 선택 2시간. 비즈니스 영어 특화."}
  ]'::jsonb,
  '[
    {"type":"1인실","pricePerWeek":280000,"meals":"주3식","desc":"1인실 개인 공간. 주 3식 식사 포함."},
    {"type":"2인실","pricePerWeek":200000,"meals":"주3식","desc":"2인실 룸메이트 배정. 주 3식 식사 포함."},
    {"type":"3인실","pricePerWeek":170000,"meals":"주3식","desc":"3인실 공유. 주 3식 식사 포함."}
  ]'::jsonb,
  2003, 150, '약 5% 이하', '막탄', 'https://philinter.com',
  'Mustang, Pusok, Lapu-Lapu City, Cebu',
  '국적 쿼터제 운영. 한국인 5% 이하의 다국적 환경.',
  'Philinter는 2003년 설립된 막탄 소재 다국적 어학원입니다. 엄격한 국적 쿼터제를 운영하여 한국인 비율이 5% 이하로, 다양한 국적의 학생들과 자연스럽게 영어를 사용할 수 있습니다. 레벨별 맞춤 수업과 세심한 학생 관리가 장점입니다.',
  ARRAY['수영장','자습실','카페테리아','공용 라운지','매점','세탁실'],
  ARRAY['한국인 비율 극히 낮음 (5% 이하)','다양한 국적의 학생과 교류','레벨별 세심한 맞춤 관리'],
  ARRAY['한국어 지원 인력 부족','기숙사 시설이 보통','막탄 위치로 시내 접근 불편'],
  ARRAY['다국적 환경을 원하는 분','영어 사용 환경에 몰입하고 싶은 분','비즈니스 영어가 필요한 분']
);

-- id=9: QQ English IT Park
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '9',
  'QQ English IT Park',
  '세부',
  '자율형',
  'IT Park 위치의 자율형 어학원. Callan Method 영국식 교수법 도입. 다국적 학생 80% 이상.',
  ARRAY['ESL','스피킹'],
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"Light Plan","category":"ESL","manToMan":4,"group":0,"optional":2,"pricePerWeek":180000,"desc":"1:1 4시간 + 선택 2시간. 가벼운 학습 플랜."},
    {"name":"Standard Plan","category":"ESL","manToMan":6,"group":0,"optional":2,"pricePerWeek":250000,"desc":"1:1 6시간 + 선택 2시간. 표준 학습 플랜."},
    {"name":"Superior Plan","category":"ESL","manToMan":8,"group":0,"optional":0,"pricePerWeek":320000,"desc":"1:1 8시간. 최대 맨투맨 집중 플랜."}
  ]'::jsonb,
  '[
    {"type":"1인실 호텔","pricePerWeek":350000,"meals":"조식","desc":"호텔 1인실. 조식 포함."},
    {"type":"2인실 콘도","pricePerWeek":220000,"meals":"조식","desc":"콘도 2인실. 조식 포함."}
  ]'::jsonb,
  2009, 300, '약 10~15%', 'IT Park', 'https://qqenglish.jp',
  'IT Park, Apas, Cebu City',
  'Callan Method 도입. IT Park 중심 자율형 다국적 어학원.',
  'QQ English는 2009년 설립된 자율형 어학원으로, 세부 IT Park 중심에 위치합니다. 영국에서 개발된 Callan Method를 도입하여 스피킹 실력을 빠르게 향상시킵니다. 다국적 학생 비율 80% 이상으로, 자유로운 분위기에서 글로벌 교류가 가능합니다.',
  ARRAY['카페테리아','자습실','라운지','와이파이 전관','매점'],
  ARRAY['IT Park 중심 편리한 위치','Callan Method 스피킹 특화','다국적 학생 80% 이상'],
  ARRAY['기숙사가 외부 호텔/콘도','자율형이라 자기 관리 필요','한국 음식 제공 없음'],
  ARRAY['자유로운 분위기를 원하는 분','스피킹 집중 향상을 원하는 분','다국적 친구를 사귀고 싶은 분']
);

-- id=10: CELLA Premium
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '10',
  'CELLA Premium',
  '세부',
  '세미스파르타',
  '호텔급 기숙사의 프리미엄 어학원. 승무원 영어, 워킹홀리데이 특화 과정 운영.',
  ARRAY['ESL','스피킹','비즈니스'],
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"Power Speaking","category":"ESL","manToMan":4,"group":2,"optional":2,"pricePerWeek":220000,"desc":"1:1 4시간 + 그룹 2시간 + 선택 2시간. 스피킹 중심 과정."},
    {"name":"Intensive ESL","category":"ESL","manToMan":6,"group":1,"optional":1,"pricePerWeek":280000,"desc":"1:1 6시간 + 그룹 1시간 + 선택 1시간. 집중 ESL 과정."},
    {"name":"ACE (승무원 과정)","category":"비즈니스","manToMan":4,"group":2,"optional":2,"pricePerWeek":250000,"desc":"1:1 4시간 + 그룹 2시간 + 선택 2시간. 항공 승무원 영어 특화 과정."},
    {"name":"IELTS Preparation","category":"IELTS","manToMan":4,"group":4,"optional":0,"pricePerWeek":280000,"desc":"1:1 4시간 + 그룹 4시간. IELTS 전문 대비 과정."}
  ]'::jsonb,
  '[
    {"type":"1인실","pricePerWeek":320000,"meals":"주3식","desc":"호텔급 1인실. 주 3식 식사 포함."},
    {"type":"2인실","pricePerWeek":240000,"meals":"주3식","desc":"호텔급 2인실. 주 3식 식사 포함."}
  ]'::jsonb,
  2006, 120, '약 35~45%', '바닐라드', 'https://cellaenglish.com',
  'AS Fortuna St, Barangay Banilad, Cebu City',
  '호텔급 시설의 프리미엄. 승무원/워홀 특화.',
  'CELLA Premium은 2006년 설립된 프리미엄 어학원입니다. 호텔급 기숙사와 깔끔한 시설을 제공하며, 승무원 영어(ACE), 워킹홀리데이 준비 과정 등 특화 프로그램이 돋보입니다. 소규모 운영으로 세심한 관리가 가능합니다.',
  ARRAY['수영장','헬스장','카페','자습실','세탁실','와이파이'],
  ARRAY['호텔급 기숙사 시설','승무원/워홀 특화 과정','소규모 세심한 관리'],
  ARRAY['소규모라 코스 선택폭 제한','한국인 비율 높은 편','가격대 높음'],
  ARRAY['쾌적한 시설을 중시하는 분','승무원/워킹홀리데이 준비 중인 분','소규모 환경을 선호하는 분']
);

-- id=11: Cebu Blue Ocean Academy
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '11',
  'Cebu Blue Ocean Academy',
  '세부',
  '세미스파르타',
  'PINES의 세부 캠퍼스. 막탄 오션뷰 리조트에서 바기오 수준의 커리큘럼 제공.',
  ARRAY['ESL','IELTS','TOEIC'],
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"Light ESL","category":"ESL","manToMan":4,"group":2,"optional":1,"pricePerWeek":200000,"desc":"1:1 4시간 + 그룹 2시간 + 선택 1시간. 가벼운 ESL 과정."},
    {"name":"Intensive ESL","category":"ESL","manToMan":5,"group":2,"optional":1,"pricePerWeek":250000,"desc":"1:1 5시간 + 그룹 2시간 + 선택 1시간. 집중 ESL 과정."},
    {"name":"IELTS Preparation","category":"IELTS","manToMan":4,"group":4,"optional":0,"pricePerWeek":280000,"desc":"1:1 4시간 + 그룹 4시간. IELTS 전문 대비 과정."},
    {"name":"Premium ESL","category":"ESL","manToMan":7,"group":0,"optional":1,"pricePerWeek":350000,"desc":"1:1 7시간 + 선택 1시간. 프리미엄 맨투맨 집중 과정."}
  ]'::jsonb,
  '[
    {"type":"1인실","pricePerWeek":300000,"meals":"주3식","desc":"오션뷰 1인실. 주 3식 식사 포함."},
    {"type":"2인실","pricePerWeek":220000,"meals":"주3식","desc":"오션뷰 2인실. 주 3식 식사 포함."},
    {"type":"3인실","pricePerWeek":180000,"meals":"주3식","desc":"3인실 공유. 주 3식 식사 포함."}
  ]'::jsonb,
  2015, 150, '약 30~40%', '막탄', 'https://caboreal.com',
  'EGI Hotel & Resort, Maribago, Lapu-Lapu City, Cebu',
  'PINES 세부 캠퍼스. 오션뷰 리조트형.',
  'Cebu Blue Ocean Academy는 바기오 명문 PINES가 2015년 세부 막탄에 개원한 캠퍼스입니다. 바다가 보이는 리조트형 시설에서 PINES의 검증된 커리큘럼을 경험할 수 있습니다. 세미스파르타 시스템으로 적당한 학업 강도를 유지합니다.',
  ARRAY['해변','수영장','카페','자습실','헬스장','세탁실'],
  ARRAY['오션뷰 리조트형 캠퍼스','PINES 검증 커리큘럼','바다 접근 가능'],
  ARRAY['리조트 환경이 학업 방해 가능','시내와 거리 있음','기숙사 방 크기 작은 편'],
  ARRAY['바다 근처에서 공부하고 싶은 분','PINES 커리큘럼을 세부에서 원하는 분','리조트 환경을 선호하는 분']
);

-- id=12: I.BREEZE
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '12',
  'I.BREEZE',
  '세부',
  '세미스파르타',
  '2024년 프라임 캠퍼스 신축 이전. 세부 최신 시설의 세미스파르타.',
  ARRAY['ESL','IELTS','스피킹'],
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"Light ESL","category":"ESL","manToMan":3,"group":2,"optional":2,"pricePerWeek":180000,"desc":"1:1 3시간 + 그룹 2시간 + 선택 2시간. 가벼운 ESL 과정."},
    {"name":"Intensive ESL","category":"ESL","manToMan":5,"group":2,"optional":1,"pricePerWeek":250000,"desc":"1:1 5시간 + 그룹 2시간 + 선택 1시간. 집중 ESL 과정."},
    {"name":"IELTS Preparation","category":"IELTS","manToMan":4,"group":4,"optional":0,"pricePerWeek":280000,"desc":"1:1 4시간 + 그룹 4시간. IELTS 전문 대비 과정."},
    {"name":"Power Speaking","category":"ESL","manToMan":6,"group":1,"optional":1,"pricePerWeek":300000,"desc":"1:1 6시간 + 그룹 1시간 + 선택 1시간. 스피킹 집중 과정."}
  ]'::jsonb,
  '[
    {"type":"1인실","pricePerWeek":300000,"meals":"주3식","desc":"신축 1인실. 주 3식 식사 포함."},
    {"type":"2인실","pricePerWeek":220000,"meals":"주3식","desc":"신축 2인실. 주 3식 식사 포함."},
    {"type":"3인실","pricePerWeek":180000,"meals":"주3식","desc":"신축 3인실. 주 3식 식사 포함."},
    {"type":"4인실","pricePerWeek":150000,"meals":"주3식","desc":"신축 4인실. 가장 경제적인 옵션."}
  ]'::jsonb,
  2018, 200, '약 30~40%', '마볼로', 'https://ibreeze.ph',
  'Mabolo, Cebu City',
  '2024 프라임 캠퍼스 신축. 세부 최신 시설.',
  'I.BREEZE는 2018년 설립, 2024년 프라임 캠퍼스로 신축 이전한 세미스파르타 어학원입니다. 세부에서 가장 최신 시설을 자랑하며, 넓은 교실과 쾌적한 기숙사, 수영장 등 프리미엄 환경을 제공합니다.',
  ARRAY['수영장','헬스장','카페','스터디룸','라운지','세탁실','정원'],
  ARRAY['2024년 신축 최신 시설','넓고 쾌적한 학습 환경','균형 잡힌 세미스파르타'],
  ARRAY['신생 어학원으로 운영 노하우 축적 중','마볼로 지역 주변 다소 복잡','인지도가 아직 낮음'],
  ARRAY['최신 시설을 중시하는 분','쾌적한 환경에서 공부하고 싶은 분','ESL/스피킹 향상을 원하는 분']
);

-- id=13: CIJ Academy
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '13',
  'CIJ Academy',
  '세부',
  '세미스파르타',
  '릴로안 바다 전망 리조트형 캠퍼스. 원어민 수업 포함, 여유로운 학습 환경.',
  ARRAY['ESL','스피킹'],
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"ESL Basic","category":"ESL","manToMan":4,"group":2,"optional":1,"pricePerWeek":180000,"desc":"1:1 4시간 + 그룹 2시간 + 선택 1시간. 기초 ESL 과정."},
    {"name":"ESL Intensive","category":"ESL","manToMan":6,"group":1,"optional":1,"pricePerWeek":250000,"desc":"1:1 6시간 + 그룹 1시간 + 선택 1시간. 집중 ESL 과정."},
    {"name":"Native Speaking","category":"ESL","manToMan":4,"group":2,"optional":1,"pricePerWeek":280000,"desc":"1:1 4시간(원어민 2시간 포함) + 그룹 2시간 + 선택 1시간. 원어민 스피킹 과정."}
  ]'::jsonb,
  '[
    {"type":"1인실","pricePerWeek":280000,"meals":"주3식","desc":"리조트형 1인실. 주 3식 식사 포함."},
    {"type":"2인실","pricePerWeek":200000,"meals":"주3식","desc":"리조트형 2인실. 주 3식 식사 포함."},
    {"type":"3인실","pricePerWeek":170000,"meals":"주3식","desc":"리조트형 3인실. 주 3식 식사 포함."}
  ]'::jsonb,
  2012, 100, '약 40~50%', '릴로안', 'https://cijacademy.com',
  'Liloan, Cebu',
  '바다 전망 리조트형. 원어민 수업 포함.',
  'CIJ Academy는 2012년 설립된 릴로안 소재 리조트형 어학원입니다. 바다 전망의 아름다운 캠퍼스에서 원어민 강사 수업을 포함한 프로그램을 제공합니다. 소규모 운영으로 가족적인 분위기가 특징입니다.',
  ARRAY['수영장','해변','자습실','카페테리아','세탁실','정원'],
  ARRAY['바다 전망 리조트형 캠퍼스','원어민 강사 수업 포함','소규모 가족적 분위기'],
  ARRAY['릴로안 위치로 시내 접근 불편','소규모라 코스 제한적','한국인 비율 높은 편'],
  ARRAY['리조트 환경을 좋아하는 분','원어민 수업을 원하는 분','소규모 환경을 선호하는 분']
);

-- id=14: GLC
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '14',
  'GLC',
  '세부',
  '자율형',
  '세부 최대 규모 550명 수용. 한국인 0~5%의 완전 다국적 환경. 자유로운 분위기.',
  ARRAY['ESL','스피킹'],
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"General ESL","category":"ESL","manToMan":4,"group":2,"optional":2,"pricePerWeek":180000,"desc":"1:1 4시간 + 그룹 2시간 + 선택 2시간. 일반 ESL 과정."},
    {"name":"Intensive ESL","category":"ESL","manToMan":6,"group":1,"optional":1,"pricePerWeek":250000,"desc":"1:1 6시간 + 그룹 1시간 + 선택 1시간. 집중 ESL 과정."},
    {"name":"Power Speaking","category":"ESL","manToMan":5,"group":2,"optional":1,"pricePerWeek":230000,"desc":"1:1 5시간 + 그룹 2시간 + 선택 1시간. 스피킹 강화 과정."}
  ]'::jsonb,
  '[
    {"type":"1인실","pricePerWeek":280000,"meals":"주3식","desc":"1인실 개인 공간. 주 3식 식사 포함."},
    {"type":"2인실","pricePerWeek":200000,"meals":"주3식","desc":"2인실 룸메이트 배정. 주 3식 식사 포함."},
    {"type":"4인실","pricePerWeek":150000,"meals":"주3식","desc":"4인실 공유. 경제적인 옵션."},
    {"type":"6인실","pricePerWeek":120000,"meals":"주3식","desc":"6인실 공유. 가장 경제적인 옵션."}
  ]'::jsonb,
  2012, 550, '약 0~5%', '마볼로', 'https://glcenglish.com',
  'Don Gil Garcia St, Mabolo, Cebu City',
  '세부 최대 550명. 한국인 0~5% 다국적.',
  'GLC(Global Language Cebu)는 세부 최대 규모 550명 수용의 대형 어학원입니다. 한국인 비율이 0~5%로 극히 낮으며, 일본, 대만, 베트남 등 다양한 국적의 학생들과 자연스러운 영어 사용이 가능합니다. 자율형 시스템으로 자유로운 분위기입니다.',
  ARRAY['수영장','헬스장','카페테리아','자습실','매점','세탁실','농구장','요가룸'],
  ARRAY['한국인 비율 극히 낮음 (0~5%)','세부 최대 규모 550명','자유로운 자율형 분위기'],
  ARRAY['자기 관리 능력 필수','한국어 지원 매우 부족','한국 음식 미제공'],
  ARRAY['한국인 없는 환경을 원하는 분','자유로운 분위기를 선호하는 분','다국적 친구를 사귀고 싶은 분']
);

-- id=15: HELP (롱롱)
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '15',
  'HELP (롱롱)',
  '바기오',
  '스파르타',
  '1996년 설립 필리핀 스파르타의 원조. IDP IELTS 공인 시험장 보유. 엄격한 규율.',
  ARRAY['ESL','IELTS'],
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"ESL 4","category":"ESL","manToMan":4,"group":2,"optional":2,"pricePerWeek":180000,"desc":"1:1 4시간 + 그룹 2시간 + 선택 2시간. 기본 ESL 과정."},
    {"name":"ESL 6","category":"ESL","manToMan":6,"group":1,"optional":1,"pricePerWeek":250000,"desc":"1:1 6시간 + 그룹 1시간 + 선택 1시간. 집중 ESL 과정."},
    {"name":"IELTS Preparation","category":"IELTS","manToMan":4,"group":4,"optional":0,"pricePerWeek":280000,"desc":"1:1 4시간 + 그룹 4시간. IELTS 대비 과정."},
    {"name":"IELTS 보장반","category":"IELTS","manToMan":4,"group":4,"optional":0,"pricePerWeek":300000,"desc":"1:1 4시간 + 그룹 4시간. 목표 점수 보장 IELTS 과정."}
  ]'::jsonb,
  '[
    {"type":"2인실","pricePerWeek":180000,"meals":"주3식","desc":"2인실 룸메이트 배정. 주 3식 식사 포함."},
    {"type":"3인실","pricePerWeek":150000,"meals":"주3식","desc":"3인실 공유. 주 3식 식사 포함."},
    {"type":"4인실","pricePerWeek":120000,"meals":"주3식","desc":"4인실 공유. 경제적인 옵션."},
    {"type":"6인실","pricePerWeek":100000,"meals":"주3식","desc":"6인실 공유. 가장 경제적인 옵션."}
  ]'::jsonb,
  1996, 300, '약 40~50%', '롱롱', 'https://helpacademy.com',
  'Long Long, La Trinidad, Benguet',
  '1996 스파르타 원조. IDP IELTS 공인 시험장.',
  'HELP는 1996년 설립된 필리핀 스파르타 어학원의 원조입니다. 롱롱 산속에 위치하여 외부 유혹 없이 학습에만 집중할 수 있습니다. IDP IELTS 공인 시험장을 보유하고 있으며, 30년 가까운 운영 노하우로 체계적인 커리큘럼을 제공합니다.',
  ARRAY['자습실','카페테리아','헬스장','농구장','매점','세탁실'],
  ARRAY['1996년 설립, 스파르타 원조','IDP IELTS 공인 시험장 보유','산속 위치, 학습 집중도 최고'],
  ARRAY['산속 위치로 외부 접근 매우 불편','시설이 오래됨','엄격한 규율이 부담될 수 있음'],
  ARRAY['강도 높은 스파르타를 원하는 분','IELTS 점수가 반드시 필요한 분','외부 유혹을 차단하고 싶은 분']
);

-- id=16: JIC
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '16',
  'JIC',
  '바기오',
  '세미스파르타',
  'IELTS 보장반과 AI 스피킹 시스템으로 유명. Camp 7 인근 접근성 좋은 위치.',
  ARRAY['ESL','IELTS','스피킹'],
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"Power ESL","category":"ESL","manToMan":4,"group":3,"optional":1,"pricePerWeek":180000,"desc":"1:1 4시간 + 그룹 3시간 + 선택 1시간. ESL 기본 과정."},
    {"name":"Intensive ESL","category":"ESL","manToMan":6,"group":1,"optional":1,"pricePerWeek":250000,"desc":"1:1 6시간 + 그룹 1시간 + 선택 1시간. 집중 ESL 과정."},
    {"name":"IELTS 보장반","category":"IELTS","manToMan":4,"group":4,"optional":0,"pricePerWeek":300000,"desc":"1:1 4시간 + 그룹 4시간. 목표 점수 보장 IELTS 과정."},
    {"name":"IELTS Regular","category":"IELTS","manToMan":4,"group":3,"optional":1,"pricePerWeek":250000,"desc":"1:1 4시간 + 그룹 3시간 + 선택 1시간. IELTS 일반 대비 과정."}
  ]'::jsonb,
  '[
    {"type":"1인실","pricePerWeek":250000,"meals":"주3식","desc":"1인실 개인 공간. 주 3식 식사 포함."},
    {"type":"2인실","pricePerWeek":180000,"meals":"주3식","desc":"2인실 룸메이트 배정. 주 3식 식사 포함."},
    {"type":"3인실","pricePerWeek":150000,"meals":"주3식","desc":"3인실 공유. 주 3식 식사 포함."},
    {"type":"4인실","pricePerWeek":120000,"meals":"주3식","desc":"4인실 공유. 가장 경제적인 옵션."}
  ]'::jsonb,
  2006, 160, '약 35~45%', 'Camp 7 인근', 'https://jicbaguio.com',
  'Camp 7, Kennon Road, Baguio City',
  'IELTS 보장반 + AI 스피킹. Camp 7 인근.',
  'JIC는 2006년 설립된 바기오의 세미스파르타 어학원입니다. IELTS 보장반이 유명하며, AI 스피킹 시스템을 도입하여 체계적인 발화 연습이 가능합니다. Camp 7 인근에 위치하여 바기오 시내 접근성이 좋습니다.',
  ARRAY['자습실','카페테리아','헬스장','공용 라운지','매점','세탁실'],
  ARRAY['IELTS 보장반 높은 합격률','AI 스피킹 시스템 도입','Camp 7 인근 편리한 위치'],
  ARRAY['시설이 보통 수준','캠퍼스 규모가 작음','주변 편의시설 제한적'],
  ARRAY['IELTS 점수 보장이 필요한 분','AI 기반 스피킹을 체험하고 싶은 분','바기오 접근성을 중시하는 분']
);

-- id=17: WALES
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '17',
  'WALES',
  '바기오',
  '자율형',
  '바기오 시내 최중심 위치. 80명 소규모 자율형. 성인 중심 편안한 분위기.',
  ARRAY['ESL','스피킹'],
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"Flexible ESL","category":"ESL","manToMan":4,"group":1,"optional":2,"pricePerWeek":180000,"desc":"1:1 4시간 + 그룹 1시간 + 선택 2시간. 유연한 ESL 과정."},
    {"name":"Intensive ESL","category":"ESL","manToMan":6,"group":1,"optional":1,"pricePerWeek":250000,"desc":"1:1 6시간 + 그룹 1시간 + 선택 1시간. 집중 ESL 과정."},
    {"name":"IELTS Preparation","category":"IELTS","manToMan":4,"group":3,"optional":1,"pricePerWeek":250000,"desc":"1:1 4시간 + 그룹 3시간 + 선택 1시간. IELTS 대비 과정."}
  ]'::jsonb,
  '[
    {"type":"1인실","pricePerWeek":250000,"meals":"주3식","desc":"1인실 개인 공간. 주 3식 식사 포함."},
    {"type":"2인실","pricePerWeek":180000,"meals":"주3식","desc":"2인실 룸메이트 배정. 주 3식 식사 포함."}
  ]'::jsonb,
  2006, 80, '약 30~40%', '시내 중심', 'https://walesph.com',
  'Baguio City Center, Baguio City',
  '바기오 최중심. 80명 소규모 자율형.',
  'WALES는 2006년 설립된 바기오 시내 최중심에 위치한 소규모 어학원입니다. 80명 규모로 가족적인 분위기이며, 자율형 시스템으로 성인 학생들에게 인기가 많습니다. SM몰, 카페 등이 도보 거리에 있어 생활이 편리합니다.',
  ARRAY['자습실','라운지','카페테리아','세탁실','와이파이'],
  ARRAY['바기오 시내 최중심 위치','소규모 가족적 분위기','자율형으로 성인에게 적합'],
  ARRAY['시설이 소규모','프로그램 다양성 부족','캠퍼스 내 부대시설 제한'],
  ARRAY['바기오 시내 위치를 원하는 분','소규모 편안한 환경을 선호하는 분','자유로운 일정을 원하는 성인']
);

-- id=18: MONOL
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '18',
  'MONOL',
  '바기오',
  '세미스파르타',
  '복습 중심 커리큘럼과 골프 ESL로 유명. 바기오 시내 대규모 캠퍼스.',
  ARRAY['ESL','IELTS','비즈니스'],
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"Regular ESL","category":"ESL","manToMan":3,"group":3,"optional":2,"pricePerWeek":170000,"desc":"1:1 3시간 + 그룹 3시간 + 선택 2시간. 복습 포함 기본 ESL."},
    {"name":"Intensive ESL","category":"ESL","manToMan":5,"group":2,"optional":1,"pricePerWeek":230000,"desc":"1:1 5시간 + 그룹 2시간 + 선택 1시간. 집중 ESL 과정."},
    {"name":"IELTS Preparation","category":"IELTS","manToMan":4,"group":4,"optional":0,"pricePerWeek":270000,"desc":"1:1 4시간 + 그룹 4시간. IELTS 대비 과정."},
    {"name":"Golf ESL","category":"ESL","manToMan":3,"group":1,"optional":0,"pricePerWeek":300000,"desc":"1:1 3시간 + 그룹 1시간 + 골프 2시간. 골프와 영어 병행 과정."}
  ]'::jsonb,
  '[
    {"type":"1인실","pricePerWeek":250000,"meals":"주3식","desc":"1인실 개인 공간. 주 3식 식사 포함."},
    {"type":"2인실","pricePerWeek":180000,"meals":"주3식","desc":"2인실 룸메이트 배정. 주 3식 식사 포함."},
    {"type":"3인실","pricePerWeek":150000,"meals":"주3식","desc":"3인실 공유. 주 3식 식사 포함."},
    {"type":"6인실","pricePerWeek":100000,"meals":"주3식","desc":"6인실 공유. 가장 경제적인 옵션."}
  ]'::jsonb,
  2003, 300, '약 30~40%', '시내', 'https://mymonol.com',
  'Purok 9, Tacay Road, Baguio City',
  '복습 중심 커리큘럼. 골프 ESL 운영.',
  'MONOL은 2003년 설립된 바기오의 대규모 세미스파르타 어학원입니다. 독자적인 3+1 시스템(3시간 수업 + 1시간 복습)으로 체계적인 학습을 지원합니다. 골프 ESL 등 특색 있는 프로그램과 요가, 필라테스 등 다양한 무료 액티비티를 제공합니다.',
  ARRAY['헬스장','요가룸','골프 연습장','사우나','자습실','카페테리아','세탁실'],
  ARRAY['복습 중심 3+1 시스템','골프 ESL 등 특색 프로그램','요가, 필라테스 무료 액티비티'],
  ARRAY['캠퍼스가 시내에서 약간 떨어짐','강사 편차 있을 수 있음','기숙사 방 크기 작은 편'],
  ARRAY['복습 중심 학습을 원하는 분','골프와 영어를 병행하고 싶은 분','다양한 액티비티를 즐기고 싶은 분']
);

-- id=19: A&J e-EDU
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '19',
  'A&J e-EDU',
  '바기오',
  '세미스파르타',
  '미국인 부원장 상주. 원어민 수업과 Crazy ESL로 유명한 소규모 어학원.',
  ARRAY['ESL','스피킹','IELTS'],
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"Power ESL","category":"ESL","manToMan":4,"group":2,"optional":1,"pricePerWeek":170000,"desc":"1:1 4시간 + 그룹 2시간 + 선택 1시간. ESL 기본 과정."},
    {"name":"Intensive ESL","category":"ESL","manToMan":6,"group":1,"optional":1,"pricePerWeek":230000,"desc":"1:1 6시간 + 그룹 1시간 + 선택 1시간. 집중 ESL 과정."},
    {"name":"Crazy ESL","category":"ESL","manToMan":4,"group":2,"optional":2,"pricePerWeek":220000,"desc":"1:1 4시간(원어민 1시간 포함) + 그룹 2시간 + 선택 2시간. 원어민 스피킹 특화."},
    {"name":"IELTS Preparation","category":"IELTS","manToMan":4,"group":3,"optional":1,"pricePerWeek":250000,"desc":"1:1 4시간 + 그룹 3시간 + 선택 1시간. IELTS 대비 과정."}
  ]'::jsonb,
  '[
    {"type":"1인실","pricePerWeek":220000,"meals":"주3식","desc":"1인실 개인 공간. 주 3식 식사 포함."},
    {"type":"2인실","pricePerWeek":170000,"meals":"주3식","desc":"2인실 룸메이트 배정. 주 3식 식사 포함."},
    {"type":"3인실","pricePerWeek":140000,"meals":"주3식","desc":"3인실 공유. 주 3식 식사 포함."}
  ]'::jsonb,
  2008, 65, '약 30~40%', '에코 캠퍼스', 'https://aaboroadenglish.com',
  'Eco Campus, Baguio City',
  '미국인 부원장 상주. Crazy ESL 원어민 수업.',
  'A&J e-EDU는 2008년 설립된 바기오의 소규모 세미스파르타 어학원입니다. 미국인 부원장이 상주하며 원어민 수업을 직접 진행합니다. Crazy ESL이라는 독자적 스피킹 프로그램이 인기이며, 65명 규모로 가족적인 분위기입니다.',
  ARRAY['자습실','카페테리아','공용 라운지','세탁실','정원'],
  ARRAY['미국인 부원장 상주, 원어민 수업','Crazy ESL 스피킹 프로그램','65명 소규모 가족적 분위기'],
  ARRAY['시설이 다소 노후','소규모라 프로그램 제한적','캠퍼스 내 부대시설 부족'],
  ARRAY['원어민 수업을 원하는 분','소규모 가족적 환경을 선호하는 분','스피킹 집중 향상을 원하는 분']
);

-- id=20: CNS
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '20',
  'CNS',
  '바기오',
  '세미스파르타',
  '주니어/시니어 특화 소수정예 60명. 세심한 학생 관리와 안전한 환경.',
  ARRAY['ESL','IELTS'],
  'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"Junior ESL","category":"ESL","manToMan":4,"group":2,"optional":1,"pricePerWeek":200000,"desc":"1:1 4시간 + 그룹 2시간 + 선택 1시간. 주니어 전용 ESL 과정."},
    {"name":"General ESL","category":"ESL","manToMan":4,"group":2,"optional":1,"pricePerWeek":180000,"desc":"1:1 4시간 + 그룹 2시간 + 선택 1시간. 일반 ESL 과정."},
    {"name":"IELTS Preparation","category":"IELTS","manToMan":4,"group":3,"optional":1,"pricePerWeek":250000,"desc":"1:1 4시간 + 그룹 3시간 + 선택 1시간. IELTS 대비 과정."},
    {"name":"Senior ESL","category":"ESL","manToMan":3,"group":2,"optional":1,"pricePerWeek":180000,"desc":"1:1 3시간 + 그룹 2시간 + 선택 1시간. 시니어 맞춤 ESL 과정."}
  ]'::jsonb,
  '[
    {"type":"1인실","pricePerWeek":230000,"meals":"주3식","desc":"1인실 개인 공간. 주 3식 식사 포함."},
    {"type":"2인실","pricePerWeek":170000,"meals":"주3식","desc":"2인실 룸메이트 배정. 주 3식 식사 포함."},
    {"type":"3인실","pricePerWeek":140000,"meals":"주3식","desc":"3인실 공유. 주 3식 식사 포함."}
  ]'::jsonb,
  2006, 60, '약 40~50%', '시내', 'https://cnsbaguio.com',
  'City Camp, Baguio City',
  '주니어/시니어 특화. 60명 소수정예.',
  'CNS는 2006년 설립된 바기오의 소수정예 어학원입니다. 60명 규모로 주니어와 시니어 학생에 특화된 프로그램을 운영합니다. 안전한 환경과 세심한 학생 관리가 특징이며, IELTS 준비 과정도 제공합니다.',
  ARRAY['자습실','카페테리아','공용 라운지','세탁실'],
  ARRAY['60명 소수정예 세심한 관리','주니어/시니어 특화 프로그램','안전한 학습 환경'],
  ARRAY['시설이 소규모','성인 전용 프로그램 제한적','부대시설 부족'],
  ARRAY['주니어(어린이/청소년) 유학','시니어 영어 학습','소규모 안전한 환경을 원하는 분']
);

-- id=21: BECI 스파르타
INSERT INTO academies (
  id, name, region, academy_system, "desc", tags, image,
  courses, dormitories,
  established_year, capacity, korean_ratio, location_detail, website,
  address, short_desc, description, facilities, pros, cons, recommended_for
) VALUES (
  '21',
  'BECI 스파르타',
  '바기오',
  '스파르타',
  '외국인 비율 80% 이상. SP 스피킹 시스템의 스파르타 버전. BECI의 집중 캠퍼스.',
  ARRAY['ESL','스피킹','IELTS'],
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=600&q=80',
  '[
    {"name":"Speed ESL","category":"ESL","manToMan":4,"group":3,"optional":1,"pricePerWeek":180000,"desc":"1:1 4시간 + 그룹 3시간 + 선택 1시간. ESL 기본 과정."},
    {"name":"Intensive ESL","category":"ESL","manToMan":6,"group":1,"optional":1,"pricePerWeek":250000,"desc":"1:1 6시간 + 그룹 1시간 + 선택 1시간. 집중 ESL 과정."},
    {"name":"SP Program","category":"ESL","manToMan":4,"group":2,"optional":2,"pricePerWeek":220000,"desc":"1:1 4시간 + 그룹 2시간 + 선택 2시간. SP 발음 교정 특화 과정."},
    {"name":"IELTS Preparation","category":"IELTS","manToMan":4,"group":4,"optional":0,"pricePerWeek":270000,"desc":"1:1 4시간 + 그룹 4시간. IELTS 전문 대비 과정."}
  ]'::jsonb,
  '[
    {"type":"1인실","pricePerWeek":230000,"meals":"주3식","desc":"1인실 개인 공간. 주 3식 식사 포함."},
    {"type":"2인실","pricePerWeek":170000,"meals":"주3식","desc":"2인실 룸메이트 배정. 주 3식 식사 포함."},
    {"type":"4인실","pricePerWeek":120000,"meals":"주3식","desc":"4인실 공유. 가장 경제적인 옵션."}
  ]'::jsonb,
  2017, 100, '약 15~20%', '시내 인근', 'https://beciedu.com',
  'Green Valley, Baguio City',
  '외국인 80%+. BECI의 스파르타 캠퍼스.',
  'BECI 스파르타는 2017년 개원한 BECI의 스파르타 전용 캠퍼스입니다. 외국인 학생 비율이 80% 이상으로 자연스러운 영어 사용 환경을 제공합니다. BECI의 독자적인 SP(Speaking Prescription) 시스템을 스파르타 환경에서 더욱 집중적으로 체험할 수 있습니다.',
  ARRAY['자습실','카페테리아','헬스장','공용 라운지','세탁실'],
  ARRAY['외국인 비율 80% 이상','SP 스피킹 시스템 집중','스파르타 환경에서 몰입 학습'],
  ARRAY['한국어 지원 인력 부족','스파르타 규율이 엄격','시설이 보통 수준'],
  ARRAY['외국인 비율 높은 환경을 원하는 분','스파르타 환경에서 몰입하고 싶은 분','스피킹 교정이 필요한 분']
);
