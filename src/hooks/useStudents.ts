import { useState, useCallback } from 'react'
import { getStudents, addStudent, batchAddStudents, deleteStudent } from '../services/db'
import type { Student } from '../types'

export function useStudents() {
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(false)

  const load = useCallback(async (classId: string) => {
    setLoading(true)
    const { data } = await getStudents(classId)
    setStudents(data || [])
    setLoading(false)
  }, [])

  const addOne = async (classId: string, name: string) => {
    await addStudent(classId, name)
    load(classId)
  }

  const batch = async (classId: string, names: string[]) => {
    await batchAddStudents(classId, names)
    load(classId)
  }

  const remove = async (classId: string, id: string) => {
    await deleteStudent(id)
    load(classId)
  }

  return { students, loading, load, addOne, batch, remove }
}
