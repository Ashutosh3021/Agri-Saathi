"use client"

import { useState, useEffect } from "react"
import { CheckCircle, Loader2 } from "lucide-react"

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  volunteerName: string
  scanDate: string
  scanId: string
}

const RATING_LABELS: Record<number, string> = {
  1: "Not helpful",
  2: "Slightly helpful",
  3: "Somewhat helpful",
  4: "Very helpful",
  5: "Excellent! Made a real difference"
}

function getAvatarColor(name: string): string {
  const firstLetter = name.charAt(0).toUpperCase()
  if (firstLetter >= "A" && firstLetter <= "F") return "bg-red-500"
  if (firstLetter >= "G" && firstLetter <= "L") return "bg-blue-500"
  if (firstLetter >= "M" && firstLetter <= "R") return "bg-green-500"
  return "bg-purple-500"
}

export default function RatingModal({ 
  isOpen, 
  onClose, 
  volunteerName, 
  scanDate,
  scanId 
}: RatingModalProps) {
  const [selectedRating, setSelectedRating] = useState<number>(0)
  const [hoverRating, setHoverRating] = useState<number>(0)
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setSelectedRating(0)
      setHoverRating(0)
      setFeedback("")
      setLoading(false)
      setSuccess(false)
    }
  }, [isOpen])

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        onClose()
      }, 2000)
      return () => clearTimeout(timer)
    }
  }, [success, onClose])

  const handleSubmit = async () => {
    if (selectedRating === 0) return

    setLoading(true)

    // BACKEND_CONNECTION: POST /api/scans/{scanId}/rate with { rating, feedback }
    await new Promise(resolve => setTimeout(resolve, 1000))

    setLoading(false)
    setSuccess(true)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl p-8 max-w-md mx-auto shadow-2xl w-full relative">
        {success ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Thank you for rating!</h3>
            <p className="text-gray-600">Your feedback helps improve our volunteer network.</p>
          </div>
        ) : (
          <>
            <h2 className="text-xl font-bold text-gray-900 text-center mb-6">
              How helpful was your volunteer?
            </h2>

            <div className="flex items-center justify-center gap-3 mb-6">
              <div
                className={`w-12 h-12 rounded-full ${getAvatarColor(volunteerName)} flex items-center justify-center text-white font-semibold`}
              >
                {volunteerName.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{volunteerName}</p>
                <p className="text-sm text-gray-500">Scan on {scanDate}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => {
                const isFilled = (hoverRating || selectedRating) >= star
                return (
                  <button
                    key={star}
                    onClick={() => setSelectedRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className={`text-4xl transition-all duration-200 ${
                      isFilled 
                        ? "text-[#f59e0b] scale-110" 
                        : "text-[#e5e7eb] hover:text-[#f59e0b]/50"
                    } ${
                      selectedRating === star ? "animate-bounce" : ""
                    }`}
                    style={{ fontSize: '40px' }}
                  >
                    ★
                  </button>
                )
              })}
            </div>

            {selectedRating > 0 && (
              <p className="text-center text-sm font-medium text-green-600 mb-6">
                {RATING_LABELS[selectedRating]}
              </p>
            )}

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Tell us more (optional)"
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none mb-6 text-sm"
            />

            <button
              onClick={handleSubmit}
              disabled={selectedRating === 0 || loading}
              className="w-full bg-[#16a34a] hover:bg-[#15803d] disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-xl px-6 py-3 font-semibold transition-colors flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Rating"
              )}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
