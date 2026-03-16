'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Session, User } from '@supabase/supabase-js'
import { useRouter } from 'next/navigation'

type AuthContextType = {
  session: Session | null
  user: User | null
  loading: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  session: null,
  user: null,
  loading: true,
  signOut: async () => {},
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    let mounted = true

    const setData = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      if (error) throw error
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
        
        if (_event === 'SIGNED_IN') {
          router.refresh()
        }
        if (_event === 'SIGNED_OUT') {
          router.push('/login')
          router.refresh()
        }
      }
    })

    setData()

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [supabase.auth, router])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
