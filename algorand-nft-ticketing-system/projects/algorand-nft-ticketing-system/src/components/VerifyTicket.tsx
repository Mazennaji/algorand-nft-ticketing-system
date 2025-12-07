import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

const VerifyTicket = () => {
  const [assetId, setAssetId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [ticketInfo, setTicketInfo] = useState<any>(null)

  const { enqueueSnackbar } = useSnackbar()

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })

  const handleVerify = async () => {
    if (!assetId) {
      enqueueSnackbar('Please enter a ticket Asset ID', { variant: 'warning' })
      return
    }

    try {
      setLoading(true)
      setTicketInfo(null)
      enqueueSnackbar('Verifying ticket on-chain...', { variant: 'info' })

      const asset = await algorand.client.algod.getAssetByID(Number(assetId)).do()

      enqueueSnackbar('Valid MasterPass Ticket ✅', { variant: 'success' })

      setTicketInfo({
        name: (asset as any).params.name,
        unitName: (asset as any).params['unit-name'],
        total: (asset as any).params.total,
        creator: (asset as any).params.creator,
        url: (asset as any).params.url,
      })
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Invalid or non-existing ticket ❌', { variant: 'error' })
    }

    setLoading(false)
  }

  return (
    <div className="py-24 px-6 max-w-4xl mx-auto">
      <h2 className="text-4xl font-extrabold text-white mb-12 text-center flex items-center justify-center gap-3">
        🎟️ Verify MasterPass Ticket
      </h2>

      <div className="bg-white rounded-3xl shadow-2xl p-10">

        {/* ✅ VISIBLE NUMBER INPUT */}
        <input
          type="number"
          placeholder="Enter Ticket Asset ID (example: 123456789)"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
          className="
            w-full
            p-4
            text-lg
            text-black
            border
            border-gray-300
            rounded-xl
            mb-6
            focus:outline-none
            focus:ring-2
            focus:ring-red-600
          "
        />

        {/* ✅ VERIFY BUTTON */}
        <button
          onClick={handleVerify}
          disabled={!assetId || loading}
          className="
            w-full
            bg-black
            text-white
            font-bold
            py-4
            rounded-xl
            hover:bg-gray-900
            transition
            disabled:opacity-50
          "
        >
          {loading ? 'Verifying...' : 'Verify Ticket'}
        </button>

        {/* ✅ RESULT UI */}
        {ticketInfo && (
          <div className="mt-8 bg-gradient-to-br from-green-600 to-emerald-700 text-white rounded-2xl p-6 shadow-xl">
            <h3 className="font-bold text-xl mb-3">✅ Valid MasterPass Ticket</h3>

            <p className="text-sm mb-1">🎫 Name: {ticketInfo.name}</p>
            <p className="text-sm mb-1">🔖 Unit: {ticketInfo.unitName}</p>
            <p className="text-sm mb-1">📦 Total Supply: {ticketInfo.total}</p>

            <p className="text-xs mt-2 break-all opacity-90">
              Creator: {ticketInfo.creator}
            </p>

            {ticketInfo.url && (
              <a
                href={ticketInfo.url}
                target="_blank"
                rel="noreferrer"
                className="underline text-sm mt-3 inline-block"
              >
                🔗 View Metadata
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyTicket
