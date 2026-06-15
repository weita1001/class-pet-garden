import { useState, useCallback } from 'react'
import { getPetsByClass, createPet, feedPet } from '../services/db'
import type { PetWithStudent, PetType, Personality } from '../types'
import { computeNewStage, getEffectiveStats } from '../utils/petLogic'

export function usePets() {
  const [pets, setPets] = useState<PetWithStudent[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async (classId: string) => {
    setLoading(true)
    const { data } = await getPetsByClass(classId)
    setPets(data || [])
    setLoading(false)
  }, [])

  const adopt = async (studentId: string, type: PetType, personality: Personality, design?: string | null) => {
    const designJson = design ? JSON.stringify({ image_path: design }) : null
    const { data, error } = await createPet(studentId, type, personality, designJson)
    return { data, error }
  }

  const feed = async (pet: PetWithStudent, extraHunger = 0, extraHappiness = 0) => {
    // 使用衰减后的真实值作为基础，避免"回弹"
    const base = getEffectiveStats({ hunger: pet.hunger, happiness: pet.happiness, last_fed_at: pet.last_fed_at })
    const newHunger = Math.min(100, base.hunger + extraHunger)
    const newHappiness = Math.min(100, base.happiness + extraHappiness)
    const newFeedCount = pet.feed_count + 1
    const newStage = computeNewStage(pet.stage, newFeedCount)
    const { error } = await feedPet(pet.id, newHunger, newHappiness, newFeedCount, newStage)
    return { error, newStage, evolved: newStage !== pet.stage }
  }

  return { pets, loading, load, adopt, feed }
}
