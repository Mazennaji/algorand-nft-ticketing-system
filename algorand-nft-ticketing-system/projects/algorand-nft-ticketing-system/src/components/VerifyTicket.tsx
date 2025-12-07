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

      // ✅ Fetch asset info from Algorand TestNet
      const asset = await algorand.client.algod.getAssetByID(Number(assetId)).do()

      enqueueSnackbar('Valid MasterPass Ticket ✅', { variant: 'success' })

      setTicketInfo({
        name: asset.params.name,
        unitName: asset.params['unit-name'],
        total: asset.params.total,
        creator: asset.params.creator,
        url: asset.params.url,
      })
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Invalid or non-existing ticket ❌', { variant: 'error' })
    }

    setLoading(false)
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h2 className="text-3xl font-bold text-center mb-6">
        🎟️ Verify MasterPass Ticket
      </h2>

      <div className="bg-white shadow-xl rounded-2xl p-6 space-y-4">

        <input
          type="number"
          placeholder="Enter Ticket Asset ID"
          className="input input-bordered w-full"
          value={assetId}
          onChange={(e) => setAssetId(e.target.value)}
        />

        <button
          className={`btn btn-primary w-full ${assetId ? '' : 'btn-disabled'}`}
          onClick={handleVerify}
        >
          {loading ? <span className="loading loading-spinner" /> : 'Verify Ticket'}
        </button>

        {/* ✅ Result UI */}
        {ticketInfo && (
          <div className="mt-4 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl p-4">
            <h3 className="font-bold text-lg mb-2">✅ Valid Ticket</h3>

            <p className="text-sm">Name: {ticketInfo.name}</p>
            <p className="text-sm">Unit: {ticketInfo.unitName}</p>
            <p className="text-sm">Total Supply: {ticketInfo.total}</p>
            <p className="text-xs mt-1 break-all">
              Creator: {ticketInfo.creator}
            </p>

            {ticketInfo.url && (
              <a
                href={ticketInfo.url}
                target="_blank"
                rel="noreferrer"
                className="underline text-sm mt-2 inline-block"
              >
                View Metadata
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default VerifyTicket
