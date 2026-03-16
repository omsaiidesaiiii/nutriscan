'use client'

import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { SidebarProvider, useSidebar } from '@/hooks/use-sidebar'
import { cn } from '@/lib/utils'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-zinc-50">
      <Sidebar />
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out",
          "pl-0 lg:pl-64",
          isCollapsed && "lg:pl-20"
        )}
      >
        <Topbar />
        <main className="pt-16 min-h-screen">
          <div className="max-w-[1200px] mx-auto p-6 md:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider>
      <DashboardContent>{children}</DashboardContent>
    </SidebarProvider>
  )
}
