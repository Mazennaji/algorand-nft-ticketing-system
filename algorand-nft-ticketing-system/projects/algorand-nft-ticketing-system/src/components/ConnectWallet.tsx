import { useWallet, Wallet, WalletId } from '@txnlab/use-wallet-react'

interface ConnectWalletInterface {
  openModal: boolean
  closeModal: () => void
}

const ConnectWallet = ({ openModal, closeModal }: ConnectWalletInterface) => {
  const { wallets, activeAddress } = useWallet()

  const isKmd = (wallet: Wallet) => wallet.id === WalletId.KMD

  return (
    <dialog id="connect_wallet_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <form
        method="dialog"
        className="modal-box bg-black border border-red-700 shadow-[0_0_30px_rgba(255,0,0,0.4)] rounded-2xl text-white"
      >
        <h3 className="text-3xl font-bold text-red-500 mb-6 text-center">
          🔗 Connect Wallet
        </h3>

        {activeAddress && (
          <div className="bg-red-900/20 p-4 rounded-xl border border-red-700 text-center mb-6">
            <p className="text-sm text-red-300">Connected Address</p>
            <p className="font-mono text-white text-lg break-all">{activeAddress}</p>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {!activeAddress &&
            wallets?.map((wallet) => (
              <button
                key={wallet.id}
                className="flex items-center gap-4 bg-red-900/30 hover:bg-red-800/40 transition p-4 rounded-xl border border-red-600"
                onClick={() => wallet.connect()}
              >
                <img src={wallet.metadata.icon} className="w-10" />
                <span className="text-lg">{wallet.metadata.name}</span>
              </button>
            ))}
        </div>

        <div className="modal-action mt-6 flex justify-between">
          <button className="btn btn-outline btn-sm border-red-500 text-red-300" onClick={closeModal}>
            Close
          </button>

          {activeAddress && (
            <button className="btn btn-error btn-sm" onClick={() => wallets.find((w) => w.isActive)?.disconnect()}>
              Logout
            </button>
          )}
        </div>
      </form>

    </dialog>
  )
}

export default ConnectWallet
