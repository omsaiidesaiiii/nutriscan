'use client'

import Sidebar from '@/components/layout/Sidebar'
import Topbar from '@/components/layout/Topbar'
import { SidebarProvider, useSidebar } from '@/hooks/use-sidebar'
import { cn } from '@/lib/utils'

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { isCollapsed } = useSidebar()

  return (
    <div className="min-h-screen bg-[#fbfdfc]">
      <Sidebar />
      <div 
        className={cn(
          "transition-all duration-300 ease-in-out",
          "pl-0 lg:pl-72",
          isCollapsed && "lg:pl-20"
        )}
      >
        <Topbar />
        <main className="pt-20 min-h-screen">
          <div className="max-w-[1400px] mx-auto p-6 md:p-10">
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
