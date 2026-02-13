"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DashboardSidebar } from "@/components/volunteer/dashboard-sidebar"
import { createClient } from "@/lib/supabase/client"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [volunteer, setVolunteer] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push("/Volunteers")
          return
        }

        const role = session.user.user_metadata?.role
        if (role !== 'volunteer') {
          router.push("/Volunteers?error=not_authorized")
          return
        }

        // Fetch volunteer data
        const response = await fetch("/api/volunteer/me")
        const data = await response.json()
        
        if (!response.ok) {
          console.error("Error loading volunteer:", data.error)
          router.push("/Volunteers")
          return
        }

        setVolunteer(data.volunteer)
        setLoading(false)
      } catch (error) {
        console.error("Error checking auth:", error)
        router.push("/Volunteers")
      }
    }

    checkAuth()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        volunteer={volunteer}
      />

      {/* Main content area */}
      <div className="flex flex-1 flex-col lg:pl-[260px]">
        {/* Mobile header */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/95 px-4 py-3 backdrop-blur lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(true)}
            className="shrink-0"
          >
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          <span className="text-lg font-bold text-amber-600">
            Agri Volunteer
          </span>
        </header>

        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
