'use client'

import { useAuth } from '@/providers/AuthProvider'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push(`/login?next=${pathname}`)
    }
  }, [user, loading, router, pathname])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent shadow-emerald-200 shadow-lg"></div>
          <p className="text-sm font-medium text-zinc-500 animate-pulse">Loading NutriScan...</p>
        </div>
      </div>
    )
  }

  return user ? <>{children}</> : null
}
