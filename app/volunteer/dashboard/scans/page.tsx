'use client'

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Camera, Calendar, Star, Coins, Filter, ChevronDown } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

// BACKEND_CONNECTION: Replace with fetch('/api/volunteer/scans')
const mockScans = [
  { 
    id: 1, 
    type: "Drone", 
    location: "Patna, Bihar", 
    date: "2024-01-15T10:30:00",
    coins: 80, 
    rating: 5,
    result: "Rice Blast Disease Detected",
    farmerName: "Ram Kumar"
  },
  { 
    id: 2, 
    type: "WhatsApp", 
    location: "Muzaffarpur, Bihar", 
    date: "2024-01-15T08:15:00",
    coins: 40, 
    rating: 4,
    result: "Healthy Crop - No Issues",
    farmerName: "Sita Devi"
  },
  { 
    id: 3, 
    type: "Soil", 
    location: "Gaya, Bihar", 
    date: "2024-01-14T16:45:00",
    coins: 60, 
    rating: null,
    result: "Nitrogen Deficiency - Add Urea",
    farmerName: "Mohan Singh"
  },
  { 
    id: 4, 
    type: "Drone", 
    location: "Bhagalpur, Bihar", 
    date: "2024-01-13T11:20:00",
    coins: 80, 
    rating: 5,
    result: "Healthy Crop - Optimal Growth",
    farmerName: "Geeta Kumari"
  },
  { 
    id: 5, 
    type: "WhatsApp", 
    location: "Darbhanga, Bihar", 
    date: "2024-01-12T09:00:00",
    coins: 40, 
    rating: 5,
    result: "Leaf Spot Disease - Use Fungicide",
    farmerName: "Ramesh Yadav"
  },
  { 
    id: 6, 
    type: "Soil", 
    location: "Aurangabad, Bihar", 
    date: "2024-01-11T14:30:00",
    coins: 60, 
    rating: 4,
    result: "pH Low - Add Lime",
    farmerName: "Suresh Prasad"
  },
]

const filters = [
  { id: 'all', label: 'All Scans' },
  { id: 'drone', label: 'Drone' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'soil', label: 'Soil' },
]

const typeColors: Record<string, string> = {
  Drone: "bg-blue-100 text-blue-700 hover:bg-blue-200",
  WhatsApp: "bg-green-100 text-green-700 hover:bg-green-200",
  Soil: "bg-amber-100 text-amber-700 hover:bg-amber-200"
}

export default function ScansPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState('all')
  const [dateRange, setDateRange] = useState('all')
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

  const filteredScans = mockScans.filter(scan => {
    if (activeFilter === 'all') return true
    return scan.type.toLowerCase() === activeFilter
  })

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffHours < 24) {
      return diffHours === 0 ? 'Just now' : `${diffHours} hours ago`
    }
    return date.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Scans</h1>
        <p className="text-gray-600 mt-1">View all your completed scans and reports</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {/* Type Filter */}
        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeFilter === filter.id
                  ? "bg-amber-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-2 ml-auto">
          <Calendar className="w-4 h-4 text-gray-400" />
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-gray-100 border-none rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-amber-500"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">{mockScans.length}</p>
          <p className="text-sm text-gray-500">Total Scans</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-2xl font-bold text-amber-600">
            {mockScans.reduce((acc, scan) => acc + scan.coins, 0)}
          </p>
          <p className="text-sm text-gray-500">Coins Earned</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">
            {(mockScans.filter(s => s.rating).reduce((acc, s) => acc + (s.rating || 0), 0) / 
              mockScans.filter(s => s.rating).length).toFixed(1)}★
          </p>
          <p className="text-sm text-gray-500">Avg Rating</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <p className="text-2xl font-bold text-gray-900">
            {mockScans.filter(s => s.rating === null).length}
          </p>
          <p className="text-sm text-gray-500">Pending Ratings</p>
        </div>
      </div>

      {/* Scans List */}
      <div className="space-y-4">
        {filteredScans.map((scan) => (
          <div 
            key={scan.id} 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              {/* Left: Type & Info */}
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <Badge className={cn("font-medium", typeColors[scan.type])}>
                    {scan.type}
                  </Badge>
                  <span className="text-sm text-gray-500">{formatDate(scan.date)}</span>
                </div>
                
                <h3 className="font-semibold text-gray-900 mb-1">{scan.result}</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Farmer: {scan.farmerName} • {scan.location}
                </p>
              </div>

              {/* Right: Coins & Rating */}
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 text-lg font-bold text-amber-600">
                  <Coins className="w-5 h-5" />
                  +{scan.coins}
                </div>
                
                {scan.rating ? (
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={cn(
                          "w-4 h-4", 
                          i < scan.rating! ? "text-amber-500 fill-current" : "text-gray-300"
                        )} 
                      />
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
                    Awaiting rating
                  </span>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <Button variant="outline" size="sm" className="text-amber-600 border-amber-200 hover:bg-amber-50">
                View Report
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                Share
              </Button>
            </div>
          </div>
        ))}
      </div>

      {filteredScans.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
          <Camera className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No scans found</h3>
          <p className="text-gray-500">Try adjusting your filters or start a new scan</p>
        </div>
      )}
    </div>
  )
}
