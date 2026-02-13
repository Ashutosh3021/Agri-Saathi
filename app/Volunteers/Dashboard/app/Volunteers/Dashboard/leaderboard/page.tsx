"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/leaderboard')
const mockLeaderboard = [
  {
    rank: 1,
    name: "Ravi Kumar",
    location: "Pune, MH",
    scans: 342,
    coins: 3420,
    rating: 4.9,
    badge: "Top Performer",
    isCurrentUser: false,
  },
  {
    rank: 2,
    name: "Priya Devi",
    location: "Ludhiana, PB",
    scans: 289,
    coins: 2890,
    rating: 4.8,
    badge: "Elite",
    isCurrentUser: false,
  },
  {
    rank: 3,
    name: "Suresh Patil",
    location: "Nashik, MH",
    scans: 198,
    coins: 2340,
    rating: 5.0,
    badge: "Expert",
    isCurrentUser: false,
  },
  {
    rank: 4,
    name: "Anita Singh",
    location: "Varanasi, UP",
    scans: 176,
    coins: 2010,
    rating: 4.6,
    badge: null,
    isCurrentUser: false,
  },
  {
    rank: 5,
    name: "Deepak Yadav",
    location: "Indore, MP",
    scans: 165,
    coins: 1890,
    rating: 4.5,
    badge: null,
    isCurrentUser: false,
  },
  {
    rank: 6,
    name: "Kavita Mehra",
    location: "Jaipur, RJ",
    scans: 152,
    coins: 1650,
    rating: 4.7,
    badge: null,
    isCurrentUser: false,
  },
  {
    rank: 7,
    name: "Amit Verma",
    location: "Lucknow, UP",
    scans: 140,
    coins: 1500,
    rating: 4.4,
    badge: null,
    isCurrentUser: false,
  },
  {
    rank: 8,
    name: "You",
    location: "Patna, BR",
    scans: 112,
    coins: 1240,
    rating: 4.7,
    badge: null,
    isCurrentUser: true,
  },
  {
    rank: 9,
    name: "Sunita Bai",
    location: "Bhopal, MP",
    scans: 98,
    coins: 1100,
    rating: 4.3,
    badge: null,
    isCurrentUser: false,
  },
  {
    rank: 10,
    name: "Mohan Das",
    location: "Kolkata, WB",
    scans: 87,
    coins: 970,
    rating: 4.2,
    badge: null,
    isCurrentUser: false,
  },
]

const tabs = ["National", "Your State", "Your District"]

function getRankDisplay(rank: number) {
  if (rank === 1) return { medal: "\ud83e\udd47", color: "text-yellow-500" }
  if (rank === 2) return { medal: "\ud83e\udd48", color: "text-gray-400" }
  if (rank === 3) return { medal: "\ud83e\udd49", color: "text-amber-700" }
  return { medal: `#${rank}`, color: "text-foreground" }
}

export default function LeaderboardPage() {
  const [activeTab, setActiveTab] = useState("National")

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          Leaderboard
        </h1>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-700">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
          </span>
          LIVE
        </span>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1 border-b border-border">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors",
              activeTab === tab
                ? "border-b-2 border-amber-600 text-amber-600"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Desktop Table */}
      <Card className="hidden border-border/60 shadow-sm md:block">
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50 text-left text-xs font-medium text-muted-foreground">
                <th className="px-4 py-3">Rank</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Location</th>
                <th className="px-4 py-3 text-right">Scans</th>
                <th className="px-4 py-3 text-right">Coins</th>
                <th className="px-4 py-3 text-right">Rating</th>
                <th className="px-4 py-3">Badge</th>
              </tr>
            </thead>
            <tbody>
              {mockLeaderboard.map((entry) => {
                const rank = getRankDisplay(entry.rank)
                return (
                  <tr
                    key={entry.rank}
                    className={cn(
                      "border-b border-border/50 text-sm transition-colors last:border-0",
                      entry.isCurrentUser
                        ? "bg-amber-50"
                        : "hover:bg-muted/30"
                    )}
                  >
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          "text-base font-bold",
                          rank.color
                        )}
                      >
                        {rank.medal}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {entry.name}
                      {entry.isCurrentUser && (
                        <span className="ml-2 text-xs text-amber-600">
                          (You)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {entry.location}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-foreground">
                      {entry.scans}
                    </td>
                    <td className="px-4 py-3 text-right font-semibold text-amber-600">
                      {entry.coins.toLocaleString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <span className="flex items-center justify-end gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {entry.rating}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {entry.badge ? (
                        <Badge
                          variant="secondary"
                          className="bg-amber-100 text-xs text-amber-700"
                        >
                          {entry.badge}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          --
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {mockLeaderboard.map((entry) => {
          const rank = getRankDisplay(entry.rank)
          return (
            <Card
              key={entry.rank}
              className={cn(
                "border-border/60 shadow-sm",
                entry.isCurrentUser && "border-amber-300 bg-amber-50"
              )}
            >
              <CardContent className="flex items-center gap-3 p-4">
                <span
                  className={cn(
                    "min-w-[36px] text-center text-xl font-bold",
                    rank.color
                  )}
                >
                  {rank.medal}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {entry.name}
                    {entry.isCurrentUser && (
                      <span className="ml-1 text-xs font-normal text-amber-600">
                        (You)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {entry.location}
                  </p>
                  <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                    <span>{entry.scans} scans</span>
                    <span className="flex items-center gap-0.5">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {entry.rating}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-600">
                    {entry.coins.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">coins</p>
                  {entry.badge && (
                    <Badge
                      variant="secondary"
                      className="mt-1 bg-amber-100 text-[10px] text-amber-700"
                    >
                      {entry.badge}
                    </Badge>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
