"use client"

import React from "react"
import { useState, useEffect } from "react"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { TopBar } from "@/components/dashboard/topbar"
import { createClient } from "@/lib/supabase/client"

function useSession() {
  const [session, setSession] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        setSession(user)
        setIsAuthenticated(true)
      }
      setIsLoading(false)
    }

    checkSession()
  }, [])

  return { session, isAuthenticated, isLoading }
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { session, isAuthenticated, isLoading } = useSession()

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-neutral-50">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!isAuthenticated) {
    redirect("/auth/login")
  }

  return (
    <div className="flex h-screen overflow-hidden bg-neutral-50">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        session={session}
      />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar
          onMenuClick={() => setSidebarOpen(true)}
          session={session}
        />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
