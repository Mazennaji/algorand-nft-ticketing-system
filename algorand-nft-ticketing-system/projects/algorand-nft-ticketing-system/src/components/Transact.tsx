import { algo, AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface TransactInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const Transact = ({ openModal, setModalState }: TransactInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [receiverAddress, setReceiverAddress] = useState<string>('')

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })

  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const handleSubmitAlgo = async () => {
    setLoading(true)

    if (!transactionSigner || !activeAddress) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      setLoading(false)
      return
    }

    try {
      enqueueSnackbar('Sending payment...', { variant: 'info' })

      const result = await algorand.send.payment({
        signer: transactionSigner,
        sender: activeAddress,
        receiver: receiverAddress,
        amount: algo(1),
      })

      enqueueSnackbar(`Payment sent! TX: ${result.txIds[0]}`, { variant: 'success' })
      setReceiverAddress('')
      setModalState(false)
    } catch (e) {
      enqueueSnackbar('Failed to send transaction', { variant: 'error' })
    }

    setLoading(false)
  }

  return (
    <dialog id="transact_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <div className="modal-box bg-gradient-to-br from-black via-slate-900 to-black text-white border border-yellow-500 rounded-3xl shadow-2xl max-w-md p-0 overflow-hidden">

        {/* 🎬 HEADER */}
        <div className="p-6 text-center border-b border-yellow-500/30">
          <div className="text-4xl mb-2">🎟️</div>
          <h3 className="text-2xl font-bold tracking-widest text-yellow-400">
            CINEMA PAYMENT
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Send 1 ALGO to confirm your ticket
          </p>
        </div>

        {/* 🎞️ BODY */}
        <div className="p-6 space-y-6">

          {/* Amount Card */}
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl p-4 text-black text-center shadow-lg">
            <p className="text-sm font-semibold">Amount</p>
            <p className="text-3xl font-extrabold tracking-wider">1 ALGO</p>
            <p className="text-xs mt-1">Network Fee ≈ 0.001 ALGO</p>
          </div>

          {/* Input */}
          <div>
            <label className="text-sm font-semibold text-gray-300 block mb-2">
              Receiver Wallet Address
            </label>
            <input
              type="text"
              data-test-id="receiver-address"
              placeholder="Paste Algorand address here (58 characters)"
              className="
                input input-bordered w-full
                bg-white text-black
                border-gray-300
                placeholder-gray-500
                focus:border-yellow-400 focus:ring-2 focus:ring-yellow-200
              "
              value={receiverAddress}
              onChange={(e) => setReceiverAddress(e.target.value)}
            />

            {receiverAddress.length > 0 && receiverAddress.length !== 58 && (
              <p className="text-xs text-red-400 mt-2">
                Algorand addresses must be 58 characters.
              </p>
            )}
          </div>

          {/* Info */}
          <div className="bg-slate-800 rounded-lg p-4 border border-gray-700 text-sm text-gray-300">
            🎬 This confirms your on-chain cinema payment.
            After success, your ticket can be minted.
          </div>

          {/* 🎬 BUTTONS (RIGHT SIDE FIXED ✅) */}
          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              className="btn bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700"
              onClick={() => setModalState(false)}
            >
              Close
            </button>

            <button
              data-test-id="send-algo"
              onClick={handleSubmitAlgo}
              disabled={receiverAddress.length !== 58 || loading}
              className={`
                btn
                px-8 font-bold
                ${
                  receiverAddress.length === 58
                    ? 'bg-yellow-400 text-black hover:bg-yellow-500'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {loading ? <span className="loading loading-spinner" /> : 'Send 1 ALGO'}
            </button>

          </div>
        </div>
      </div>

      {/* BACKDROP */}
      <form method="dialog" className="modal-backdrop">
        <button onClick={() => setModalState(false)}>close</button>
      </form>
    </dialog>
  )
}

export default Transact
