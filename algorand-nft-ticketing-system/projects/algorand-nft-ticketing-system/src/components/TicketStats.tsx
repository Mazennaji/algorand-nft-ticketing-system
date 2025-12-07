const TicketStats = () => {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">
        📊 Ticketing Statistics
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-indigo-600 text-white p-6 rounded-2xl text-center">
          <p className="text-2xl font-bold">128</p>
          <p className="text-sm opacity-80">Tickets Minted</p>
        </div>

        <div className="bg-purple-600 text-white p-6 rounded-2xl text-center">
          <p className="text-2xl font-bold">54</p>
          <p className="text-sm opacity-80">Active Wallets</p>
        </div>

        <div className="bg-pink-600 text-white p-6 rounded-2xl text-center">
          <p className="text-2xl font-bold">12</p>
          <p className="text-sm opacity-80">Movies Listed</p>
        </div>
      </div>
    </div>
  )
}

export default TicketStats
