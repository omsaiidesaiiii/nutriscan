'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  Calendar, 
  Utensils, 
  BarChart3, 
  BrainCircuit, 
  User,
  Activity,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { logout } from '@/app/(auth)/actions'
import { useSidebar } from '@/hooks/use-sidebar'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Planner', href: '/planner', icon: Calendar },
  { name: 'Journal', href: '/meals', icon: Utensils },
  { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  { name: 'Intelligence', href: '/intelligence', icon: BrainCircuit },
  { name: 'Profile', href: '/profile', icon: User },
]

export default function Sidebar() {
  const pathname = usePathname()
  const { isCollapsed, toggleSidebar, isMobileOpen, closeMobile } = useSidebar()

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-emerald-950/40 backdrop-blur-sm z-40 lg:hidden animate-in fade-in"
          onClick={closeMobile}
        />
      )}

      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-emerald-50 flex flex-col z-50 transition-all duration-300 ease-in-out premium-shadow",
          isCollapsed ? "w-20" : "w-72",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className={cn(
          "h-20 flex items-center px-6 mb-4",
          isCollapsed ? "justify-center px-0" : "justify-between"
        )}>
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="bg-emerald-600 p-2 rounded-2xl shadow-lg shadow-emerald-200 shrink-0 transform -rotate-6">
              <Activity className="h-6 w-6 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-black text-emerald-950 tracking-tighter">
                Smart<span className="text-emerald-500">Log</span>
              </span>
            )}
          </div>
          
          <button 
            onClick={toggleSidebar}
            className="hidden lg:flex h-8 w-8 items-center justify-center rounded-xl hover:bg-emerald-50 text-emerald-400 hover:text-emerald-900 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-4 space-y-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) closeMobile()
                }}
                className={cn(
                  "group flex items-center space-x-3 px-4 py-3.5 rounded-[1.25rem] text-sm font-bold transition-all duration-200 relative",
                  isActive 
                    ? "bg-emerald-50 text-emerald-700" 
                    : "text-emerald-900/50 hover:bg-emerald-50/50 hover:text-emerald-900",
                  isCollapsed && "justify-center px-0"
                )}
              >
                {isActive && (
                  <div className="absolute left-0 w-1.5 h-6 bg-emerald-600 rounded-r-full" />
                )}

                <item.icon className={cn(
                  "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-110",
                  isActive ? "text-emerald-600" : "text-emerald-900/40 group-hover:text-emerald-900"
                )} />
                
                {!isCollapsed && (
                  <div className="flex items-center justify-between flex-1">
                    <span className="tracking-tight">{item.name}</span>
                    {item.name === 'Intelligence' && (
                      <Sparkles className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
                    )}
                  </div>
                )}

                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-emerald-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 shadow-xl whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        {/* Footer Area */}
        <div className="p-4 mt-auto space-y-4">
          {!isCollapsed && (
            <div className="p-5 bg-emerald-50/50 rounded-[2rem] border border-emerald-100/50 mb-2 relative overflow-hidden group">
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:scale-110 transition-transform">
                <Zap className="h-20 w-20 text-emerald-600" />
              </div>
              <div className="relative z-10 text-xs font-black text-emerald-800/60 uppercase tracking-widest mb-3">
                Daily Goal
              </div>
              <div className="relative z-10 flex items-end justify-between">
                <div>
                  <span className="text-2xl font-black text-emerald-900">78%</span>
                </div>
                <div className="text-[10px] font-bold text-emerald-600 bg-white px-2 py-1 rounded-lg">
                  ON TRACK
                </div>
              </div>
              <div className="mt-3 h-1.5 w-full bg-emerald-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 w-3/4 rounded-full" />
              </div>
            </div>
          )}

          <form action={logout}>
            <button
              type="submit"
              className={cn(
                "group flex items-center space-x-3 px-4 py-3.5 w-full rounded-[1.25rem] text-sm font-bold text-rose-500 hover:bg-rose-50 transition-all duration-200",
                isCollapsed && "justify-center px-0"
              )}
            >
              <LogOut className="h-5 w-5 shrink-0 transition-transform group-hover:-translate-x-1" />
              {!isCollapsed && <span className="tracking-tight">Sign Out</span>}
              
              {isCollapsed && (
                <div className="absolute left-full ml-4 px-3 py-2 bg-rose-600 text-white text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 shadow-xl whitespace-nowrap">
                  Sign Out
                </div>
              )}
            </button>
          </form>
        </div>
      </aside>
    </>
  )
}
