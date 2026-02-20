'use client'

import { Bell, Search, User, Menu, X } from 'lucide-react'
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

        <div className="relative max-w-sm w-full hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
          <input 
            type="text" 
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-zinc-50/50 border border-zinc-200 rounded-xl text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
      </div>

      {/* Right side */}
      <div className="flex items-center space-x-2">
        <button className="p-2 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-50 rounded-xl transition-all relative">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute top-2 right-2 h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
        </button>
        
        <div className="h-6 w-px bg-zinc-100 mx-1 hidden sm:block"></div>

        <div className="flex items-center space-x-3 pl-1">
          <div className="text-right hidden md:block">
            <p className="text-sm font-medium text-zinc-900 leading-none">
              {user?.email?.split('@')[0] || 'Member'}
            </p>
            <p className="text-xs text-zinc-400 mt-0.5">
              Free Plan
            </p>
          </div>
          
          <div className="h-9 w-9 bg-zinc-100 rounded-xl flex items-center justify-center">
             <User className="h-4 w-4 text-zinc-500" />
          </div>
        </div>
      </div>
    </header>
  )
}
