"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import {
  LayoutDashboard,
  Users,
  HandHelping,
  ArrowLeftRight,
  Activity,
  LogOut,
  X,
  ShieldAlert,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Farmers", href: "/admin/farmers", icon: Users },
  { label: "Volunteers", href: "/admin/volunteers", icon: HandHelping },
  { label: "Redemptions", href: "/admin/redemptions", icon: ArrowLeftRight },
  { label: "Model Health", href: "/admin/model-health", icon: Activity },
]

interface AdminSidebarProps {
  open: boolean
  onClose: () => void
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === "Escape") onClose()
          }}
          role="button"
          tabIndex={0}
          aria-label="Close sidebar"
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-800 bg-[#111111] text-neutral-300 transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-neutral-800 px-5">
          <Link href="/admin" className="flex items-center gap-2.5">
            <ShieldAlert className="h-6 w-6 text-orange-500" />
            <span className="text-lg font-semibold text-white">
              Admin Panel
            </span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-400 hover:text-white lg:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navItems.map((item) => {
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
                : pathname.startsWith(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "border-l-2 border-orange-500 bg-orange-500/10 text-orange-400"
                    : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
                )}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        {/* Admin user */}
        <div className="border-t border-neutral-800 p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-9 w-9 border border-neutral-700">
              <AvatarFallback className="bg-neutral-800 text-sm text-orange-400">
                AD
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="truncate text-sm font-medium text-white">
                Admin User
              </p>
              <p className="text-xs text-neutral-500">Super Admin</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-neutral-500 hover:text-red-400"
            >
              <LogOut className="h-4 w-4" />
              <span className="sr-only">Logout</span>
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
