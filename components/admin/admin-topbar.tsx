"use client"

import { Menu, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface AdminTopBarProps {
  onMenuClick: () => void
  title: string
  pendingCount?: number
}

export function AdminTopBar({ onMenuClick, title, pendingCount = 0 }: AdminTopBarProps) {
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
        <h1 className="text-lg font-semibold text-neutral-900">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        {pendingCount > 0 && (
          <Badge className="border-red-200 bg-red-50 text-red-700">
            {pendingCount} Pending
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9 text-neutral-500"
        >
          <Bell className="h-5 w-5" />
          {pendingCount > 0 && (
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500" />
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  )
}
