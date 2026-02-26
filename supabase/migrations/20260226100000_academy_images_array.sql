-- ============================================================
-- Migration: academy_images_array
-- Date: 2026-02-26
--
-- Converts single `image` TEXT column to `images` TEXT[] column.
-- Updates all 21 academies with 3 images each.
-- ============================================================

-- Step 1: Add new images column as text array
ALTER TABLE academies ADD COLUMN IF NOT EXISTS images text[] DEFAULT '{}';

-- Step 2: Copy existing single image into images array
UPDATE academies SET images = ARRAY[image] WHERE image IS NOT NULL;

-- Step 3: Drop old image column
ALTER TABLE academies DROP COLUMN IF EXISTS image;

-- ============================================================
-- Step 4: Update each academy with 2-3 images
-- First image = existing image (upgraded to w=900)
-- Images 2-3 = new unsplash education/campus photos
-- ============================================================

-- id=1: SMEAG Capital
-- existing: photo-1580582932707
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80'
] WHERE id = '1';

-- id=2: CPI
-- existing: photo-1562774053
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80'
] WHERE id = '2';

-- id=3: PINES Main
-- existing: photo-1503676260728
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=900&q=80'
] WHERE id = '3';

-- id=4: EV Academy
-- existing: photo-1509062522246
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=900&q=80'
] WHERE id = '4';

-- id=5: CIA Academy
-- existing: photo-1517486808906
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1594312915251-48db9280c8f0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=900&q=80'
] WHERE id = '5';

-- id=6: BECI Main
-- existing: photo-1531545514256
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80'
] WHERE id = '6';

-- id=7: CPILS
-- existing: photo-1523050854058
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1560785477-d43d2a50e9ad?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=80'
] WHERE id = '7';

-- id=8: Philinter
-- existing: photo-1562774053
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=900&q=80'
] WHERE id = '8';

-- id=9: QQ English IT Park
-- existing: photo-1541339907198
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=900&q=80'
] WHERE id = '9';

-- id=10: CELLA Premium
-- existing: photo-1580582932707
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80'
] WHERE id = '10';

-- id=11: Cebu Blue Ocean Academy
-- existing: photo-1509062522246
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80'
] WHERE id = '11';

-- id=12: I.BREEZE
-- existing: photo-1497633762265
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=900&q=80'
] WHERE id = '12';

-- id=13: CIJ Academy
-- existing: photo-1524178232363
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80'
] WHERE id = '13';

-- id=14: GLC
-- existing: photo-1519452635265
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1519452635265-7b1fbfd1e4e0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1560785477-d43d2a50e9ad?auto=format&fit=crop&w=900&q=80'
] WHERE id = '14';

-- id=15: HELP (롱롱)
-- existing: photo-1546410531
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80'
] WHERE id = '15';

-- id=16: JIC
-- existing: photo-1503676260728
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1532012197267-da84d127e765?auto=format&fit=crop&w=900&q=80'
] WHERE id = '16';

-- id=17: WALES
-- existing: photo-1571260899304
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1501504905252-473c47e087f8?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=900&q=80'
] WHERE id = '17';

-- id=18: MONOL
-- existing: photo-1517486808906
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1577896851231-70ef18881754?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=900&q=80'
] WHERE id = '18';

-- id=19: A&J e-EDU
-- existing: photo-1522202176988
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1594312915251-48db9280c8f0?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=900&q=80'
] WHERE id = '19';

-- id=20: CNS
-- existing: photo-1427504494785
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1531545514256-b1400bc00f31?auto=format&fit=crop&w=900&q=80'
] WHERE id = '20';

-- id=21: BECI 스파르타
-- existing: photo-1606761568499
UPDATE academies SET images = ARRAY[
  'https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1560785477-d43d2a50e9ad?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=900&q=80'
] WHERE id = '21';
