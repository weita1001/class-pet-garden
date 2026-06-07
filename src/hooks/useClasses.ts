import { useState, useEffect, useCallback } from 'react'
import { getClasses, createClass, deleteClass, renameClass } from '../services/db'
import type { Class } from '../types'

export function useClasses() {
  const [classes, setClasses] = useState<Class[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    const { data } = await getClasses()
    setClasses(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { refresh() }, [refresh])

  const add = async (name: string) => {
    await createClass(name)
    refresh()
  }

  const remove = async (id: string) => {
    await deleteClass(id)
    refresh()
  }

  const rename = async (id: string, name: string) => {
    await renameClass(id, name)
    refresh()
  }

  return { classes, loading, add, remove, rename, refresh }
}
