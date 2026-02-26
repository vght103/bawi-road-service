-- Fix broken unsplash image URLs (404)
-- Replacing 3 invalid photo IDs:
--   photo-1523050854058-8df90110c9f1 -> photo-1610484826967-09c5720778c7 (campus)
--   photo-1560785477-d43d2a50e9ad   -> photo-1523240795612-9a054b0db644 (students)
--   photo-1594312915251-48db9280c8f0 -> photo-1454165804606-c3d57bc86b40 (study)

-- id=2 CPI img3
UPDATE academies SET images[3] = 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=900&q=80' WHERE id = '2';

-- id=5 CIA img2
UPDATE academies SET images[2] = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80' WHERE id = '5';

-- id=7 CPILS img1, img2
UPDATE academies SET
  images[1] = 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=900&q=80',
  images[2] = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80'
WHERE id = '7';

-- id=14 GLC img3
UPDATE academies SET images[3] = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80' WHERE id = '14';

-- id=17 WALES img3
UPDATE academies SET images[3] = 'https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=900&q=80' WHERE id = '17';

-- id=19 A&J e-EDU img2
UPDATE academies SET images[2] = 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=900&q=80' WHERE id = '19';

-- id=21 BECI 스파르타 img2
UPDATE academies SET images[2] = 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=900&q=80' WHERE id = '21';
