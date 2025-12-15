'use client'

import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa'

interface RatingStarsProps {
  rating: number
  maxRating?: number
  size?: number
  interactive?: boolean
  onRatingChange?: (rating: number) => void
}

export default function RatingStars({
  rating,
  maxRating = 5,
  size = 20,
  interactive = false,
  onRatingChange,
}: RatingStarsProps) {
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0)

  const handleClick = (newRating: number) => {
    if (interactive && onRatingChange) {
      onRatingChange(newRating)
    }
  }

  return (
    <div className="flex items-center gap-1">
      {[...Array(fullStars)].map((_, i) => (
        <button
          key={`full-${i}`}
          type="button"
          onClick={() => handleClick(i + 1)}
          disabled={!interactive}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
        >
          <FaStar className="text-yellow-400" size={size} />
        </button>
      ))}
      {hasHalfStar && (
        <button
          type="button"
          onClick={() => handleClick(fullStars + 1)}
          disabled={!interactive}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
        >
          <FaStarHalfAlt className="text-yellow-400" size={size} />
        </button>
      )}
      {[...Array(emptyStars)].map((_, i) => (
        <button
          key={`empty-${i}`}
          type="button"
          onClick={() => handleClick(fullStars + (hasHalfStar ? 2 : 1) + i)}
          disabled={!interactive}
          className={interactive ? 'cursor-pointer hover:scale-110 transition-transform' : ''}
        >
          <FaRegStar className="text-gray-300" size={size} />
        </button>
      ))}
      <span className="ml-2 text-sm text-gray-600">{rating.toFixed(1)}</span>
    </div>
  )
}




