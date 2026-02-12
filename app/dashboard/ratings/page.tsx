"use client"

import { useState, useMemo } from "react"
import { CheckCircle } from "lucide-react"
import RatingDisplay from "@/components/dashboard/RatingDisplay"

interface RatingItem {
  id: string
  rating: number
  farmerLocation: string
  scanType: string
  date: string
  feedback: string | null
}

const MOCK_RATINGS: RatingItem[] = [
  { id: "1", rating: 5, farmerLocation: "Pune", scanType: "Drone scan", date: "2 days ago", feedback: "Very professional and helpful!" },
  { id: "2", rating: 4.5, farmerLocation: "Nashik", scanType: "WhatsApp scan", date: "4 days ago", feedback: null },
  { id: "3", rating: 5, farmerLocation: "Mumbai", scanType: "Soil reading", date: "1 week ago", feedback: "Great work, thank you!" },
  { id: "4", rating: 4, farmerLocation: "Satara", scanType: "Drone scan", date: "2 weeks ago", feedback: null },
  { id: "5", rating: 5, farmerLocation: "Kolhapur", scanType: "WhatsApp scan", date: "3 weeks ago", feedback: "Saved my crop!" },
]

type FilterType = 'all' | '5' | '4' | 'below3'

export default function RatingsPage() {
  const [filter, setFilter] = useState<FilterType>('all')

  const overallRating = 4.8
  const totalRatings = 89
  const thisMonthRatings = 12

  const filteredRatings = useMemo(() => {
    switch (filter) {
      case '5':
        return MOCK_RATINGS.filter(r => r.rating >= 5)
      case '4':
        return MOCK_RATINGS.filter(r => r.rating >= 4 && r.rating < 5)
      case 'below3':
        return MOCK_RATINGS.filter(r => r.rating < 3)
      default:
        return MOCK_RATINGS
    }
  }, [filter])

  const hasLowRatings = filter === 'below3' && filteredRatings.length === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">My Ratings</h1>
        <div className="flex items-center gap-4 bg-white rounded-xl px-4 py-2 shadow-sm border border-gray-100">
          <span className="text-sm text-gray-600">
            Overall: <span className="font-semibold text-[#f59e0b]">★ {overallRating}</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-600">
            Total: <span className="font-semibold">{totalRatings}</span>
          </span>
          <span className="text-gray-300">|</span>
          <span className="text-sm text-gray-600">
            This month: <span className="font-semibold">{thisMonthRatings}</span>
          </span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-100">
          <div className="flex items-center gap-1 px-6">
            {[
              { key: 'all', label: 'All' },
              { key: '5', label: '5★' },
              { key: '4', label: '4★' },
              { key: 'below3', label: 'Below 3★' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key as FilterType)}
                className={`px-4 py-3 text-sm font-medium transition-colors ${
                  filter === tab.key
                    ? "text-green-600 border-b-2 border-green-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6">
          {hasLowRatings ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No low ratings! Great work.</h3>
              <p className="text-gray-500">Keep up the excellent service.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredRatings.map((rating) => (
                <div
                  key={rating.id}
                  className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex-shrink-0">
                    <RatingDisplay rating={rating.rating} size="md" />
                  </div>

                  <div className="flex-1">
                    <p className="font-semibold text-gray-900">
                      Farmer from {rating.farmerLocation}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs font-semibold rounded-full">
                        {rating.scanType}
                      </span>
                      <span className="text-sm text-gray-500">{rating.date}</span>
                    </div>
                  </div>

                  {rating.feedback && (
                    <div className="sm:max-w-xs">
                      <p className="text-sm text-gray-600 italic">
                        &ldquo;{rating.feedback}&rdquo;
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
