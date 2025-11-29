/**
 * Shared formatting utilities
 * Consolidates commonly used formatting functions to eliminate code duplication
 */

/**
 * Formats duration in minutes to a readable string
 * @param minutes - Duration in minutes
 * @returns Formatted duration string (e.g., "1h 30m", "45m", "2h")
 */
export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60

  if (hours === 0) {
    return `${mins}m`
  } else if (mins === 0) {
    return `${hours}h`
  } else {
    return `${hours}h ${mins}m`
  }
}

/**
 * Returns CSS classes for difficulty level styling
 * @param difficulty - The difficulty level string
 * @returns CSS class string for styling
 */
export const getDifficultyClass = (difficulty: string): string => {
  const classes = {
    'Beginner': 'bg-green-100 text-green-800',
    'Intermediate': 'bg-yellow-100 text-yellow-800',
    'Advanced': 'bg-red-100 text-red-800'
  }
  return classes[difficulty as keyof typeof classes] || 'bg-gray-100 text-gray-800'
}

/**
 * Formats date to a readable string
 * @param date - Date to format (can be Date object, string, or number)
 * @returns Formatted date string (e.g., "December 15, 2024")
 */
export const formatDate = (date: Date | string | number): string => {
  try {
    // Handle different date formats
    let dateObj: Date

    if (date instanceof Date) {
      dateObj = date
    } else if (typeof date === 'string' || typeof date === 'number') {
      dateObj = new Date(date)
    } else {
      return 'Invalid date'
    }

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided:', date)
      return 'Invalid date'
    }

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error, 'Input:', date)
    return 'Invalid date'
  }
}

/**
 * Formats date to a shorter format
 * @param date - Date to format (can be Date object, string, or number)
 * @returns Short date string (e.g., "Dec 15, 2024")
 */
export const formatDateShort = (date: Date | string | number): string => {
  try {
    // Handle different date formats
    let dateObj: Date

    if (date instanceof Date) {
      dateObj = date
    } else if (typeof date === 'string' || typeof date === 'number') {
      dateObj = new Date(date)
    } else {
      return 'Invalid date'
    }

    // Check if the date is valid
    if (isNaN(dateObj.getTime())) {
      console.warn('Invalid date provided:', date)
      return 'Invalid date'
    }

    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  } catch (error) {
    console.error('Error formatting date:', error, 'Input:', date)
    return 'Invalid date'
  }
}

/**
 * Formats time in seconds to MM:SS format
 * @param seconds - Time in seconds
 * @returns Formatted time string (e.g., "05:30", "12:45")
 */
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
}

/**
 * Formats percentage with optional decimal places
 * @param value - Value between 0 and 100
 * @param decimals - Number of decimal places (default: 0)
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals: number = 0): string => {
  return `${value.toFixed(decimals)}%`
}