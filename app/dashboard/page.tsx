"use client"

import { useState, useEffect } from "react"
import { StatsGrid, StatsGridSkeleton } from "@/components/dashboard/stats-grid"
import { ScanHistoryList, ScanHistorySkeleton } from "@/components/dashboard/scan-history-list"
import type { ScanRecord } from "@/components/dashboard/scan-history-list"
import { CoinHistory, CoinHistorySkeleton } from "@/components/dashboard/coin-history"
import type { CoinTransaction } from "@/components/dashboard/coin-history"
import { Progress } from "@/components/ui/progress"
import { Target } from "lucide-react"

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/stats')
// Expected response: { totalCoins, coinsToday, totalScans, scansThisWeek, rank, rankChange, avgRating }
function useDashboardData() {
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<{
    totalCoins: number
    coinsToday: number
    totalScans: number
    scansThisWeek: number
    rank: number
    rankChange: number
    avgRating: number
  } | null>(null)
  const [recentScans, setRecentScans] = useState<ScanRecord[]>([])
  const [coinHistory, setCoinHistory] = useState<CoinTransaction[]>([])

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        totalCoins: 1240,
        coinsToday: 20,
        totalScans: 87,
        scansThisWeek: 3,
        rank: 47,
        rankChange: 5,
        avgRating: 4.8,
      })

      setRecentScans([
        { id: "1", date: "Feb 9, 2026", farmerLocation: "Nagpur, MH", type: "Drone", diseaseFound: "Leaf Blight", coinsEarned: 15, rating: 5.0 },
        { id: "2", date: "Feb 8, 2026", farmerLocation: "Amravati, MH", type: "WhatsApp", diseaseFound: null, coinsEarned: 10, rating: 4.5 },
        { id: "3", date: "Feb 7, 2026", farmerLocation: "Wardha, MH", type: "Soil", diseaseFound: "N Deficiency", coinsEarned: 12, rating: 5.0 },
        { id: "4", date: "Feb 6, 2026", farmerLocation: "Yavatmal, MH", type: "Drone", diseaseFound: "Rust", coinsEarned: 15, rating: 4.8 },
        { id: "5", date: "Feb 5, 2026", farmerLocation: "Chandrapur, MH", type: "WhatsApp", diseaseFound: "Powdery Mildew", coinsEarned: 10, rating: 4.0 },
      ])

      setCoinHistory([
        { id: "c1", type: "earn", description: "Drone scan - Nagpur", amount: 15, date: "Feb 9" },
        { id: "c2", type: "earn", description: "WhatsApp scan - Amravati", amount: 10, date: "Feb 8" },
        { id: "c3", type: "redeem", description: "UPI Transfer", amount: 200, date: "Feb 7" },
        { id: "c4", type: "earn", description: "Soil reading - Wardha", amount: 12, date: "Feb 7" },
        { id: "c5", type: "earn", description: "Drone scan - Yavatmal", amount: 15, date: "Feb 6" },
        { id: "c6", type: "earn", description: "WhatsApp scan - Chandrapur", amount: 10, date: "Feb 5" },
        { id: "c7", type: "earn", description: "Weekly bonus", amount: 50, date: "Feb 3" },
        { id: "c8", type: "redeem", description: "Paytm Transfer", amount: 100, date: "Feb 1" },
        { id: "c9", type: "earn", description: "Drone scan - Buldhana", amount: 15, date: "Jan 30" },
        { id: "c10", type: "earn", description: "Soil reading - Akola", amount: 12, date: "Jan 29" },
      ])

      setLoading(false)
    }, 800)

    return () => clearTimeout(timer)
  }, [])

  return { loading, stats, recentScans, coinHistory }
}

export default function DashboardPage() {
  const { loading, stats, recentScans, coinHistory } = useDashboardData()
  const scansThisMonth = 14
  const targetScans = 24
  const progressPercent = Math.round((scansThisMonth / targetScans) * 100)

  return (
    <div className="space-y-6">
      {/* Stats */}
      {loading || !stats ? <StatsGridSkeleton /> : <StatsGrid stats={stats} />}

      {/* Main content grid */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Recent scans - left side */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 lg:col-span-3">
          <h2 className="mb-4 text-base font-semibold text-neutral-900">Recent Scans</h2>
          {loading ? <ScanHistorySkeleton /> : <ScanHistoryList scans={recentScans} />}
        </div>

        {/* Coin history - right side */}
        <div className="rounded-xl border border-neutral-200 bg-white p-5 lg:col-span-2">
          <h2 className="mb-4 text-base font-semibold text-neutral-900">Coin History</h2>
          {loading ? <CoinHistorySkeleton /> : <CoinHistory transactions={coinHistory} />}
        </div>
      </div>

      {/* CTA Banner */}
      <div className="rounded-xl border border-green-200 bg-green-50 p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-100">
              <Target className="h-5 w-5 text-green-700" />
            </div>
            <div>
              <p className="font-semibold text-green-900">
                Complete {targetScans - scansThisMonth} more scans this month to earn 200 BONUS coins!
              </p>
              <p className="mt-0.5 text-sm text-green-700">
                {scansThisMonth} of {targetScans} scans completed
              </p>
            </div>
          </div>
          <div className="w-full sm:w-48">
            <Progress value={progressPercent} className="h-2.5 bg-green-200 [&>div]:bg-green-600" />
            <p className="mt-1 text-right text-xs font-medium text-green-700">{progressPercent}%</p>
          </div>
        </div>
      </div>
    </div>
  )
}
