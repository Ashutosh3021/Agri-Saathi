"use client"

import React from "react"

import { useState, useEffect, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Input } from "@/components/ui/input"
import { Star, Camera, Plane, FlaskConical, Smartphone, ScanSearch } from "lucide-react"

interface Scan {
  id: string
  type: "Drone" | "WhatsApp" | "Soil"
  date: string
  farmerLocation: string
  disease: string | null
  confidence: number
  coinsEarned: number
  farmerRating: number
}

const MOCK_SCANS: Scan[] = [
  { id: "s1", type: "Drone", date: "Feb 9, 2026", farmerLocation: "Nagpur, Maharashtra", disease: "Leaf Blight", confidence: 94, coinsEarned: 15, farmerRating: 5.0 },
  { id: "s2", type: "WhatsApp", date: "Feb 8, 2026", farmerLocation: "Amravati, Maharashtra", disease: null, confidence: 0, coinsEarned: 10, farmerRating: 4.5 },
  { id: "s3", type: "Soil", date: "Feb 7, 2026", farmerLocation: "Wardha, Maharashtra", disease: "Nitrogen Deficiency", confidence: 88, coinsEarned: 12, farmerRating: 5.0 },
  { id: "s4", type: "Drone", date: "Feb 6, 2026", farmerLocation: "Yavatmal, Maharashtra", disease: "Rust", confidence: 91, coinsEarned: 15, farmerRating: 4.8 },
  { id: "s5", type: "WhatsApp", date: "Feb 5, 2026", farmerLocation: "Chandrapur, Maharashtra", disease: "Powdery Mildew", confidence: 86, coinsEarned: 10, farmerRating: 4.0 },
  { id: "s6", type: "Drone", date: "Feb 3, 2026", farmerLocation: "Buldhana, Maharashtra", disease: "Cercospora Leaf Spot", confidence: 79, coinsEarned: 15, farmerRating: 4.7 },
  { id: "s7", type: "Soil", date: "Feb 2, 2026", farmerLocation: "Akola, Maharashtra", disease: "P Deficiency", confidence: 92, coinsEarned: 12, farmerRating: 4.6 },
  { id: "s8", type: "WhatsApp", date: "Jan 31, 2026", farmerLocation: "Washim, Maharashtra", disease: null, confidence: 0, coinsEarned: 10, farmerRating: 4.9 },
  { id: "s9", type: "Drone", date: "Jan 30, 2026", farmerLocation: "Gondia, Maharashtra", disease: "Bacterial Wilt", confidence: 83, coinsEarned: 15, farmerRating: 4.3 },
  { id: "s10", type: "Soil", date: "Jan 28, 2026", farmerLocation: "Bhandara, Maharashtra", disease: "K Deficiency", confidence: 90, coinsEarned: 12, farmerRating: 4.5 },
]

const typeConfig: Record<string, { icon: React.ElementType; bg: string; text: string; border: string }> = {
  Drone: { icon: Plane, bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  WhatsApp: { icon: Smartphone, bg: "bg-green-50", text: "text-green-700", border: "border-green-200" },
  Soil: { icon: FlaskConical, bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
}

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/scans?type=all')
// Expected response: { scans: Array<{ id, type, date, farmerLocation, disease, confidence, coinsEarned, farmerRating }> }
function useScans() {
  const [loading, setLoading] = useState(true)
  const [scans, setScans] = useState<Scan[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setScans(MOCK_SCANS)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return { loading, scans }
}

function ScanCardSkeleton() {
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-5 w-20 rounded-full" />
          <Skeleton className="h-4 w-28" />
        </div>
        <Skeleton className="h-12 w-12 rounded-lg" />
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-4 w-36" />
      </div>
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-16" />
      </div>
    </div>
  )
}

function renderStars(rating: number) {
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < Math.floor(rating)
              ? "fill-yellow-400 text-yellow-400"
              : "fill-neutral-200 text-neutral-200"
          }`}
        />
      ))}
    </span>
  )
}

export default function ScansPage() {
  const { loading, scans } = useScans()
  const [filter, setFilter] = useState("all")
  const [dateSearch, setDateSearch] = useState("")

  const filtered = useMemo(() => {
    let result = scans
    if (filter !== "all") {
      result = result.filter((s) => s.type === filter)
    }
    if (dateSearch.trim()) {
      result = result.filter((s) =>
        s.date.toLowerCase().includes(dateSearch.toLowerCase())
      )
    }
    return result
  }, [scans, filter, dateSearch])

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">My Scans</h1>
        <p className="text-sm text-neutral-500">View all your crop scan history</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="bg-neutral-100">
            <TabsTrigger value="all" className="data-[state=active]:bg-white data-[state=active]:text-neutral-900">All</TabsTrigger>
            <TabsTrigger value="Drone" className="data-[state=active]:bg-white data-[state=active]:text-neutral-900">Drone</TabsTrigger>
            <TabsTrigger value="WhatsApp" className="data-[state=active]:bg-white data-[state=active]:text-neutral-900">WhatsApp</TabsTrigger>
            <TabsTrigger value="Soil" className="data-[state=active]:bg-white data-[state=active]:text-neutral-900">Soil Device</TabsTrigger>
          </TabsList>
        </Tabs>
        <Input
          type="text"
          placeholder="Search by date..."
          value={dateSearch}
          onChange={(e) => setDateSearch(e.target.value)}
          className="w-full border-neutral-200 bg-white sm:w-56"
        />
      </div>

      {/* Scan cards */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <ScanCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        /* Empty state */
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-neutral-300 bg-white py-16">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100">
            <ScanSearch className="h-7 w-7 text-neutral-400" />
          </div>
          <p className="mt-4 text-base font-medium text-neutral-700">No scans yet</p>
          <p className="mt-1 text-sm text-neutral-500">
            Get started by accepting a nearby farmer request.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((scan) => {
            const config = typeConfig[scan.type]
            const Icon = config.icon
            return (
              <div
                key={scan.id}
                className="group rounded-xl border border-neutral-200 bg-white p-5 transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <Badge
                      variant="outline"
                      className={`${config.bg} ${config.text} ${config.border}`}
                    >
                      <Icon className="mr-1 h-3 w-3" />
                      {scan.type}
                    </Badge>
                    <p className="mt-2 text-xs text-neutral-400">{scan.date}</p>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-neutral-100">
                    <Camera className="h-5 w-5 text-neutral-400" />
                  </div>
                </div>

                <div className="mt-3">
                  <p className="text-sm font-medium text-neutral-800">{scan.farmerLocation}</p>
                  {scan.disease ? (
                    <p className="mt-1 text-sm text-red-600">
                      {scan.disease}
                      <span className="ml-1.5 text-xs text-neutral-400">
                        ({scan.confidence}% confidence)
                      </span>
                    </p>
                  ) : (
                    <p className="mt-1 text-sm text-green-600">No disease found</p>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3">
                  <span className="text-sm font-semibold text-amber-600">
                    +{scan.coinsEarned} coins
                  </span>
                  {renderStars(scan.farmerRating)}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
