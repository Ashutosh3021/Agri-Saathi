'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Coins, 
  Camera, 
  TrendingUp, 
  Star, 
  ArrowUp,
  ArrowRight,
  Smartphone,
  Plane,
  Wallet
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/dashboard')
const mockData = {
  totalCoins: 1240,
  totalScans: 112,
  nationalRank: 8,
  avgRating: 4.7,
  activeDays: 23,
  lastScanHours: 2,
  weeklyCoins: 80,
  weeklyScans: 5,
  rankChange: 2,
  totalRatings: 89,
  recentScans: [
    { 
      id: 1, 
      type: "Drone", 
      location: "Patna, Bihar", 
      time: "2 hours ago", 
      coins: 80, 
      rating: 5,
      result: "Rice Blast Disease"
    },
    { 
      id: 2, 
      type: "WhatsApp", 
      location: "Muzaffarpur, Bihar", 
      time: "5 hours ago", 
      coins: 40, 
      rating: 4,
      result: "Healthy Crop"
    },
    { 
      id: 3, 
      type: "Soil", 
      location: "Gaya, Bihar", 
      time: "1 day ago", 
      coins: 60, 
      rating: null,
      result: "Nitrogen Deficiency"
    },
    { 
      id: 4, 
      type: "Drone", 
      location: "Bhagalpur, Bihar", 
      time: "2 days ago", 
      coins: 80, 
      rating: 5,
      result: "Healthy Crop"
    },
    { 
      id: 5, 
      type: "WhatsApp", 
      location: "Darbhanga, Bihar", 
      time: "3 days ago", 
      coins: 40, 
      rating: 5,
      result: "Leaf Spot Disease"
    },
  ]
}

const typeColors: Record<string, string> = {
  Drone: "bg-blue-100 text-blue-700",
  WhatsApp: "bg-green-100 text-green-700",
  Soil: "bg-amber-100 text-amber-700"
}

export default function DashboardPage() {
  const router = useRouter()
  const [data, setData] = useState(mockData)
  const supabase = createClient()

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/Volunteers')
      }
    }
    checkAuth()
  }, [router, supabase])

  const stats = [
    { 
      label: "Total Coins Earned", 
      value: data.totalCoins.toLocaleString(),
      subtext: `+${data.weeklyCoins} this week`,
      subtextColor: "text-green-600",
      icon: Coins,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600"
    },
    { 
      label: "Scans Completed", 
      value: data.totalScans.toString(),
      subtext: `+${data.weeklyScans} this week`,
      subtextColor: "text-green-600",
      icon: Camera,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600"
    },
    { 
      label: "National Ranking", 
      value: `#${data.nationalRank}`,
      subtext: `↑${data.rankChange} from last week`,
      subtextColor: "text-green-600",
      icon: TrendingUp,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600"
    },
    { 
      label: "Farmer Rating", 
      value: `${data.avgRating}★`,
      subtext: `Based on ${data.totalRatings} ratings`,
      subtextColor: "text-gray-500",
      icon: Star,
      iconBg: "bg-orange-100",
      iconColor: "text-orange-600"
    },
  ]

  const progressToNext = (data.totalCoins / 1500) * 100
  const coinsNeeded = 1500 - data.totalCoins

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Welcome back! 👋
        </h1>
        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span>{new Date().toLocaleDateString('en-IN', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</span>
          <span>•</span>
          <span className="bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
            Active for {data.activeDays} days
          </span>
          <span>•</span>
          <span>Last scan: {data.lastScanHours} hours ago</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-4">
              <div className={cn("w-12 h-12 rounded-lg flex items-center justify-center", stat.iconBg)}>
                <stat.icon className={cn("w-6 h-6", stat.iconColor)} />
              </div>
              {stat.subtext && (
                <span className={cn("text-xs flex items-center gap-1", stat.subtextColor)}>
                  <ArrowUp className="w-3 h-3" />
                  {stat.subtext}
                </span>
              )}
            </div>
            <p className="text-3xl font-bold text-gray-900 mb-1">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent Scans - 3 cols */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Recent Scans</h2>
            <a 
              href="/volunteer/dashboard/scans" 
              className="text-amber-600 text-sm hover:underline flex items-center gap-1"
            >
              View all scans
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          <div className="space-y-4">
            {data.recentScans.map((scan) => (
              <div key={scan.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className={cn("text-xs px-2 py-1 rounded-full font-medium", typeColors[scan.type])}>
                    {scan.type}
                  </span>
                  <div>
                    <p className="font-medium text-gray-900">Farmer from {scan.location}</p>
                    <p className="text-sm text-gray-500">{scan.result} • {scan.time}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-amber-600">+{scan.coins} coins</p>
                  {scan.rating ? (
                    <div className="flex items-center gap-1 text-sm text-amber-500">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          className={cn("w-3 h-3", i < scan.rating! ? "fill-current" : "text-gray-300")} 
                        />
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400">Awaiting rating</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coin Progress - 2 cols */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Next Milestone</h2>
          
          <div className="text-center mb-6">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coins className="w-6 h-6 text-amber-500" />
              <span className="text-3xl font-bold text-gray-900">{data.totalCoins.toLocaleString()} coins</span>
            </div>
            <Progress value={progressToNext} className="h-2 mb-2" />
            <p className="text-sm text-gray-600">
              {coinsNeeded} more coins to unlock +150 bonus
            </p>
          </div>

          <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">🎯 1,500 coins</p>
                <p className="text-sm text-amber-700">→ +150 bonus</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl p-6 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <Smartphone className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Report a Scan</h3>
          <p className="text-green-100 text-sm mb-4">
            Upload photos from your recent farm visit
          </p>
          <Button className="bg-white text-green-700 hover:bg-gray-100">
            Upload Now
          </Button>
        </div>

        <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-6 text-white">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <Plane className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Schedule Drone Visit</h3>
          <p className="text-blue-100 text-sm mb-4">
            Plan your next field scanning session
          </p>
          <Button className="bg-white text-blue-700 hover:bg-gray-100">
            Schedule
          </Button>
        </div>

        <div className={cn(
          "rounded-xl p-6 text-white",
          data.totalCoins >= 500 
            ? "bg-gradient-to-br from-amber-600 to-orange-600" 
            : "bg-gradient-to-br from-gray-500 to-gray-600"
        )}>
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-4">
            <Wallet className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Redeem Coins</h3>
          <p className="text-white/80 text-sm mb-4">
            {data.totalCoins >= 500 
              ? "Convert your coins to cash" 
              : `Min 500 coins needed (you have ${data.totalCoins})`
            }
          </p>
          <Button 
            className="bg-white text-gray-900 hover:bg-gray-100"
            disabled={data.totalCoins < 500}
            onClick={() => router.push('/volunteer/dashboard/redeem')}
          >
            Redeem Now
          </Button>
        </div>
      </div>
    </div>
  )
}
