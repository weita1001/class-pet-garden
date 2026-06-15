-- 在 Supabase SQL Editor 里运行这段代码
INSERT INTO items (id, name, category, rarity, icon, effect) VALUES
('food_apple', '苹果', 'food', 'common', '🍎', '{"hunger":10}'),
('food_cake', '蛋糕', 'food', 'common', '🍰', '{"hunger":25}'),
('food_fish', '小鱼干', 'food', 'common', '🐟', '{"hunger":15}'),
('toy_ball', '皮球', 'toy', 'common', '⚽', '{"happiness":15}'),
('toy_yarn', '毛线球', 'toy', 'common', '🧶', '{"happiness":20}'),
('toy_bone', '骨头玩具', 'toy', 'common', '🦴', '{"happiness":10}'),
('med_bandage', '创可贴', 'special', 'common', '🩹', '{"heal":true}'),
('med_potion', '恢复药水', 'special', 'rare', '🧪', '{"hunger":20,"happiness":20}'),
('med_syringe', '治疗针', 'special', 'legendary', '💉', '{"hunger":50,"happiness":50}')
ON CONFLICT (id) DO NOTHING;
