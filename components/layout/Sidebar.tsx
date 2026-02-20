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
  LogOut,
  ChevronLeft,
  ChevronRight
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
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden animate-in"
          onClick={closeMobile}
        />
      )}

      <aside 
        className={cn(
          "fixed left-0 top-0 h-screen bg-white border-r border-zinc-100 flex flex-col z-50 transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo Section */}
        <div className={cn(
          "h-16 flex items-center px-5 border-b border-zinc-50",
          isCollapsed ? "justify-center px-0" : "justify-between"
        )}>
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="bg-emerald-600 p-1.5 rounded-xl shrink-0">
              <LayoutDashboard className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-lg font-bold tracking-tight text-zinc-900">
                Nutri<span className="text-emerald-600">Scan</span>
              </span>
            )}
          </div>
          
          <button 
            onClick={toggleSidebar}
            className="hidden lg:flex h-7 w-7 items-center justify-center rounded-lg hover:bg-zinc-50 text-zinc-400 hover:text-zinc-700 transition-colors"
          >
            {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </button>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 px-3 py-4 space-y-1">
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
                  "group flex items-center space-x-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                  isActive 
                    ? "bg-emerald-50 text-emerald-700" 
                    : "text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900",
                  isCollapsed && "justify-center px-0"
                )}
              >
                <item.icon className={cn(
                  "h-[18px] w-[18px] shrink-0",
                  isActive ? "text-emerald-600" : "text-zinc-400 group-hover:text-zinc-700"
                )} />
                
                {!isCollapsed && (
                  <span>{item.name}</span>
                )}

                {isCollapsed && (
                  <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
              </Link>
            )
          })}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-zinc-50">
          <form action={logout}>
            <button
              type="submit"
              className={cn(
                "group flex items-center space-x-3 px-3 py-2.5 w-full rounded-xl text-sm font-medium text-zinc-500 hover:bg-zinc-50 hover:text-zinc-700 transition-all duration-200",
                isCollapsed && "justify-center px-0"
              )}
            >
              <LogOut className="h-[18px] w-[18px] shrink-0" />
              {!isCollapsed && <span>Sign Out</span>}
              
              {isCollapsed && (
                <div className="absolute left-full ml-3 px-2.5 py-1.5 bg-zinc-800 text-white text-xs font-medium rounded-lg opacity-0 pointer-events-none group-hover:opacity-100 transition-all z-50 whitespace-nowrap">
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
