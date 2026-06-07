import type { PetType, Personality, PetStage, LotteryTier } from '../types'

export const PET_EMOJI: Record<PetType, Record<PetStage, string>> = {
  cat:    { egg: '🥚', baby: '🐣', teen: '🐱', adult: '🐈', super: '🐆' },
  dog:    { egg: '🥚', baby: '🐣', teen: '🐶', adult: '🐕', super: '🐺' },
  rabbit: { egg: '🥚', baby: '🐣', teen: '🐰', adult: '🐇', super: '🦄' },
  hamster:{ egg: '🥚', baby: '🐣', teen: '🐹', adult: '🐿️', super: '🦫' },
  chick:  { egg: '🥚', baby: '🐣', teen: '🐤', adult: '🐔', super: '🦚' },
  pig:    { egg: '🥚', baby: '🐣', teen: '🐷', adult: '🐖', super: '🐗' },
  dragon: { egg: '🥚', baby: '🐣', teen: '🐲', adult: '🐉', super: '🔥' },
  unicorn:{ egg: '🥚', baby: '🐣', teen: '🦄', adult: '🌈', super: '✨' },
  fairy:  { egg: '🥚', baby: '🐣', teen: '🧚', adult: '🧙', super: '👼' },
  slime:  { egg: '🥚', baby: '🐣', teen: '🟢', adult: '🟣', super: '💎' },
}

export const PERSONALITY_LABEL: Record<Personality, string> = {
  active: '活泼', lazy: '慵懒', foodie: '贪吃', shy: '害羞',
}

export const PERSONALITY_EMOJI: Record<Personality, string> = {
  active: '😼', lazy: '😴', foodie: '😋', shy: '😎',
}

export const EMOTION_EMOJI: Record<string, string> = {
  happy: '😍', normal: '😐', hungry: '😢', stuffed: '😤',
  excited: '🥳', sleepy: '😴', sick: '🤒', expecting: '🥺',
}

export const STAGE_LABEL: Record<PetStage, string> = {
  egg: '蛋', baby: '幼崽', teen: '少年', adult: '成年', super: '炫酷形态',
}

export const STAGE_FEED_REQUIREMENT: Record<PetStage, number> = {
  egg: 0, baby: 5, teen: 15, adult: 30, super: Infinity,
}

export const LOTTERY_TIER_CONFIG: Record<LotteryTier, { cost: number; label: string; icon: string }> = {
  bronze: { cost: 3, label: '普通抽', icon: '🥉' },
  silver: { cost: 10, label: '高级抽', icon: '🥈' },
  gold: { cost: 30, label: '传说抽', icon: '🥇' },
}

export const QUICK_POINTS = [
  { label: '🙋 举手回答', amount: 1 },
  { label: '📝 作业优秀', amount: 3 },
  { label: '🤝 帮助同学', amount: 5 },
  { label: '🌟 今日之星', amount: 5 },
  { label: '🎯 考试进步', amount: 10 },
]

export const RANDOM_EVENTS = [
  { icon: '💎', title: '捡到宝藏', desc: '获得稀有装饰品', effect: 'rare_decoration' },
  { icon: '🤒', title: '宠物生病', desc: '需要治疗药', effect: 'sick_pet' },
  { icon: '🎂', title: '宠物生日', desc: '全班庆祝！+3积分', effect: 'birthday_bonus' },
  { icon: '🌈', title: '幸运彩虹', desc: '下次喂食效果翻倍', effect: 'double_feed' },
  { icon: '🐾', title: '神秘脚印', desc: '解锁隐藏宠物', effect: 'rare_pet' },
]

export const PET_TYPE_POOL: { type: PetType; rarity: 1 | 2 | 3 }[] = [
  { type: 'cat', rarity: 1 }, { type: 'dog', rarity: 1 }, { type: 'rabbit', rarity: 1 },
  { type: 'hamster', rarity: 1 }, { type: 'chick', rarity: 1 }, { type: 'pig', rarity: 2 },
  { type: 'dragon', rarity: 2 }, { type: 'unicorn', rarity: 3 }, { type: 'fairy', rarity: 2 },
  { type: 'slime', rarity: 3 },
]

export const EGG_RARITY_LABEL: Record<number, string> = {
  1: '普通 ★', 2: '稀有 ★★', 3: '传说 ★★★',
}

export const EGG_COLORS: Record<number, string> = {
  1: '#e0e0e0', 2: '#ffcc80', 3: '#ce93d8',
}
