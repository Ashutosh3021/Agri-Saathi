"use client"

interface RatingDisplayProps {
  rating: number
  totalRatings?: number
  size?: 'sm' | 'md' | 'lg'
  showBreakdown?: boolean
}

const BREAKDOWN_PERCENTAGES = [67, 23, 7, 2, 1]

function StarIcon({ filled, half }: { filled: boolean; half?: boolean }) {
  if (half) {
    return (
      <span className="relative inline-block">
        <span className="text-[#e5e7eb]">☆</span>
        <span className="absolute left-0 top-0 overflow-hidden w-1/2 text-[#f59e0b]">
          ★
        </span>
      </span>
    )
  }
  return (
    <span className={filled ? "text-[#f59e0b]" : "text-[#e5e7eb]"}>
      {filled ? "★" : "☆"}
    </span>
  )
}

export default function RatingDisplay({ 
  rating, 
  totalRatings, 
  size = 'md',
  showBreakdown = false 
}: RatingDisplayProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  const sizeClasses = {
    sm: 'text-sm inline-flex items-center gap-1',
    md: 'text-xl',
    lg: 'text-4xl'
  }

  const starSizeClasses = {
    sm: 'text-sm',
    md: 'text-2xl',
    lg: 'text-5xl'
  }

  if (size === 'sm') {
    return (
      <span className={sizeClasses[size]}>
        <span className="text-[#f59e0b] font-bold">★</span>
        <span className="font-semibold text-gray-700">{rating.toFixed(1)}</span>
        {totalRatings !== undefined && (
          <span className="text-xs text-gray-400">({totalRatings})</span>
        )}
      </span>
    )
  }

  return (
    <div className={`${sizeClasses[size]} flex flex-col items-center`}>
      <div className={`flex items-center gap-1 ${starSizeClasses[size]}`}>
        {[0, 1, 2, 3, 4].map((index) => {
          const isFilled = index < fullStars
          const isHalf = index === fullStars && hasHalfStar
          return (
            <span key={index}>
              <StarIcon filled={isFilled} half={isHalf} />
            </span>
          )
        })}
      </div>
      
      {size === 'md' && totalRatings !== undefined && (
        <p className="text-sm text-gray-500 mt-1">({totalRatings} ratings)</p>
      )}

      {size === 'lg' && showBreakdown && (
        <div className="mt-6 w-full max-w-xs space-y-2">
          {BREAKDOWN_PERCENTAGES.map((percentage, index) => {
            const starCount = 5 - index
            return (
              <div key={starCount} className="flex items-center gap-2 text-sm">
                <span className="w-6 font-medium text-gray-600">{starCount}★</span>
                <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-green-600 transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                <span className="w-10 text-right text-gray-600 font-medium">{percentage}%</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
