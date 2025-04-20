import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { formatDistanceToNow, isValid } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Helper function to safely format time distance
export const formatTimeDistance = (dateString: string) => {
  try {
    const date = new Date(dateString)
    if (!isValid(date)) {
      return 'Invalid date'
    }
    return formatDistanceToNow(date, { addSuffix: true })
  } catch (error) {
    console.error('Error formatting date:', dateString, error)
    return 'Date unavailable'
  }
}
