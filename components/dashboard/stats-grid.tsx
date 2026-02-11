"use client"

import React from "react"

import { Coins, Camera, Hash, Star } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

interface StatCardProps {
  title: string
  value: string
  subtext: string
  icon: React.ReactNode
  iconBg: string
}

function StatCard({ title, value, subtext, icon, iconBg }: StatCardProps) {
  return (
    <div className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-5">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconBg}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-neutral-500">{title}</p>
        <p className="mt-0.5 text-2xl font-bold text-neutral-900">{value}</p>
        <p className="mt-0.5 text-xs text-neutral-400">{subtext}</p>
      </div>
    </div>
  )
}

export function StatsGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex items-start gap-4 rounded-xl border border-neutral-200 bg-white p-5">
          <Skeleton className="h-11 w-11 rounded-lg" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
      ))}
    </div>
  )
}

interface StatsGridProps {
  stats: {
    totalCoins: number
    coinsToday: number
    totalScans: number
    scansThisWeek: number
    rank: number
    rankChange: number
    avgRating: number
  }
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Coins"
        value={stats.totalCoins.toLocaleString()}
        subtext={`+${stats.coinsToday} today`}
        icon={<Coins className="h-5 w-5 text-amber-600" />}
        iconBg="bg-amber-50"
      />
      <StatCard
        title="Total Scans"
        value={stats.totalScans.toLocaleString()}
        subtext={`${stats.scansThisWeek} this week`}
        icon={<Camera className="h-5 w-5 text-blue-600" />}
        iconBg="bg-blue-50"
      />
      <StatCard
        title="Your Rank"
        value={`#${stats.rank}`}
        subtext={`National ${stats.rankChange > 0 ? "\u2191" : "\u2193"} ${Math.abs(stats.rankChange)}`}
        icon={<Hash className="h-5 w-5 text-green-600" />}
        iconBg="bg-green-50"
      />
      <StatCard
        title="Avg Rating"
        value={stats.avgRating.toFixed(1)}
        subtext="out of 5.0"
        icon={<Star className="h-5 w-5 text-yellow-500" />}
        iconBg="bg-yellow-50"
      />
    </div>
  )
}
