import { useState, useEffect } from 'react'
import { signIn, signOut, getSession, onAuthChange } from '../services/db'

export function useAuth() {
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSession().then(({ data }) => {
      setSession(data.session)
      setLoading(false)
    })
    const { data: { subscription } } = onAuthChange((s) => setSession(s))
    return () => subscription.unsubscribe()
  }, [])

  const login = async (email: string, password: string) => {
    const { error } = await signIn(email, password)
    return { error }
  }

  const logout = async () => {
    await signOut()
    setSession(null)
  }

  return { session, loading, login, logout }
}
