// src/utils/movieDuration.ts

/**
 * Calculates movie end time based on start time and duration (in minutes)
 */
export const calculateMovieEndTime = (
  startTime: string,
  durationMinutes: number
): string => {
  const [hours, minutes] = startTime.split(':').map(Number)

  const startDate = new Date()
  startDate.setHours(hours)
  startDate.setMinutes(minutes)

  const endDate = new Date(startDate.getTime() + durationMinutes * 60000)

  const endHours = String(endDate.getHours()).padStart(2, '0')
  const endMinutes = String(endDate.getMinutes()).padStart(2, '0')

  return `${endHours}:${endMinutes}`
}

/**
 * Calculates how long the user stayed in the movie
 */
export const calculateWatchDuration = (
  entryTime: Date,
  exitTime: Date
): number => {
  const diffMs = exitTime.getTime() - entryTime.getTime()
  return Math.floor(diffMs / 60000) // returns minutes
}

/**
 * Returns true if the movie is currently playing
 */
export const isMovieLive = (
  startTime: string,
  durationMinutes: number
): boolean => {
  const now = new Date()

  const [hours, minutes] = startTime.split(':').map(Number)
  const start = new Date()
  start.setHours(hours)
  start.setMinutes(minutes)

  const end = new Date(start.getTime() + durationMinutes * 60000)

  return now >= start && now <= end
}
