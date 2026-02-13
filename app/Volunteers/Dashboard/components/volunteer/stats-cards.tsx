"use client"

import { Coins, Camera, TrendingUp, Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface StatsCardsProps {
  volunteer?: {
    totalCoins?: number
    totalScans?: number
    avgRating?: number
  }
}

export function StatsCards({ volunteer }: StatsCardsProps) {
  const stats = [
    {
      label: "Total Coins Earned",
      value: (volunteer?.totalCoins || 0).toLocaleString(),
      subtext: "Keep earning!",
      trend: "up" as const,
      icon: Coins,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      label: "Scans Completed",
      value: (volunteer?.totalScans || 0).toString(),
      subtext: "Total scans",
      trend: "up" as const,
      icon: Camera,
      color: "text-sky-600",
      bgColor: "bg-sky-50",
    },
    {
      label: "National Ranking",
      value: "#--",
      subtext: "Coming soon",
      trend: "neutral" as const,
      icon: TrendingUp,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      label: "Farmer Rating",
      value: (volunteer?.avgRating || 0).toFixed(1),
      subtext: "Based on ratings",
      trend: "neutral" as const,
      icon: Star,
      color: "text-orange-500",
      bgColor: "bg-orange-50",
    },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 md:gap-4 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="border-border/60 shadow-sm">
          <CardContent className="p-4 md:p-5">
            <div className="flex items-start justify-between">
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-medium text-muted-foreground md:text-sm">
                  {stat.label}
                </p>
                <p className={`mt-1 text-2xl font-bold md:text-3xl ${stat.color}`}>
                  {stat.value}
                  {stat.label === "Farmer Rating" && (
                    <Star className="ml-1 mb-1 inline h-5 w-5 fill-orange-500 text-orange-500" />
                  )}
                </p>
              </div>
              <div className={`rounded-lg p-2 ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
            </div>
            <p className="mt-2 flex items-center text-xs text-muted-foreground">
              {stat.trend === "up" && (
                <TrendingUp className="mr-1 h-3 w-3 text-emerald-500" />
              )}
              <span className={stat.trend === "up" ? "text-emerald-600" : ""}>
                {stat.subtext}
              </span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
