"use client"

import { Badge } from "@/components/ui/badge"

interface RankBadgeProps {
  totalCoins: number
  totalScans: number
}

export function RankBadge({ totalCoins, totalScans }: RankBadgeProps) {
  if (totalCoins > 500) {
    return (
      <Badge className="border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50">
        Top Performer
      </Badge>
    )
  }
  if (totalScans > 100) {
    return (
      <Badge className="border-purple-200 bg-purple-50 text-purple-700 hover:bg-purple-50">
        Community Hero
      </Badge>
    )
  }
  if (totalScans > 50) {
    return (
      <Badge className="border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-50">
        Field Expert
      </Badge>
    )
  }
  return null
}
