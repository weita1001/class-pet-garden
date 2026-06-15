// 56 AI生成的宠物模板
export interface PetTemplate {
  type: string
  path: string
  description: string
}

const templates: PetTemplate[] = [
  // === 猫 (6) ===
  { type: 'cat', path: '/pets/cat_01.png', description: '橘色虎斑猫，翠绿眼睛' },
  { type: 'cat', path: '/pets/cat_02.png', description: '黑白礼服猫，金色眼睛' },
  { type: 'cat', path: '/pets/cat_03.png', description: '纯白波斯猫，蓝宝石眼' },
  { type: 'cat', path: '/pets/cat_04.png', description: '灰色英短，圆脸圆眼' },
  { type: 'cat', path: '/pets/cat_05.png', description: '三花猫，琥珀色眼睛' },
  { type: 'cat', path: '/pets/cat_06.png', description: '暹罗猫，海蓝色眼睛' },
  // === 狗 (6) ===
  { type: 'dog', path: '/pets/dog_07.png', description: '金毛寻回犬，阳光微笑' },
  { type: 'dog', path: '/pets/dog_08.png', description: '柯基短腿犬，大耳朵' },
  { type: 'dog', path: '/pets/dog_09.png', description: '哈士奇，冰蓝眼眸' },
  { type: 'dog', path: '/pets/dog_10.png', description: '柴犬，卷尾巴眯眼笑' },
  { type: 'dog', path: '/pets/dog_11.png', description: '斑点狗，黑白斑点' },
  { type: 'dog', path: '/pets/dog_12.png', description: '博美犬，蓬松毛球' },
  // === 兔子 (6) ===
  { type: 'rabbit', path: '/pets/rabbit_v2_07.png', description: '白色垂耳兔，粉色耳朵' },
  { type: 'rabbit', path: '/pets/rabbit_v2_08.png', description: '棕色侏儒兔，圆耳' },
  { type: 'rabbit', path: '/pets/rabbit_v2_10.png', description: '灰色安哥拉兔，毛茸茸' },
  { type: 'rabbit', path: '/pets/rabbit_13.png', description: '黑白斑点兔，竖长耳' },
  { type: 'rabbit', path: '/pets/rabbit_17.png', description: '黄色荷兰兔，圆润可爱' },
  { type: 'rabbit', path: '/pets/rabbit_v2_07.png', description: '粉色迷你兔，红宝石眼' },
  // === 仓鼠 (5) ===
  { type: 'hamster', path: '/pets/hamster_v2_11.png', description: '金丝熊仓鼠，胖滚滚' },
  { type: 'hamster', path: '/pets/hamster_v2_12.png', description: '银狐仓鼠，白色条纹' },
  { type: 'hamster', path: '/pets/hamster_v2_13.png', description: '布丁仓鼠，奶黄色' },
  { type: 'hamster', path: '/pets/hamster_v2_14.png', description: '紫仓鼠，灰紫色' },
  { type: 'hamster', path: '/pets/hamster_v2_15.png', description: '奶茶仓鼠，棕色柔软' },
  // === 小鸡 (4) ===
  { type: 'chick', path: '/pets/chick_27.png', description: '黄色小鸡，红冠嫩喙' },
  { type: 'chick', path: '/pets/chick_28.png', description: '棕色小鸡，斑点翅膀' },
  { type: 'chick', path: '/pets/chick_29.png', description: '白色小鸡，蓬松绒毛' },
  { type: 'chick', path: '/pets/chick_30.png', description: '黑色小鸡，金色眼' },
  // === 猪 (5) ===
  { type: 'pig', path: '/pets/pig_v2_01.png', description: '粉红小猪，卷卷尾巴' },
  { type: 'pig', path: '/pets/pig_v2_02.png', description: '斑点小猪，圆鼻头' },
  { type: 'pig', path: '/pets/pig_v2_03.png', description: '棕色迷你猪，大耳朵' },
  { type: 'pig', path: '/pets/pig_v2_04.png', description: '黑色小猪，短腿可爱' },
  { type: 'pig', path: '/pets/pig_v2_05.png', description: '花斑小猪，微笑表情' },
  // === 龙 (5) ===
  { type: 'dragon', path: '/pets/dragon_18.png', description: '红色幼龙，金色翅膀' },
  { type: 'dragon', path: '/pets/dragon_19.png', description: '蓝色冰龙，水晶鳞片' },
  { type: 'dragon', path: '/pets/dragon_20.png', description: '绿色森林龙，树叶翼' },
  { type: 'dragon', path: '/pets/dragon_21.png', description: '紫色暗影龙，神秘眼' },
  { type: 'dragon', path: '/pets/dragon_22.png', description: '金色圣龙，光芒闪耀' },
  // === 独角兽 (6) ===
  { type: 'unicorn', path: '/pets/unicorn_v3_01.png', description: '白色独角兽，彩虹鬃毛' },
  { type: 'unicorn', path: '/pets/unicorn_v3_02.png', description: '粉色独角兽，星星角' },
  { type: 'unicorn', path: '/pets/unicorn_v3_03.png', description: '蓝色独角兽，月光角' },
  { type: 'unicorn', path: '/pets/unicorn_v3_04.png', description: '紫色独角兽，魔法花纹' },
  { type: 'unicorn', path: '/pets/unicorn_v3_05.png', description: '金色独角兽，太阳之角' },
  { type: 'unicorn', path: '/pets/unicorn_v3_06.png', description: '彩虹独角兽，七彩尾' },
  // === 精灵 (6) ===
  { type: 'fairy', path: '/pets/fairy_v2_07.png', description: '花之精灵，花瓣翅膀' },
  { type: 'fairy', path: '/pets/fairy_v2_08.png', description: '水之精灵，蓝色光翼' },
  { type: 'fairy', path: '/pets/fairy_v2_09.png', description: '火之精灵，红色烈焰' },
  { type: 'fairy', path: '/pets/fairy_v2_10.png', description: '风之精灵，透明羽翼' },
  { type: 'fairy', path: '/pets/fairy_v2_11.png', description: '暗之精灵，紫色幽光' },
  { type: 'fairy', path: '/pets/fairy_v2_12.png', description: '光之精灵，金色圣光' },
  // === 史莱姆 (5) ===
  { type: 'slime', path: '/pets/slime_v2_14.png', description: '绿色史莱姆，弹性透明' },
  { type: 'slime', path: '/pets/slime_v2_15.png', description: '蓝色史莱姆，水润Q弹' },
  { type: 'slime', path: '/pets/slime_v2_16.png', description: '红色史莱姆，热情如火' },
  { type: 'slime', path: '/pets/slime_v2_17.png', description: '金色史莱姆，闪闪发光' },
  { type: 'slime', path: '/pets/slime_v2_18.png', description: '彩虹史莱姆，彩色渐变' },
]

export default templates

// 获取所有模板
export function getAllTemplates(): PetTemplate[] {
  return templates
}

// 按种类获取模板
export function getTemplatesByType(type: string): PetTemplate[] {
  return templates.filter(t => t.type === type)
}

// 获取可用种类（只按稀有度过滤）
export function getAvailableTypes(): string[] {
  const types = [...new Set(templates.map(t => t.type))]
  return types.filter(t => ['cat', 'dog', 'rabbit', 'hamster', 'chick', 'pig'].includes(t))
}

// 随机模板，避免和已有完全重复
export function randomTemplate(type: string): PetTemplate {
  const pool = templates.filter(t => t.type === type)
  return pool[Math.floor(Math.random() * pool.length)]
}

export function randomTemplateAvoidDup(type: string, usedPaths: string[]): PetTemplate {
  let pool: PetTemplate[]
  if (type === 'any') {
    // 所有普通种类，概率相等，避免重复造型
    const commonTypes = ['cat', 'dog', 'rabbit', 'hamster', 'chick', 'pig']
    const allCommon = templates.filter(t => commonTypes.includes(t.type))
    const available = allCommon.filter(t => !usedPaths.includes(t.path))
    pool = available.length > 0 ? available : allCommon
  } else {
    pool = templates.filter(t => t.type === type && !usedPaths.includes(t.path))
    if (pool.length === 0) pool = templates.filter(t => t.type === type)
  }
  return pool[Math.floor(Math.random() * pool.length)]
}
