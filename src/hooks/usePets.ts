import { useState, useCallback } from 'react'
import { getPetsByClass, createPet, feedPet } from '../services/db'
import type { PetWithStudent, PetType, Personality } from '../types'
import { computeNewStage } from '../utils/petLogic'

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
    const { data, error } = await createPet(studentId, type, personality, design)
    return { data, error }
  }

  const feed = async (pet: PetWithStudent) => {
    const newHunger = Math.min(100, pet.hunger + 15)
    const newHappiness = Math.min(100, pet.happiness + 5)
    const newFeedCount = pet.feed_count + 1
    const newStage = computeNewStage(pet.stage, newFeedCount)
    const { error } = await feedPet(pet.id, newHunger, newHappiness, newFeedCount, newStage)
    return { error, newStage, evolved: newStage !== pet.stage }
  }

  return { pets, loading, load, adopt, feed }
}
