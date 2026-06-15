export interface Class {
  id: string
  user_id: string
  name: string
  created_at: string
}

export interface Student {
  id: string
  class_id: string
  name: string
  points: number
  created_at: string
}

export type PetType = 'cat' | 'dog' | 'rabbit' | 'hamster' | 'chick' | 'pig'
  | 'dragon' | 'unicorn' | 'fairy' | 'slime'

export type Personality = 'active' | 'lazy' | 'foodie' | 'shy'

export type PetStage = 'egg' | 'baby' | 'teen' | 'adult' | 'super'

export type Emotion = 'happy' | 'normal' | 'hungry' | 'stuffed' | 'excited' | 'sleepy' | 'sick' | 'expecting'

export interface Pet {
  id: string
  student_id: string
  type: PetType
  personality: Personality
  stage: PetStage
  hunger: number
  happiness: number
  feed_count: number
  last_fed_at: string | null
  created_at: string
  design?: string | null
  sick?: boolean
}

export type ItemCategory = 'food' | 'decoration' | 'special'
export type ItemRarity = 'common' | 'rare' | 'legendary'

export interface Item {
  id: string
  name: string
  category: ItemCategory
  rarity: ItemRarity
  icon: string
  effect: Record<string, number | boolean>
}

export interface InventorySlot {
  id: string
  student_id: string
  item_id: string
  quantity: number
  item?: Item
}

export interface PointsLog {
  id: string
  student_id: string
  amount: number
  reason: string | null
  created_at: string
}

export interface LotteryPoolEntry {
  id: string
  tier: 'bronze' | 'silver' | 'gold'
  item_id: string
  weight: number
}

export type LotteryTier = 'bronze' | 'silver' | 'gold'

export interface PetWithStudent extends Pet {
  student_name: string
  student_points: number
}
