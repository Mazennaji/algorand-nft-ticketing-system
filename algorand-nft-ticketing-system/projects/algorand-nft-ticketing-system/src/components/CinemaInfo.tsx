const CinemaInfo = () => {
  return (
    <div className="p-6 max-w-3xl mx-auto text-center">
      <h2 className="text-3xl font-bold mb-4">🎥 Now Showing</h2>

      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-3">
        <p><strong>Cinema:</strong> MasterPass Cinema Beirut</p>
        <p><strong>Movie:</strong> Web3: The Blockchain Era</p>
        <p><strong>Showtime:</strong> Today at 8:00 PM</p>
        <p><strong>Location:</strong> Downtown Beirut</p>
      </div>
    </div>
  )
}

export default CinemaInfo
