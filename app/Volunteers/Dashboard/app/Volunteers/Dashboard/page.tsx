"use client"

import { useEffect, useState } from "react"
import { StatsCards } from "@/components/volunteer/stats-cards"
import { RecentScans } from "@/components/volunteer/recent-scans"
import { CoinProgress } from "@/components/volunteer/coin-progress"
import { QuickActions } from "@/components/volunteer/quick-actions"

export default function DashboardPage() {
  const [volunteer, setVolunteer] = useState<any>(null)

  useEffect(() => {
    // Fetch volunteer data - auth is already checked in layout
    const fetchVolunteer = async () => {
      try {
        const response = await fetch("/api/volunteer/me")
        const data = await response.json()
        
        if (response.ok) {
          setVolunteer(data.volunteer)
        } else {
          console.error("Error loading volunteer:", data.error)
        }
      } catch (error) {
        console.error("Error fetching volunteer:", error)
      }
    }

    fetchVolunteer()
  }, [])

  const now = new Date()
  const dateStr = now.toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const volunteerName = volunteer?.name?.split(' ')[0] || "Volunteer"
  const daysActive = volunteer?.createdAt 
    ? Math.floor((Date.now() - new Date(volunteer.createdAt).getTime()) / (1000 * 60 * 60 * 24))
    : 0

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-balance text-2xl font-bold text-foreground md:text-3xl">
          {"Welcome back, "}
          {volunteerName}
          {"!"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">{dateStr}</p>
        <div className="mt-2 flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700">
            Active for {daysActive} days
          </span>
          {volunteer?.lastLogin && (
            <span className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
              Last login: {new Date(volunteer.lastLogin).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <StatsCards volunteer={volunteer} />

      {/* Middle section: Recent Scans + Coin Progress */}
      <div className="grid gap-4 lg:grid-cols-[1fr_380px]">
        <RecentScans />
        <CoinProgress coins={volunteer?.totalCoins || 0} />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  )
}
