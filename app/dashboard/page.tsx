"use client"

import { useState, useEffect } from "react"
import { StatsGrid, StatsGridSkeleton } from "@/components/dashboard/stats-grid"
import { ScanHistoryList, ScanHistorySkeleton } from "@/components/dashboard/scan-history-list"
import type { ScanRecord } from "@/components/dashboard/scan-history-list"
import { CoinHistory, CoinHistorySkeleton } from "@/components/dashboard/coin-history"
import type { CoinTransaction } from "@/components/dashboard/coin-history"
import { Progress } from "@/components/ui/progress"
import { Target, Camera, Star, Wallet, Trophy } from "lucide-react"
import RatingDisplay from "@/components/dashboard/RatingDisplay"
import Link from "next/link"

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

      {/* Reputation & Coin Progress Widgets */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Reputation Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Reputation</h2>
          <div className="flex flex-col items-center mb-4">
            <span className="text-5xl font-bold text-gray-900">4.8</span>
            <div className="mt-2">
              <RatingDisplay rating={4.8} size="lg" showBreakdown={true} />
            </div>
            <p className="text-sm text-gray-500 mt-2">Based on 89 farmer ratings</p>
          </div>
          <div className="border-t border-gray-100 pt-4 mt-4">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Recent Ratings</h3>
            <div className="space-y-3">
              {[
                { rating: 5, scanType: 'Drone', date: '2 days ago', feedback: 'Very professional!' },
                { rating: 4.5, scanType: 'WhatsApp', date: '4 days ago', feedback: null },
                { rating: 5, scanType: 'Soil', date: '1 week ago', feedback: 'Helped a lot' },
                { rating: 4, scanType: 'Drone', date: '2 weeks ago', feedback: null },
                { rating: 5, scanType: 'WhatsApp', date: '3 weeks ago', feedback: 'Saved my tomatoes!' },
              ].map((item, index) => (
                <div key={index} className="flex items-center gap-3 text-sm">
                  <span className="text-amber-500">
                    {'⭐'.repeat(Math.floor(item.rating))}
                    {item.rating % 1 >= 0.5 && '½'}
                  </span>
                  <span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    {item.scanType}
                  </span>
                  <span className="text-gray-500 text-xs">{item.date}</span>
                  {item.feedback && (
                    <span className="text-gray-400 italic truncate max-w-[120px]">
                      "{item.feedback}"
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
          <Link href="/dashboard/ratings" className="inline-flex items-center text-green-600 hover:text-green-700 text-sm font-medium mt-4">
            View all ratings →
          </Link>
        </div>

        {/* Coin Progress Widget */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Coin Progress</h2>
          <div className="text-center mb-6">
            <span className="text-4xl font-bold text-[#f59e0b]">💰 1,240 coins</span>
            <p className="text-gray-500 text-sm mt-1">= ₹124.00</p>
          </div>
          <div className="space-y-3">
            <p className="text-sm text-gray-600">260 more coins to reach 1,500 milestone</p>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="h-full bg-green-600 rounded-full" style={{ width: '82.6%' }} />
            </div>
            <p className="text-green-600 text-sm font-medium">🎯 1,500 coins → +150 bonus coins</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Feed */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Recent Activity</h2>
        <div className="space-y-4">
          {[
            { type: 'scan', action: 'Completed drone scan for Ramesh Patel', details: '+80 coins • Pune', time: '2 hours ago' },
            { type: 'rating', action: '5★ rating received from farmer', details: '+20 bonus coins', time: '5 hours ago' },
            { type: 'scan', action: 'Soil reading completed', details: '+60 coins • Nashik', time: 'Yesterday' },
            { type: 'redemption', action: 'Redeemed 500 coins', details: '₹50 UPI transfer', time: '2 days ago' },
            { type: 'scan', action: 'WhatsApp scan completed', details: '+50 coins • Mumbai', time: '3 days ago' },
            { type: 'milestone', action: 'Milestone reached: 100 scans', details: '+200 bonus coins', time: '4 days ago' },
            { type: 'rating', action: '4★ rating received', details: '+10 bonus coins', time: '5 days ago' },
            { type: 'scan', action: 'Soil reading completed', details: '+60 coins • Satara', time: '1 week ago' },
          ].map((activity, index) => {
            const iconConfig = {
              scan: { icon: Camera, bg: 'bg-green-100', text: 'text-green-600' },
              coins: { icon: Wallet, bg: 'bg-amber-100', text: 'text-amber-600' },
              rating: { icon: Star, bg: 'bg-yellow-100', text: 'text-yellow-600' },
              redemption: { icon: Wallet, bg: 'bg-blue-100', text: 'text-blue-600' },
              milestone: { icon: Trophy, bg: 'bg-purple-100', text: 'text-purple-600' },
            }
            const config = iconConfig[activity.type as keyof typeof iconConfig] || iconConfig.scan
            const IconComponent = config.icon
            return (
              <div key={index} className="flex items-start gap-4">
                <div className={`w-10 h-10 rounded-full ${config.bg} ${config.text} flex items-center justify-center flex-shrink-0`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">{activity.action}</p>
                  <p className="text-gray-500 text-xs mt-0.5">{activity.details}</p>
                </div>
                <span className="text-gray-400 text-xs whitespace-nowrap">{activity.time}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
