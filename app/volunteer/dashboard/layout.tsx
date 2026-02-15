'use client'

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { 
  LayoutDashboard, 
  Trophy, 
  Camera, 
  Wallet, 
  Settings, 
  LogOut,
  Menu,
  X,
  Coins
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/volunteer/dashboard" },
  { icon: Trophy, label: "Leaderboard", href: "/volunteer/dashboard/leaderboard" },
  { icon: Camera, label: "My Scans", href: "/volunteer/dashboard/scans" },
  { icon: Wallet, label: "Redeem Coins", href: "/volunteer/dashboard/redeem" },
  { icon: Settings, label: "Settings", href: "/volunteer/dashboard/settings" },
]

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/me')
const mockVolunteer = {
  name: "Ashutosh Patra",
  email: "ashutosh@example.com",
  totalCoins: 1240,
  isActive: true,
  avatar: null
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [volunteer, setVolunteer] = useState(mockVolunteer)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        
        if (!session) {
          router.push("/Volunteers")
          return
        }

        // BACKEND_CONNECTION: Replace with actual API call
        // const response = await fetch("/api/volunteer/me")
        // const data = await response.json()
        // setVolunteer(data.volunteer)
        
        setLoading(false)
      } catch (error) {
        console.error("Auth error:", error)
        router.push("/Volunteers")
      }
    }

    checkAuth()
  }, [router, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/Volunteers")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
      </div>
    )
  }

  const coinValue = (volunteer.totalCoins * 0.1).toFixed(2)

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-[260px] bg-[#1a1a1a] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static",
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Close button mobile */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white lg:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Logo */}
        <div className="h-16 flex items-center px-6 border-b border-gray-800">
          <span className="text-xl font-bold text-amber-500">🤝 Agri Volunteer</span>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white font-semibold">
              {volunteer.name.charAt(0)}
            </div>
            <div>
              <p className="text-white font-medium text-sm">{volunteer.name}</p>
              <span className={cn(
                "text-xs px-2 py-0.5 rounded-full",
                volunteer.isActive 
                  ? "bg-green-500/20 text-green-400" 
                  : "bg-amber-500/20 text-amber-400"
              )}>
                {volunteer.isActive ? "Active" : "Pending"}
              </span>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-6 py-3 text-sm transition-colors",
                  isActive 
                    ? "border-l-4 border-amber-500 bg-amber-500/10 text-amber-500" 
                    : "border-l-4 border-transparent text-gray-400 hover:text-white hover:bg-gray-800"
                )}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
              </a>
            )
          })}
        </nav>

        {/* Coin Balance Widget */}
        <div className="px-4 pb-4">
          <div className="bg-amber-500/10 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-1">
              <Coins className="w-4 h-4 text-amber-500" />
              <span className="text-amber-500 font-bold">{volunteer.totalCoins.toLocaleString()} coins</span>
            </div>
            <p className="text-gray-500 text-xs">= ₹{coinValue}</p>
          </div>
        </div>

        {/* Logout */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-6 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 lg:px-8 lg:hidden">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-600 hover:text-gray-900"
          >
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold text-amber-600">🤝 Agri Volunteer</span>
          <div className="w-8" /> {/* Spacer for alignment */}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
