import type { PetStage, Emotion } from '../types'

export function computeNewStage(currentStage: PetStage, feedCount: number): PetStage {
  if (feedCount >= 30) return 'super'
  if (feedCount >= 15 && (currentStage === 'egg' || currentStage === 'baby')) return 'teen'
  if (feedCount >= 15 && currentStage === 'teen') return 'adult'
  if (feedCount >= 5 && currentStage === 'egg') return 'baby'
  return currentStage
}

// 衰减：每天 -2 饱食度，-1 快乐值
export function getEffectiveStats(pet: { hunger: number; happiness: number; last_fed_at: string | null }, isWeekend = false) {
  if (!pet.last_fed_at) return { hunger: pet.hunger, happiness: pet.happiness }
  const daysSinceFed = (Date.now() - new Date(pet.last_fed_at).getTime()) / 86400000
  const decayHunger = Math.max(0, pet.hunger - Math.round(daysSinceFed * 2))
  const decayHappiness = Math.max(0, pet.happiness - Math.round(daysSinceFed * 1))
  // 周末衰减减半
  if (isWeekend) {
    return { hunger: Math.min(pet.hunger, decayHunger + Math.round(daysSinceFed)), happiness: Math.min(pet.happiness, decayHappiness + Math.round(daysSinceFed * 0.5)) }
  }
  return { hunger: decayHunger, happiness: decayHappiness }
}

export function computeEmotion(hunger: number, happiness: number): Emotion {
  if (hunger <= 20) return 'hungry'
  if (hunger <= 40) return 'sleepy'
  if (happiness >= 90 && hunger >= 70) return 'happy'
  if (hunger >= 95) return 'stuffed'
  if (happiness <= 30) return 'sleepy'
  return 'normal'
}
