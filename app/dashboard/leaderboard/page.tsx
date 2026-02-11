"use client"

import { useState, useEffect, useMemo } from "react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { LeaderboardTable, LeaderboardSkeleton } from "@/components/dashboard/leaderboard-table"
import type { Volunteer } from "@/components/dashboard/leaderboard-table"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"

const MOCK_VOLUNTEERS: Volunteer[] = [
  { id: "v1", name: "Anita Deshmukh", district: "Pune", state: "MH", totalCoins: 2840, totalScans: 187, avgRating: 4.9, rank: 1 },
  { id: "v2", name: "Suresh Patil", district: "Nashik", state: "MH", totalCoins: 2510, totalScans: 162, avgRating: 4.8, rank: 2 },
  { id: "v3", name: "Priya Sharma", district: "Indore", state: "MP", totalCoins: 2230, totalScans: 145, avgRating: 4.7, rank: 3 },
  { id: "v4", name: "Vikram Singh", district: "Jaipur", state: "RJ", totalCoins: 2010, totalScans: 134, avgRating: 4.9, rank: 4 },
  { id: "v5", name: "Lakshmi Reddy", district: "Hyderabad", state: "TS", totalCoins: 1980, totalScans: 128, avgRating: 4.6, rank: 5 },
  { id: "v6", name: "Ramesh Yadav", district: "Lucknow", state: "UP", totalCoins: 1750, totalScans: 115, avgRating: 4.5, rank: 6 },
  { id: "v7", name: "Deepa Nair", district: "Kochi", state: "KL", totalCoins: 1620, totalScans: 108, avgRating: 4.7, rank: 7 },
  { id: "v8", name: "Arjun Mehta", district: "Ahmedabad", state: "GJ", totalCoins: 1480, totalScans: 96, avgRating: 4.4, rank: 8 },
  { id: "v9", name: "Kavita Joshi", district: "Bhopal", state: "MP", totalCoins: 1350, totalScans: 91, avgRating: 4.6, rank: 9 },
  { id: "mock-id", name: "Ravi Kumar", district: "Nagpur", state: "MH", totalCoins: 1240, totalScans: 87, avgRating: 4.8, rank: 10 },
  { id: "v10", name: "Meena Kumari", district: "Patna", state: "BR", totalCoins: 1180, totalScans: 82, avgRating: 4.3, rank: 11 },
  { id: "v11", name: "Sanjay Gupta", district: "Varanasi", state: "UP", totalCoins: 1050, totalScans: 74, avgRating: 4.5, rank: 12 },
  { id: "v12", name: "Anjali Verma", district: "Raipur", state: "CG", totalCoins: 980, totalScans: 68, avgRating: 4.2, rank: 13 },
  { id: "v13", name: "Mohan Das", district: "Kolkata", state: "WB", totalCoins: 870, totalScans: 61, avgRating: 4.4, rank: 14 },
  { id: "v14", name: "Sunita Patel", district: "Surat", state: "GJ", totalCoins: 760, totalScans: 55, avgRating: 4.1, rank: 15 },
  { id: "v15", name: "Rajesh Tiwari", district: "Kanpur", state: "UP", totalCoins: 680, totalScans: 48, avgRating: 4.3, rank: 16 },
  { id: "v16", name: "Pooja Chauhan", district: "Dehradun", state: "UK", totalCoins: 590, totalScans: 42, avgRating: 4.0, rank: 17 },
  { id: "v17", name: "Kiran Rao", district: "Bengaluru", state: "KA", totalCoins: 520, totalScans: 38, avgRating: 4.6, rank: 18 },
  { id: "v18", name: "Amit Sharma", district: "Delhi", state: "DL", totalCoins: 440, totalScans: 32, avgRating: 4.2, rank: 19 },
  { id: "v19", name: "Geeta Devi", district: "Ranchi", state: "JH", totalCoins: 380, totalScans: 28, avgRating: 4.0, rank: 20 },
]

const PER_PAGE = 20

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/leaderboard?filter=national&page=1')
// Expected response: { volunteers: Array<{ id, name, district, state, totalCoins, totalScans, avgRating, rank }>, total: number }
function useLeaderboard() {
  const [loading, setLoading] = useState(true)
  const [volunteers, setVolunteers] = useState<Volunteer[]>([])
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVolunteers(MOCK_VOLUNTEERS)
      setTotal(MOCK_VOLUNTEERS.length)
      setLoading(false)
    }, 600)
    return () => clearTimeout(timer)
  }, [])

  return { loading, volunteers, total }
}

export default function LeaderboardPage() {
  const { loading, volunteers, total } = useLeaderboard()
  const [filter, setFilter] = useState("national")
  const [search, setSearch] = useState("")
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    if (!search.trim()) return volunteers
    return volunteers.filter((v) =>
      v.name.toLowerCase().includes(search.toLowerCase())
    )
  }, [volunteers, search])

  const paginated = useMemo(() => {
    const start = (page - 1) * PER_PAGE
    return filtered.slice(start, start + PER_PAGE)
  }, [filtered, page])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-xl font-bold text-neutral-900">Leaderboard</h1>
        <p className="text-sm text-neutral-500">See how you rank against other volunteers</p>
      </div>

      {/* Filters row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList className="bg-neutral-100">
            <TabsTrigger value="national" className="data-[state=active]:bg-white data-[state=active]:text-neutral-900">National</TabsTrigger>
            <TabsTrigger value="state" className="data-[state=active]:bg-white data-[state=active]:text-neutral-900">State</TabsTrigger>
            <TabsTrigger value="district" className="data-[state=active]:bg-white data-[state=active]:text-neutral-900">District</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
          <Input
            placeholder="Search volunteer..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1) }}
            className="border-neutral-200 bg-white pl-9"
          />
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <LeaderboardSkeleton />
      ) : (
        <LeaderboardTable volunteers={paginated} currentUserId="mock-id" />
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-neutral-500">
            Showing {(page - 1) * PER_PAGE + 1}-{Math.min(page * PER_PAGE, filtered.length)} of {filtered.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
              <span className="sr-only">Previous page</span>
            </Button>
            <span className="text-sm font-medium text-neutral-700">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 bg-transparent"
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="h-4 w-4" />
              <span className="sr-only">Next page</span>
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
