"use client"

import Link from "next/link"
import { ArrowRight, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/scans?limit=5')
const recentScans = [
  {
    id: 1,
    type: "Drone" as const,
    location: "Nashik, Maharashtra",
    date: "2 hours ago",
    coins: 80,
    rating: 5,
  },
  {
    id: 2,
    type: "WhatsApp" as const,
    location: "Pune, Maharashtra",
    date: "5 hours ago",
    coins: 40,
    rating: 4,
  },
  {
    id: 3,
    type: "Soil" as const,
    location: "Ludhiana, Punjab",
    date: "1 day ago",
    coins: 60,
    rating: null,
  },
  {
    id: 4,
    type: "Drone" as const,
    location: "Patna, Bihar",
    date: "2 days ago",
    coins: 80,
    rating: 5,
  },
  {
    id: 5,
    type: "WhatsApp" as const,
    location: "Jaipur, Rajasthan",
    date: "3 days ago",
    coins: 40,
    rating: 4,
  },
]

const typeStyles: Record<string, string> = {
  Drone: "bg-sky-100 text-sky-700",
  WhatsApp: "bg-emerald-100 text-emerald-700",
  Soil: "bg-amber-100 text-amber-700",
}

export function RecentScans() {
  return (
    <Card className="border-border/60 shadow-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold text-foreground md:text-lg">
          Recent Scans
        </CardTitle>
        <Link
          href="/Volunteers/Dashboard/scans"
          className="flex items-center gap-1 text-sm font-medium text-amber-600 transition-colors hover:text-amber-700"
        >
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {recentScans.map((scan, i) => (
          <div
            key={scan.id}
            className={cn(
              "flex items-center justify-between gap-3 px-4 py-3 md:px-6",
              i !== recentScans.length - 1 && "border-b border-border/50"
            )}
          >
            <div className="flex min-w-0 flex-1 items-center gap-3">
              <Badge
                variant="secondary"
                className={cn(
                  "shrink-0 text-xs font-medium",
                  typeStyles[scan.type]
                )}
              >
                {scan.type}
              </Badge>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {scan.location}
                </p>
                <p className="text-xs text-muted-foreground">{scan.date}</p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-3">
              {scan.rating !== null ? (
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: scan.rating }).map((_, j) => (
                    <Star
                      key={j}
                      className="h-3 w-3 fill-amber-400 text-amber-400"
                    />
                  ))}
                </div>
              ) : (
                <span className="text-xs text-muted-foreground italic">
                  Awaiting
                </span>
              )}
              <span className="min-w-[70px] text-right text-sm font-semibold text-amber-600">
                +{scan.coins} coins
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
