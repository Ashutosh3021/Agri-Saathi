"use client"

import { useState } from "react"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/scans')
const mockScans = [
  {
    id: 1,
    type: "Drone" as const,
    date: "Feb 13, 2026",
    farmer: "Farmer from Nashik, MH",
    result: "Leaf Blight detected",
    coins: 80,
    rating: 5,
  },
  {
    id: 2,
    type: "WhatsApp" as const,
    date: "Feb 13, 2026",
    farmer: "Farmer from Pune, MH",
    result: "Powdery Mildew identified",
    coins: 40,
    rating: 4,
  },
  {
    id: 3,
    type: "Soil" as const,
    date: "Feb 12, 2026",
    farmer: "Farmer from Ludhiana, PB",
    result: "Soil analysis complete",
    coins: 60,
    rating: null,
  },
  {
    id: 4,
    type: "Drone" as const,
    date: "Feb 11, 2026",
    farmer: "Farmer from Patna, BR",
    result: "Healthy crop confirmed",
    coins: 80,
    rating: 5,
  },
  {
    id: 5,
    type: "WhatsApp" as const,
    date: "Feb 10, 2026",
    farmer: "Farmer from Jaipur, RJ",
    result: "Root Rot suspected",
    coins: 40,
    rating: 4,
  },
  {
    id: 6,
    type: "Drone" as const,
    date: "Feb 9, 2026",
    farmer: "Farmer from Indore, MP",
    result: "Nutrient deficiency",
    coins: 80,
    rating: 3,
  },
  {
    id: 7,
    type: "Soil" as const,
    date: "Feb 8, 2026",
    farmer: "Farmer from Varanasi, UP",
    result: "Soil pH analysis",
    coins: 60,
    rating: null,
  },
  {
    id: 8,
    type: "WhatsApp" as const,
    date: "Feb 7, 2026",
    farmer: "Farmer from Bhopal, MP",
    result: "Yellow Mosaic Virus",
    coins: 40,
    rating: 5,
  },
]

const filterTabs = ["All", "Drone", "WhatsApp", "Soil"]

const typeStyles: Record<string, string> = {
  Drone: "bg-sky-100 text-sky-700",
  WhatsApp: "bg-emerald-100 text-emerald-700",
  Soil: "bg-amber-100 text-amber-700",
}

export default function ScansPage() {
  const [activeFilter, setActiveFilter] = useState("All")

  const filteredScans =
    activeFilter === "All"
      ? mockScans
      : mockScans.filter((s) => s.type === activeFilter)

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground md:text-3xl">
          My Scans
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mockScans.length} total scans completed
        </p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 border-b border-border">
        {filterTabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveFilter(tab)}
            className={cn(
              "px-4 py-2.5 text-sm font-medium transition-colors",
              activeFilter === tab
                ? "border-b-2 border-amber-600 text-amber-600"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Scan cards */}
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {filteredScans.map((scan) => (
          <Card
            key={scan.id}
            className="border-border/60 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Badge
                  variant="secondary"
                  className={cn("text-xs font-medium", typeStyles[scan.type])}
                >
                  {scan.type}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {scan.date}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-foreground">
                {scan.farmer}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {scan.result}
              </p>
              <div className="mt-3 flex items-center justify-between border-t border-border/50 pt-3">
                <span className="text-sm font-bold text-amber-600">
                  +{scan.coins} coins
                </span>
                {scan.rating !== null ? (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-3.5 w-3.5",
                          i < scan.rating
                            ? "fill-amber-400 text-amber-400"
                            : "fill-muted text-muted"
                        )}
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground italic">
                    Awaiting rating
                  </span>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredScans.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-sm text-muted-foreground">
            No scans found for this filter.
          </p>
        </div>
      )}
    </div>
  )
}
