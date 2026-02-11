"use client"

import React from "react"
import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin/admin-sidebar"
import { AdminTopBar } from "@/components/admin/admin-topbar"
import { usePathname, redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/client"

function useAdminSession() {
  const [session, setSession] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Check admin role from metadata
        const role = user.user_metadata?.role
        if (role === 'admin') {
          setSession({ id: user.id, name: user.user_metadata?.name || 'Admin User', role: 'admin' })
        }
      }
      setIsLoading(false)
    }

    checkSession()
  }, [])

  return { session, isLoading }
}

const pageTitles: Record<string, string> = {
  "/admin": "Overview",
  "/admin/farmers": "Farmers",
  "/admin/volunteers": "Volunteers",
  "/admin/redemptions": "Redemptions",
  "/admin/model-health": "Model Health",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { session, isLoading } = useAdminSession()
  const pathname = usePathname()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!session || session.role !== "admin") {
    redirect('/dashboard')
  }

  const title = pageTitles[pathname] || "Admin"

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <AdminSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <AdminTopBar
          onMenuClick={() => setSidebarOpen(true)}
          title={title}
          pendingCount={3}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
