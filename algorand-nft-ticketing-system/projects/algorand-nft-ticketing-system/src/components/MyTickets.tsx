import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useEffect, useState } from 'react'

interface TicketAsset {
  assetId: number
  name?: string
  unitName?: string
  url?: string
}

const MyTickets = () => {
  const { activeAddress, wallet } = useWallet()
  const { enqueueSnackbar } = useSnackbar()

  const [tickets, setTickets] = useState<TicketAsset[]>([])
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    const fetchMyTickets = async () => {
      if (!wallet || !activeAddress) return

      try {
        setLoading(true)
        enqueueSnackbar('Loading your NFT tickets...', { variant: 'info' })

        // ✅ Get all assets held by wallet
        const assets = await wallet.getAssets()

        // ✅ Filter only MasterPass NFTs
        const masterPassTickets = assets.filter((asset: any) => {
          return (
            asset.amount === 1 &&
            asset['asset-name']?.includes('MasterPass')
          )
        })

        const formattedTickets = masterPassTickets.map((asset: any) => ({
          assetId: asset['asset-id'],
          name: asset['asset-name'],
          unitName: asset['unit-name'],
          url: asset.url,
        }))

        setTickets(formattedTickets)
      } catch (error) {
        console.error(error)
        enqueueSnackbar('Failed to load tickets', { variant: 'error' })
      }

      setLoading(false)
    }

    fetchMyTickets()
  }, [wallet, activeAddress])

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-center">
        🎟️ My MasterPass Tickets
      </h2>

      {loading && (
        <div className="flex justify-center mt-6">
          <span className="loading loading-spinner loading-lg" />
        </div>
      )}

      {!loading && tickets.length === 0 && (
        <div className="text-center text-gray-500 mt-10">
          You don’t own any MasterPass tickets yet.
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {tickets.map((ticket) => (
          <div
            key={ticket.assetId}
            className="bg-gradient-to-br from-purple-600 to-indigo-700 text-white rounded-2xl p-6 shadow-xl"
          >
            <h3 className="text-xl font-bold mb-2">
              {ticket.name || 'MasterPass Ticket'}
            </h3>

            <p className="text-sm opacity-80 mb-1">
              Unit: {ticket.unitName}
            </p>

            <p className="text-sm opacity-80 mb-2">
              Asset ID: {ticket.assetId}
            </p>

            {ticket.url && (
              <a
                href={ticket.url}
                target="_blank"
                rel="noreferrer"
                className="underline text-sm"
              >
                View Metadata
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyTickets
