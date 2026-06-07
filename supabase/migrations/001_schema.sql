-- 班级表
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 学生表
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 宠物表
CREATE TABLE pets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID UNIQUE NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  personality TEXT NOT NULL,
  stage TEXT NOT NULL DEFAULT 'egg',
  hunger INTEGER DEFAULT 100,
  happiness INTEGER DEFAULT 100,
  feed_count INTEGER DEFAULT 0,
  last_fed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 道具表
CREATE TABLE items (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('food', 'decoration', 'special')),
  rarity TEXT NOT NULL CHECK (rarity IN ('common', 'rare', 'legendary')),
  icon TEXT NOT NULL,
  effect JSONB NOT NULL DEFAULT '{}'
);

-- 学生背包
CREATE TABLE inventory (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  item_id TEXT NOT NULL REFERENCES items(id),
  quantity INTEGER DEFAULT 1,
  UNIQUE(student_id, item_id)
);

-- 积分变动日志
CREATE TABLE points_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id UUID NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 抽奖奖池
CREATE TABLE lottery_pools (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tier TEXT NOT NULL CHECK (tier IN ('bronze', 'silver', 'gold')),
  item_id TEXT NOT NULL REFERENCES items(id),
  weight INTEGER NOT NULL DEFAULT 1
);

-- RLS 策略
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE students ENABLE ROW LEVEL SECURITY;
ALTER TABLE pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
ALTER TABLE points_log ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Owner can manage classes" ON classes FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Owner can manage students" ON students FOR ALL USING (
  EXISTS (SELECT 1 FROM classes WHERE classes.id = students.class_id AND classes.user_id = auth.uid())
);
CREATE POLICY "Owner can manage pets" ON pets FOR ALL USING (
  EXISTS (SELECT 1 FROM students JOIN classes ON classes.id = students.class_id WHERE students.id = pets.student_id AND classes.user_id = auth.uid())
);
CREATE POLICY "Owner can manage inventory" ON inventory FOR ALL USING (
  EXISTS (SELECT 1 FROM students JOIN classes ON classes.id = students.class_id WHERE students.id = inventory.student_id AND classes.user_id = auth.uid())
);
CREATE POLICY "Owner can manage points_log" ON points_log FOR ALL USING (
  EXISTS (SELECT 1 FROM students JOIN classes ON classes.id = students.class_id WHERE students.id = points_log.student_id AND classes.user_id = auth.uid())
);

ALTER TABLE items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read items" ON items FOR SELECT USING (auth.role() = 'authenticated');
ALTER TABLE lottery_pools ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read lottery" ON lottery_pools FOR SELECT USING (auth.role() = 'authenticated');

-- Seed data: items catalog
INSERT INTO items (id, name, category, rarity, icon, effect) VALUES
('food_bread', '面包', 'food', 'common', '🍞', '{"hunger": 10}'),
('food_cake', '蛋糕', 'food', 'rare', '🍰', '{"hunger": 25}'),
('food_feast', '超级大餐', 'food', 'rare', '🍖', '{"hunger": 50}'),
('food_dessert', '甜点', 'food', 'common', '🧁', '{"hunger": 15, "happiness": 5}');

INSERT INTO items (id, name, category, rarity, icon, effect) VALUES
('deco_hat', '小礼帽', 'decoration', 'common', '🎩', '{}'),
('deco_sunglasses', '酷墨镜', 'decoration', 'common', '🕶️', '{}'),
('deco_crown', '皇冠', 'decoration', 'legendary', '👑', '{}'),
('deco_bow', '蝴蝶结', 'decoration', 'rare', '🎀', '{}'),
('deco_cape', '小披风', 'decoration', 'rare', '🧣', '{}');

INSERT INTO items (id, name, category, rarity, icon, effect) VALUES
('special_evolve', '进化药水', 'special', 'legendary', '💊', '{"evolve": true}'),
('special_heal', '治疗药', 'special', 'rare', '💚', '{"heal": true}'),
('special_lucky', '幸运符', 'special', 'rare', '🍀', '{"luck_boost": true}'),
('special_ticket', '游戏券', 'special', 'rare', '🎫', '{"extra_game": true}');

INSERT INTO lottery_pools (tier, item_id, weight) VALUES
('bronze', 'food_bread', 50), ('bronze', 'food_dessert', 30),
('bronze', 'deco_hat', 10), ('bronze', 'deco_sunglasses', 8),
('bronze', 'food_cake', 2);

INSERT INTO lottery_pools (tier, item_id, weight) VALUES
('silver', 'food_cake', 30), ('silver', 'food_feast', 20),
('silver', 'deco_bow', 20), ('silver', 'deco_cape', 15),
('silver', 'special_heal', 10), ('silver', 'special_lucky', 5);

INSERT INTO lottery_pools (tier, item_id, weight) VALUES
('gold', 'special_evolve', 25), ('gold', 'deco_crown', 25),
('gold', 'food_feast', 20), ('gold', 'special_ticket', 20),
('gold', 'special_lucky', 10);
