interface TicketPreviewProps {
  movie: string
  seat: string
  time: string
  wallet: string
}

const TicketPreview = ({ movie, seat, time, wallet }: TicketPreviewProps) => {
  return (
    <div className="max-w-sm mx-auto bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl shadow-xl p-6">
      <h2 className="text-2xl font-bold mb-3">🎬 MasterPass Cinema</h2>

      <div className="space-y-2 text-sm">
        <p><span className="opacity-80">Movie:</span> {movie}</p>
        <p><span className="opacity-80">Seat:</span> {seat}</p>
        <p><span className="opacity-80">Showtime:</span> {time}</p>
        <p className="break-all text-xs mt-2">
          <span className="opacity-80">Wallet:</span> {wallet}
        </p>
      </div>

      <div className="mt-4 text-center text-xs opacity-80">
        🎟️ Powered by Algorand NFT Ticketing
      </div>
    </div>
  )
}

export default TicketPreview
