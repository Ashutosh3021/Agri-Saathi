'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { 
  Trophy, 
  Medal,
  Star,
  Camera,
  Coins,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/leaderboard')
const mockLeaderboard = [
  { rank: 1, name: 'Ravi Kumar', location: 'Pune, MH', scans: 342, coins: 3420, rating: 4.9, badge: '🏆 Top Performer', change: 0 },
  { rank: 2, name: 'Priya Devi', location: 'Ludhiana, PB', scans: 289, coins: 2890, rating: 4.8, badge: '💎 Elite', change: 1 },
  { rank: 3, name: 'Suresh Patil', location: 'Nashik, MH', scans: 198, coins: 2340, rating: 5.0, badge: '⭐ Expert', change: -1 },
  { rank: 4, name: 'Amit Singh', location: 'Jaipur, RJ', scans: 175, coins: 2100, rating: 4.6, badge: null, change: 2 },
  { rank: 5, name: 'Sunita Devi', location: 'Lucknow, UP', scans: 162, coins: 1890, rating: 4.7, badge: null, change: 0 },
  { rank: 6, name: 'Rajesh Kumar', location: 'Patna, BR', scans: 145, coins: 1650, rating: 4.5, badge: null, change: 1 },
  { rank: 7, name: 'Anita Sharma', location: 'Indore, MP', scans: 128, coins: 1480, rating: 4.8, badge: null, change: -2 },
  { rank: 8, name: 'You', location: 'Patna, BR', scans: 112, coins: 1240, rating: 4.7, badge: null, change: 0, isCurrentUser: true },
  { rank: 9, name: 'Vikram Rao', location: 'Hyderabad, TG', scans: 98, coins: 1150, rating: 4.4, badge: null, change: 1 },
  { rank: 10, name: 'Neha Gupta', location: 'Delhi, DL', scans: 87, coins: 980, rating: 4.6, badge: null, change: -1 },
]

const tabs = [
  { id: 'national', label: 'National' },
  { id: 'state', label: 'Your State' },
  { id: 'district', label: 'Your District' },
]

const getRankIcon = (rank: number) => {
  if (rank === 1) return <Medal className="w-6 h-6 text-yellow-500" />
  if (rank === 2) return <Medal className="w-6 h-6 text-gray-400" />
  if (rank === 3) return <Medal className="w-6 h-6 text-amber-700" />
  return <span className="w-6 text-center font-semibold text-gray-600">#{rank}</span>
}

const getChangeIcon = (change: number) => {
  if (change > 0) return <TrendingUp className="w-4 h-4 text-green-500" />
  if (change < 0) return <TrendingDown className="w-4 h-4 text-red-500" />
  return <Minus className="w-4 h-4 text-gray-400" />
}

export default function LeaderboardPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('national')
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            Leaderboard
            <span className="flex items-center gap-1 text-sm font-normal text-green-600">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
              </span>
              LIVE
            </span>
          </h1>
          <p className="text-gray-600 mt-1">See how you rank among other volunteers</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "pb-3 text-sm font-medium border-b-2 transition-colors",
                activeTab === tab.id
                  ? "border-amber-500 text-amber-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Desktop View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Scans</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Coins</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Badge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {mockLeaderboard.map((user) => (
                <tr 
                  key={user.rank} 
                  className={cn(
                    "hover:bg-gray-50",
                    user.isCurrentUser && "bg-amber-50 hover:bg-amber-100"
                  )}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getRankIcon(user.rank)}
                      {getChangeIcon(user.change)}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{user.name}</span>
                      {user.isCurrentUser && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">You</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{user.location}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm">
                      <Camera className="w-4 h-4 text-gray-400" />
                      {user.scans}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-sm font-semibold text-amber-600">
                      <Coins className="w-4 h-4" />
                      {user.coins.toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-amber-500 fill-current" />
                      <span className="text-sm font-medium">{user.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {user.badge && (
                      <span className="text-sm">{user.badge}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden divide-y divide-gray-100">
          {mockLeaderboard.map((user) => (
            <div 
              key={user.rank} 
              className={cn(
                "p-4",
                user.isCurrentUser && "bg-amber-50"
              )}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  {getRankIcon(user.rank)}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900">{user.name}</span>
                      {user.isCurrentUser && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">You</span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{user.location}</p>
                  </div>
                </div>
                {getChangeIcon(user.change)}
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Camera className="w-4 h-4 text-gray-400" />
                  <span>{user.scans} scans</span>
                </div>
                <div className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Coins className="w-4 h-4" />
                  <span>{user.coins.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span>{user.rating}★</span>
                </div>
              </div>

              {user.badge && (
                <div className="mt-3 text-sm">{user.badge}</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-yellow-500 to-amber-600 rounded-xl p-6 text-white">
          <Trophy className="w-8 h-8 mb-3" />
          <p className="text-3xl font-bold">#8</p>
          <p className="text-white/80">Your National Rank</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <Camera className="w-8 h-8 mb-3" />
          <p className="text-3xl font-bold">112</p>
          <p className="text-white/80">Your Total Scans</p>
        </div>
        
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <Coins className="w-8 h-8 mb-3" />
          <p className="text-3xl font-bold">1,240</p>
          <p className="text-white/80">Your Coin Balance</p>
        </div>
      </div>
    </div>
  )
}
