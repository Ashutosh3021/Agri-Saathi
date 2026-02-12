"use client"

import { useState, useMemo } from "react"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/leaderboard?filter=national&page=1')

interface LeaderboardEntry {
  id: string
  name: string
  district: string
  state: string
  totalCoins: number
  totalScans: number
  avgRating: number
  nationalRank: number
  trend: number
  isCurrentUser: boolean
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { id: "1", name: "Ravi Kumar", district: "Pune", state: "Maharashtra", totalCoins: 3420, totalScans: 342, avgRating: 4.9, nationalRank: 1, trend: 2, isCurrentUser: false },
  { id: "2", name: "Priya Devi", district: "Ludhiana", state: "Punjab", totalCoins: 2890, totalScans: 289, avgRating: 4.8, nationalRank: 2, trend: 0, isCurrentUser: false },
  { id: "3", name: "Suresh Patil", district: "Nashik", state: "Maharashtra", totalCoins: 2340, totalScans: 198, avgRating: 5.0, nationalRank: 3, trend: 1, isCurrentUser: false },
  { id: "4", name: "Anita Singh", district: "Varanasi", state: "Uttar Pradesh", totalCoins: 1980, totalScans: 167, avgRating: 4.7, nationalRank: 4, trend: -1, isCurrentUser: false },
  { id: "5", name: "Mohammed Irfan", district: "Hyderabad", state: "Telangana", totalCoins: 1750, totalScans: 145, avgRating: 4.6, nationalRank: 5, trend: 3, isCurrentUser: false },
  { id: "6", name: "Deepa Nair", district: "Thrissur", state: "Kerala", totalCoins: 1560, totalScans: 134, avgRating: 4.8, nationalRank: 6, trend: -2, isCurrentUser: false },
  { id: "7", name: "Vikram Yadav", district: "Jaipur", state: "Rajasthan", totalCoins: 1380, totalScans: 121, avgRating: 4.5, nationalRank: 7, trend: 0, isCurrentUser: false },
  { id: "8", name: "Sunita Devi", district: "Patna", state: "Bihar", totalCoins: 1240, totalScans: 112, avgRating: 4.7, nationalRank: 8, trend: 1, isCurrentUser: true },
  { id: "9", name: "Ramesh Gowda", district: "Mysuru", state: "Karnataka", totalCoins: 1120, totalScans: 98, avgRating: 4.4, nationalRank: 9, trend: -1, isCurrentUser: false },
  { id: "10", name: "Kavitha Reddy", district: "Vijayawada", state: "Andhra Pradesh", totalCoins: 980, totalScans: 87, avgRating: 4.6, nationalRank: 10, trend: 2, isCurrentUser: false },
]

type FilterType = "national" | "state" | "district"

function getAvatarColor(name: string): string {
  const firstLetter = name.charAt(0).toUpperCase()
  if (firstLetter >= "A" && firstLetter <= "F") return "bg-red-500"
  if (firstLetter >= "G" && firstLetter <= "L") return "bg-blue-500"
  if (firstLetter >= "M" && firstLetter <= "R") return "bg-green-500"
  return "bg-purple-500"
}

function getBadge(entry: LeaderboardEntry): { badge: string | null; className: string } {
  if (entry.totalCoins >= 1000) {
    return { badge: "💎 Elite", className: "bg-purple-100 text-purple-700" }
  }
  if (entry.totalScans >= 100) {
    return { badge: "🌟 Community Hero", className: "bg-yellow-100 text-yellow-700" }
  }
  if (entry.totalScans >= 50) {
    return { badge: "⭐ Field Expert", className: "bg-blue-100 text-blue-700" }
  }
  if (entry.nationalRank <= 10) {
    return { badge: "🏆 Top Performer", className: "bg-green-100 text-green-700" }
  }
  return { badge: null, className: "" }
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          className={`w-4 h-4 ${
            star <= Math.round(rating)
              ? "fill-[#f59e0b] text-[#f59e0b]"
              : "fill-[#e5e7eb] text-[#e5e7eb]"
          }`}
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
      <span className="ml-1 text-sm font-medium text-gray-700">{rating}</span>
    </div>
  )
}

function TrendIndicator({ trend }: { trend: number }) {
  if (trend > 0) {
    return <span className="text-green-600 font-semibold">↑{trend}</span>
  }
  if (trend < 0) {
    return <span className="text-red-600 font-semibold">↓{Math.abs(trend)}</span>
  }
  return <span className="text-gray-400 font-semibold">→</span>
}

function RankDisplay({ rank }: { rank: number }) {
  if (rank === 1) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-2xl">🥇</span>
        <span className="font-bold text-gray-900">1</span>
      </div>
    )
  }
  if (rank === 2) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-2xl">🥈</span>
        <span className="font-bold text-gray-900">2</span>
      </div>
    )
  }
  if (rank === 3) {
    return (
      <div className="flex items-center gap-1">
        <span className="text-2xl">🥉</span>
        <span className="font-bold text-gray-900">3</span>
      </div>
    )
  }
  return <span className="text-gray-500 font-medium">{rank}</span>
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="h-12 bg-gray-100 animate-pulse" />
        {[...Array(5)].map((_, i) => (
          <div key={i} className="h-16 bg-gray-50 animate-pulse border-t border-gray-100" />
        ))}
      </div>
    </div>
  )
}

export default function LeaderboardPage() {
  const [filter, setFilter] = useState<FilterType>("national")
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading] = useState(false)

  const itemsPerPage = 20

  const filteredData = useMemo(() => {
    let data = [...MOCK_LEADERBOARD]
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      data = data.filter(
        (entry) =>
          entry.name.toLowerCase().includes(query) ||
          entry.district.toLowerCase().includes(query) ||
          entry.state.toLowerCase().includes(query)
      )
    }

    return data
  }, [searchQuery])

  const currentUserEntry = filteredData.find((entry) => entry.isCurrentUser)
  const otherEntries = filteredData.filter((entry) => !entry.isCurrentUser)
  
  const totalPages = Math.ceil(otherEntries.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedEntries = otherEntries.slice(startIndex, startIndex + itemsPerPage)

  const displayEntries = currentUserEntry
    ? [currentUserEntry, ...paginatedEntries.filter((e) => e.id !== currentUserEntry.id)]
    : paginatedEntries

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-gray-900">Leaderboard</h1>
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
            </span>
            <span className="text-sm font-semibold text-green-600">LIVE</span>
          </div>
          <p className="text-sm text-gray-500">Updated every 5 minutes</p>
        </div>
      </div>

      <div className="sticky top-0 z-10 bg-white shadow-sm border-b border-gray-200 rounded-t-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 p-4">
          <div className="flex items-center gap-1">
            <button
              onClick={() => {
                setFilter("national")
                setCurrentPage(1)
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filter === "national"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🇮🇳 National
            </button>
            <button
              onClick={() => {
                setFilter("state")
                setCurrentPage(1)
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filter === "state"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              📍 Your State
            </button>
            <button
              onClick={() => {
                setFilter("district")
                setCurrentPage(1)
              }}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                filter === "district"
                  ? "text-green-600 border-b-2 border-green-600"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              🏘️ Your District
            </button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search volunteer name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1)
              }}
              className="pl-10 pr-4 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent text-sm w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rank</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Volunteer</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Location</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Scans</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Coins</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Badge</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {displayEntries.map((entry) => {
                const badge = getBadge(entry)
                const isTop3 = entry.nationalRank <= 3
                const borderClass = entry.nationalRank === 1
                  ? "border-l-4 border-l-yellow-400"
                  : entry.nationalRank === 2
                  ? "border-l-4 border-l-gray-400"
                  : entry.nationalRank === 3
                  ? "border-l-4 border-l-amber-600"
                  : ""

                return (
                  <tr
                    key={entry.id}
                    className={`${entry.isCurrentUser ? "bg-green-50" : ""} ${borderClass} hover:bg-gray-50 transition-colors`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RankDisplay rank={entry.nationalRank} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 rounded-full ${getAvatarColor(entry.name)} flex items-center justify-center text-white font-semibold text-sm`}
                        >
                          {entry.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-900">{entry.name}</span>
                        {entry.isCurrentUser && (
                          <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                            You
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="text-sm text-gray-900">{entry.district}</p>
                        <p className="text-xs text-gray-500">{entry.state}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <p className="font-semibold text-gray-900">{entry.totalScans}</p>
                        <p className="text-xs text-gray-500">scans</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-1">
                        <span>🪙</span>
                        <span className="font-semibold text-[#f59e0b]">{entry.totalCoins}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StarRating rating={entry.avgRating} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {badge.badge && (
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}>
                          {badge.badge}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <TrendIndicator trend={entry.trend} />
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        <div className="md:hidden space-y-4 p-4">
          {displayEntries.map((entry) => {
            const badge = getBadge(entry)
            return (
              <div
                key={entry.id}
                className={`bg-white rounded-2xl border p-4 ${
                  entry.isCurrentUser ? "border-2 border-green-600" : "border-gray-100"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <RankDisplay rank={entry.nationalRank} />
                    <div
                      className={`w-12 h-12 rounded-full ${getAvatarColor(entry.name)} flex items-center justify-center text-white font-semibold`}
                    >
                      {entry.name.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <TrendIndicator trend={entry.trend} />
                </div>

                <div className="mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-gray-900">{entry.name}</h3>
                    {entry.isCurrentUser && (
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        You
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500">
                    {entry.district}, {entry.state}
                  </p>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    Scans: <span className="font-semibold text-gray-900">{entry.totalScans}</span>
                  </span>
                  <span className="text-gray-600">
                    Coins: <span className="font-semibold text-[#f59e0b]">🪙 {entry.totalCoins}</span>
                  </span>
                  <span className="text-gray-600">
                    Rating: <span className="font-semibold text-gray-900">{entry.avgRating}★</span>
                  </span>
                </div>

                {badge.badge && (
                  <div className="mt-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${badge.className}`}>
                      {badge.badge}
                    </span>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, otherEntries.length)} of {otherEntries.length}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = i + 1
              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                    currentPage === pageNum
                      ? "bg-green-600 text-white"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  {pageNum}
                </button>
              )
            })}
            {totalPages > 5 && <span className="px-2 text-gray-400">...</span>}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
