'use client'

import { User, Menu, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import { User as SupabaseUser } from '@supabase/supabase-js'
import { useSidebar } from '@/hooks/use-sidebar'
import { cn } from '@/lib/utils'

export default function Topbar() {
  const [user, setUser] = useState<SupabaseUser | null>(null)
  const { isCollapsed, toggleMobile, isMobileOpen } = useSidebar()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }
    getUser()
  }, [supabase])

  return (
    <header 
      className={cn(
        "fixed top-0 right-0 h-16 bg-white/80 backdrop-blur-md border-b border-zinc-100 px-4 lg:px-6 flex items-center justify-between z-30 transition-all duration-300 ease-in-out",
        "left-0 lg:left-64",
        isCollapsed && "lg:left-20"
      )}
    >
      {/* Left side */}
      <div className="flex items-center space-x-3 flex-1">
        <button 
          onClick={toggleMobile}
          className="lg:hidden p-2 text-zinc-700 hover:bg-zinc-50 rounded-xl transition-all"
        >
          {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-3">
        <div className="text-right hidden md:block">
          <p className="text-sm font-medium text-zinc-900 leading-none">
            {user?.email?.split('@')[0] || 'Member'}
          </p>
          <p className="text-xs text-zinc-400 mt-0.5">
            {user?.email || ''}
          </p>
        </div>
        
        <div className="h-9 w-9 bg-zinc-100 rounded-xl flex items-center justify-center">
          <User className="h-4 w-4 text-zinc-500" />
        </div>
      </div>
    </header>
  )
}
