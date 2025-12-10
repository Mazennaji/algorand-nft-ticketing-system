import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { sha512_256 } from 'js-sha512'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface NFTMintInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const NFTmint = ({ openModal, setModalState }: NFTMintInterface) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [metadataUrl, setMetadataUrl] = useState<string>('')

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })

  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const handleMintNFT = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!transactionSigner || !activeAddress) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      return
    }

    if (!metadataUrl) {
      enqueueSnackbar('Please paste your metadata URL', { variant: 'warning' })
      return
    }

    try {
      setLoading(true)
      enqueueSnackbar('Minting your MasterPass NFT...', { variant: 'info' })

      const metadataHash = new Uint8Array(
        Buffer.from(sha512_256.digest(metadataUrl))
      )

      const createNFTResult = await algorand.send.assetCreate({
        sender: activeAddress,
        signer: transactionSigner,
        total: 1n,
        decimals: 0,
        assetName: 'MasterPass Ticket',
        unitName: 'MTK',
        url: metadataUrl,
        metadataHash,
        defaultFrozen: false,
      })

      enqueueSnackbar(
        `MasterPass NFT Minted! TX: ${createNFTResult.txIds[0]}`,
        { variant: 'success' }
      )

      setMetadataUrl('')
      setModalState(false)
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Failed to mint MasterPass NFT', { variant: 'error' })
    }

    setLoading(false)
  }

  return (
    <dialog id="nft_mint_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <div className="modal-box bg-gradient-to-br from-black via-slate-900 to-black text-white border border-red-600 rounded-3xl shadow-2xl max-w-md p-0 overflow-hidden">

        {/* 🎬 HEADER */}
        <div className="p-6 text-center border-b border-red-500/30">
          <div className="text-4xl mb-2">🎫</div>
          <h3 className="text-2xl font-extrabold tracking-widest text-red-500">
            MINT YOUR TICKET
          </h3>
          <p className="text-gray-400 text-sm mt-1">
            Create your on-chain cinema NFT
          </p>
        </div>

        {/* 🎞️ BODY */}
        <div className="p-6 space-y-6">

          {/* Input */}
          <div>
            <label className="text-sm font-semibold text-gray-300 block mb-2">
              IPFS Metadata URL
            </label>

            <input
              type="text"
              placeholder="https://ipfs.io/ipfs/..."
              className="
                input input-bordered w-full
                bg-white text-black
                border-gray-300
                placeholder-gray-500
                focus:border-red-400 focus:ring-2 focus:ring-red-200
              "
              value={metadataUrl}
              onChange={(e) => setMetadataUrl(e.target.value)}
            />
          </div>

          {/* Info Box */}
          <div className="bg-slate-800 rounded-lg p-4 border border-gray-700 text-sm text-gray-300">
            🎟️ This NFT represents your official cinema ticket on the Algorand blockchain.
          </div>

          {/* 🎬 BUTTONS */}
          <div className="flex justify-end gap-4 pt-4">

            <button
              type="button"
              className="btn bg-gray-800 text-gray-300 border border-gray-600 hover:bg-gray-700"
              onClick={() => setModalState(false)}
            >
              Close
            </button>

            <button
              type="button"
              disabled={!metadataUrl || loading}
              onClick={handleMintNFT}
              className={`
                btn px-8 font-bold
                ${
                  metadataUrl
                    ? 'bg-red-500 text-white hover:bg-red-600'
                    : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }
              `}
            >
              {loading ? <span className="loading loading-spinner" /> : 'Mint NFT'}
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

export default NFTmint
