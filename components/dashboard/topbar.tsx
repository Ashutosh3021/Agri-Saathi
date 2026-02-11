"use client"

import { Menu, Bell, Coins } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TopBarProps {
  onMenuClick: () => void
  session: { id: string; name: string; coins: number }
}

export function TopBar({ onMenuClick, session }: TopBarProps) {
  return (
    <header className="flex h-16 items-center justify-between border-b border-neutral-200 bg-white px-4 lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-neutral-600 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Open sidebar</span>
        </Button>
        <h1 className="text-lg font-semibold text-neutral-900">Dashboard</h1>
      </div>

      <div className="flex items-center gap-3">
        {/* Coin balance pill */}
        <div className="flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1.5 text-sm font-medium text-amber-700">
          <Coins className="h-4 w-4" />
          <span>{session.coins.toLocaleString()}</span>
        </div>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-neutral-500"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-green-500" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}
