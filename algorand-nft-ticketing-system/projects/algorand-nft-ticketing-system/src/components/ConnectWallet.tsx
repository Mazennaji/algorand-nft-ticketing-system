import { useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'
import { useState } from 'react'

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { wallets, activeAddress } = useWallet()
  const [loading, setLoading] = useState(false)

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

  return (
    <dialog id="connect_wallet_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <form
        method="dialog"
        className="
          modal-box
          bg-[#0a0a0a]
          text-white
          border border-red-700
          shadow-[0_0_40px_rgba(255,0,0,0.45)]
          rounded-2xl
          p-6
        "
      >
        {/* Title */}
        <h3 className="text-3xl font-extrabold text-red-500 text-center mb-6">🎬 Connect Your Wallet</h3>

        {/* Connected Address */}
        {activeAddress && (
          <div className="bg-red-900/25 p-4 rounded-xl border border-red-700 text-center mb-6 shadow-inner">
            <p className="text-sm text-red-300">Connected Address</p>
            <p className="font-mono text-white text-lg mt-1 break-all">{activeAddress}</p>
          </div>
        )}

        {/* Wallet List */}
        <div className="flex flex-col gap-4">
          {!activeAddress &&
            wallets?.map((wallet) => (
              <button
                key={wallet.id}
                onClick={(e) => {
                  e.preventDefault()
                  setLoading(true)
                  wallet.connect().finally(() => setLoading(false))
                }}
                className="
                  flex items-center gap-4
                  bg-red-900/30
                  hover:bg-red-700/40
                  transition duration-200
                  p-4 rounded-xl
                  border border-red-600
                  shadow-md
                "
              >
                {!isKmd(wallet) && (
                  <img src={wallet.metadata.icon} className="w-10 h-10 object-contain" alt={`${wallet.metadata.name} icon`} />
                )}
                <span className="text-lg font-medium">{isKmd(wallet) ? 'LocalNet Wallet' : wallet.metadata.name}</span>

                {loading && <span className="loading loading-spinner text-red-400 ml-auto"></span>}
              </button>
            ))}
        </div>

        {/* Footer Actions */}
        <div className="modal-action mt-8 flex justify-between">
          <button
            className="
              btn btn-outline btn-sm
              border-red-500 text-red-300
              hover:bg-red-900/40 hover:text-white
            "
            onClick={closeModal}
          >
            Close
          </button>

          {activeAddress && (
            <button
              className="
                btn btn-error btn-sm
                bg-red-700 hover:bg-red-800
                border-red-600 text-white
              "
              onClick={(e) => {
                e.preventDefault()
                const activeWallet = wallets.find((w) => w.isActive)
                activeWallet?.disconnect()
              }}
            >
              Logout
            </button>
          )}
        </div>
      </form>
    </dialog>
  )
}

export default ConnectWallet
