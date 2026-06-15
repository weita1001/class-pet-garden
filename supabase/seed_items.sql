-- 补充玩具类道具（快乐值）和治疗药品
INSERT INTO items (id, name, category, rarity, icon, effect) VALUES
('toy_ball', '皮球', 'decoration', 'common', '⚽', '{"happiness":15}'),
('toy_yarn', '毛线球', 'decoration', 'common', '🧶', '{"happiness":20}'),
('toy_bone', '骨头玩具', 'decoration', 'common', '🦴', '{"happiness":10}')
ON CONFLICT (id) DO NOTHING;
