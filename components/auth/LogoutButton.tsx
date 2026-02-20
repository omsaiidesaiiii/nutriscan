'use client'

import { useAuth } from '@/providers/AuthProvider'
import { useState } from 'react'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
  const { signOut } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setLoading(true)
      await signOut()
    } catch (error) {
      console.error('Error logging out:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-zinc-600 transition-all hover:text-zinc-900 hover:bg-zinc-100 rounded-lg w-full"
    >
      <LogOut className={`h-4 w-4 ${loading ? 'animate-pulse' : ''}`} />
      <span>{loading ? 'Signing out...' : 'Log out'}</span>
    </button>
  )
}
