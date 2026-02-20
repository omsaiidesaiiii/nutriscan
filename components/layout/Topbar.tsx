'use client'

import { Bell, Search, User, Menu, X, PlusCircle, Sparkles } from 'lucide-react'
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
        "fixed top-0 right-0 h-20 bg-white/70 backdrop-blur-xl border-b border-emerald-50/50 px-4 lg:px-8 flex items-center justify-between z-30 transition-all duration-300 ease-in-out",
        "left-0 lg:left-72",
        isCollapsed && "lg:left-20"
      )}
    >
      {/* Search Bar */}
      <div className="flex items-center space-x-4 flex-1">
        <button 
          onClick={toggleMobile}
          className="lg:hidden p-3 text-emerald-900 bg-emerald-50 rounded-2xl transition-all active:scale-95"
        >
          {isMobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>

        <div className="relative max-w-md w-full hidden md:block group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-900/40 group-focus-within:text-emerald-500 transition-colors" />
          <input 
            type="text" 
            placeholder="Search Intelligence... (CMD+K)"
            className="w-full pl-12 pr-6 py-3.5 bg-emerald-50/50 border border-transparent rounded-[1.5rem] text-sm font-bold text-emerald-950 focus:outline-none focus:bg-white focus:border-emerald-100 focus:ring-8 focus:ring-emerald-500/5 transition-all placeholder-emerald-900/30"
          />
        </div>
      </div>

      {/* Profile Actions */}
      <div className="flex items-center space-x-3 md:space-x-4">
        <button className="hidden sm:flex items-center space-x-2 px-6 py-3 bg-emerald-950 text-white text-xs font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-emerald-900/10 hover:bg-emerald-900 hover:-translate-y-0.5 active:translate-y-0 transition-all group">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400 group-hover:rotate-12 transition-transform" />
          <span>Quick log</span>
        </button>

        <div className="h-8 w-px bg-emerald-50 mx-2 hidden sm:block"></div>

        <button className="p-3 text-emerald-900/40 hover:text-emerald-600 hover:bg-emerald-50 rounded-2xl transition-all relative group">
          <Bell className="h-5 w-5" />
          <span className="absolute top-3 right-3 h-2 w-2 bg-emerald-500 rounded-full border-2 border-white animate-pulse"></span>
        </button>
        
        <div className="flex items-center space-x-4 pl-2 group cursor-pointer">
          <div className="text-right hidden xl:block">
            <p className="text-sm font-black text-emerald-950 leading-none">
              {user?.email?.split('@')[0] || 'Member'}
            </p>
            <div className="flex items-center justify-end space-x-1.5 mt-1.5">
              <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
              <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.15em]">
                Live Model
              </p>
            </div>
          </div>
          
          <div className="h-12 w-12 bg-emerald-950 rounded-[1.25rem] flex items-center justify-center shadow-lg shadow-emerald-900/10 hover:rotate-3 transition-all relative overflow-hidden">
             <User className="h-6 w-6 text-white" />
             <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 to-transparent" />
          </div>
        </div>
      </div>
    </header>
  )
}
