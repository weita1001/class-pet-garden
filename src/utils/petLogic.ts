import type { PetStage, Emotion } from '../types'

export function computeNewStage(currentStage: PetStage, feedCount: number): PetStage {
  if (feedCount >= 30) return 'super'
  if (feedCount >= 15 && (currentStage === 'egg' || currentStage === 'baby')) return 'teen'
  if (feedCount >= 15 && currentStage === 'teen') return 'adult'
  if (feedCount >= 5 && currentStage === 'egg') return 'baby'
  return currentStage
}

export function computeEmotion(hunger: number, happiness: number, lastFedAt: string | null): Emotion {
  if (happiness >= 90 && hunger >= 70) return 'happy'
  if (hunger <= 20) return 'hungry'
  if (hunger >= 95) return 'stuffed'
  if (!lastFedAt) return 'normal'
  const hoursSinceFed = (Date.now() - new Date(lastFedAt).getTime()) / 3600000
  if (hoursSinceFed > 72) return 'sick'
  if (hoursSinceFed > 24) return 'hungry'
  if (happiness <= 30) return 'sleepy'
  return 'normal'
}
