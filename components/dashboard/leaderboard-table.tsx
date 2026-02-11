"use client"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RankBadge } from "@/components/dashboard/rank-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Star } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export interface Volunteer {
  id: string
  name: string
  district: string
  state: string
  totalCoins: number
  totalScans: number
  avgRating: number
  rank: number
}

const rankColors: Record<number, string> = {
  1: "bg-yellow-50 border-yellow-200",
  2: "bg-neutral-50 border-neutral-200",
  3: "bg-orange-50 border-orange-200",
}

const rankMedals: Record<number, string> = {
  1: "text-yellow-500",
  2: "text-neutral-400",
  3: "text-orange-400",
}

export function LeaderboardSkeleton() {
  return (
    <div className="space-y-2">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 rounded-lg border border-neutral-200 bg-white p-4">
          <Skeleton className="h-6 w-8" />
          <Skeleton className="h-9 w-9 rounded-full" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-5 w-20 rounded-full" />
        </div>
      ))}
    </div>
  )
}

interface LeaderboardTableProps {
  volunteers: Volunteer[]
  currentUserId: string
}

export function LeaderboardTable({ volunteers, currentUserId }: LeaderboardTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white">
      <Table>
        <TableHeader>
          <TableRow className="border-neutral-200 bg-neutral-50 hover:bg-neutral-50">
            <TableHead className="w-16 text-xs font-medium text-neutral-500">Rank</TableHead>
            <TableHead className="text-xs font-medium text-neutral-500">Volunteer</TableHead>
            <TableHead className="text-xs font-medium text-neutral-500">Location</TableHead>
            <TableHead className="text-right text-xs font-medium text-neutral-500">Scans</TableHead>
            <TableHead className="text-right text-xs font-medium text-neutral-500">Coins</TableHead>
            <TableHead className="text-right text-xs font-medium text-neutral-500">Rating</TableHead>
            <TableHead className="text-right text-xs font-medium text-neutral-500">Badge</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {volunteers.map((v) => {
            const isCurrentUser = v.id === currentUserId
            const isTop3 = v.rank <= 3
            return (
              <TableRow
                key={v.id}
                className={cn(
                  "border-neutral-100 transition-colors",
                  isCurrentUser && "bg-green-50 hover:bg-green-50",
                  isTop3 && !isCurrentUser && rankColors[v.rank],
                  !isTop3 && !isCurrentUser && "hover:bg-neutral-50"
                )}
              >
                <TableCell>
                  <span
                    className={cn(
                      "text-sm font-bold",
                      isTop3 ? rankMedals[v.rank] : "text-neutral-400"
                    )}
                  >
                    #{v.rank}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-neutral-100 text-xs font-medium text-neutral-600">
                        {v.name.split(" ").map((n) => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className={cn("text-sm font-medium", isCurrentUser ? "text-green-800" : "text-neutral-800")}>
                      {v.name}
                      {isCurrentUser && <span className="ml-1.5 text-xs text-green-600">(You)</span>}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-sm text-neutral-500">
                  {v.district}, {v.state}
                </TableCell>
                <TableCell className="text-right text-sm font-medium text-neutral-700">
                  {v.totalScans}
                </TableCell>
                <TableCell className="text-right text-sm font-semibold text-amber-600">
                  {v.totalCoins.toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center gap-1 text-sm text-neutral-600">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    {v.avgRating.toFixed(1)}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <RankBadge totalCoins={v.totalCoins} totalScans={v.totalScans} />
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}
