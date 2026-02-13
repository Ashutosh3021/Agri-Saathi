"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Trophy,
  Camera,
  Wallet,
  Settings,
  LogOut,
  X,
  Coins,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { createClient } from "@/lib/supabase/client"

interface DashboardSidebarProps {
  open: boolean
  onClose: () => void
  volunteer?: {
    name?: string
    totalCoins?: number
    isActive?: boolean
  }
}

const navItems = [
  { label: "Dashboard", href: "/Volunteers/Dashboard", icon: LayoutDashboard },
  { label: "Leaderboard", href: "/Volunteers/Dashboard/leaderboard", icon: Trophy },
  { label: "My Scans", href: "/Volunteers/Dashboard/scans", icon: Camera },
  { label: "Redeem Coins", href: "/Volunteers/Dashboard/redeem", icon: Wallet },
  { label: "Settings", href: "/Volunteers/Dashboard/settings", icon: Settings },
]

export function DashboardSidebar({ open, onClose, volunteer }: DashboardSidebarProps) {
  const pathname = usePathname()
  const supabase = createClient()

  const isActive = (href: string) => {
    if (href === "/Volunteers/Dashboard") {
      return pathname === "/Volunteers/Dashboard"
    }
    return pathname.startsWith(href)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = "/Volunteers"
  }

  const initials = volunteer?.name 
    ? volunteer.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : "V"

  const status = volunteer?.isActive ? "Active" : "Pending"
  const coins = volunteer?.totalCoins || 0

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-[260px] flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-transform duration-300 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Close button on mobile */}
        <div className="flex items-center justify-end p-2 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-sidebar-foreground hover:bg-white/10 hover:text-white"
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        {/* Logo */}
        <div className="flex items-center gap-2 px-6 pt-4 pb-2">
          <span className="text-xl font-bold text-amber-500">
            Agri Volunteer
          </span>
        </div>

        {/* Volunteer Profile */}
        <div className="flex items-center gap-3 px-6 py-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-600 text-sm font-semibold text-white">
            {initials}
          </div>
          <div className="flex flex-col overflow-hidden">
            <span className="truncate text-sm font-medium text-white">
              {volunteer?.name || "Volunteer"}
            </span>
            <span
              className={cn(
                "mt-0.5 inline-flex w-fit items-center rounded-full px-2 py-0.5 text-xs font-medium",
                status === "Active"
                  ? "bg-emerald-500/15 text-emerald-400"
                  : "bg-amber-500/15 text-amber-400"
              )}
            >
              <span
                className={cn(
                  "mr-1.5 inline-block h-1.5 w-1.5 rounded-full",
                  status === "Active"
                    ? "bg-emerald-400"
                    : "bg-amber-400"
                )}
              />
              {status}
            </span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex-1 space-y-1 px-3" role="navigation" aria-label="Dashboard navigation">
          {navItems.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  active
                    ? "border-l-4 border-amber-500 bg-amber-500/10 text-amber-500"
                    : "border-l-4 border-transparent text-sidebar-foreground hover:bg-white/5 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Bottom section */}
        <div className="mt-auto space-y-3 px-4 pb-6">
          {/* Coin balance widget */}
          <div className="rounded-xl bg-amber-500/10 p-4">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-amber-500" />
              <span className="text-lg font-bold text-amber-500">
                {coins.toLocaleString()} coins
              </span>
            </div>
            <p className="mt-1 text-xs text-sidebar-foreground">
              {"= ₹"}
              {(coins / 10).toFixed(2)}
            </p>
          </div>

          {/* Logout */}
          <Button
            variant="ghost"
            className="w-full justify-start gap-2 text-red-400 hover:bg-red-500/10 hover:text-red-300"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
      </aside>
    </>
  )
}
