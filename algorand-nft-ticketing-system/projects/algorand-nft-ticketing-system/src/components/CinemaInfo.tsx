// src/components/CinemaInfo.tsx
import { calculateMovieEndTime, isMovieLive } from '../utils/movieDuration'

const CinemaInfo = () => {
  // 🎬 Movie Config (can later come from API / blockchain)
  const cinemaName = 'MasterPass Cinema Beirut'
  const movieTitle = 'Web3: The Blockchain Era'
  const startTime = '20:00' // 8:00 PM
  const durationMinutes = 120
  const location = 'Downtown Beirut'

  // ✅ Calculations using utils
  const endTime = calculateMovieEndTime(startTime, durationMinutes)
  const isLive = isMovieLive(startTime, durationMinutes)

  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h2 className="text-4xl font-extrabold mb-6 text-red-500 drop-shadow-lg">
        🎥 Now Showing
      </h2>

      <div className="bg-white shadow-2xl rounded-3xl p-8 space-y-5 text-gray-900">

        <div className="flex justify-between border-b pb-3">
          <span className="font-semibold text-gray-600">🎬 Cinema</span>
          <span className="font-bold">{cinemaName}</span>
        </div>

        <div className="flex justify-between border-b pb-3">
          <span className="font-semibold text-gray-600">🎞️ Movie</span>
          <span className="font-bold">{movieTitle}</span>
        </div>

        <div className="flex justify-between border-b pb-3">
          <span className="font-semibold text-gray-600">⏰ Showtime</span>
          <span className="font-bold">Today at {startTime}</span>
        </div>

        <div className="flex justify-between border-b pb-3">
          <span className="font-semibold text-gray-600">⏱️ Ends At</span>
          <span className="font-bold">{endTime}</span>
        </div>

        <div className="flex justify-between border-b pb-3">
          <span className="font-semibold text-gray-600">📍 Location</span>
          <span className="font-bold">{location}</span>
        </div>

        {/* ✅ LIVE STATUS */}
        <div className="pt-4">
          {isLive ? (
            <span className="px-4 py-2 bg-green-600 text-white rounded-full font-semibold shadow-md">
              🟢 Movie Is Live Now
            </span>
          ) : (
            <span className="px-4 py-2 bg-red-600 text-white rounded-full font-semibold shadow-md">
              🔴 Movie Not Started Yet
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default CinemaInfo
