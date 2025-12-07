import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { sha512_256 } from 'js-sha512'
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

  const handleMintNFT = async () => {
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
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Failed to mint MasterPass NFT', { variant: 'error' })
    }

    setLoading(false)
  }

  return (
    <dialog
      id="nft_mint_modal"
      className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}
    >
      <form method="dialog" className="modal-box">
        <h3 className="font-bold text-lg">Mint Your MasterPass NFT 🎟️</h3>
        <br />

        <input
          type="text"
          placeholder="Paste your IPFS Metadata URL"
          className="input input-bordered w-full"
          value={metadataUrl}
          onChange={(e) => setMetadataUrl(e.target.value)}
        />

        <div className="modal-action">
          <button className="btn" onClick={() => setModalState(!openModal)}>
            Close
          </button>

          <button
            className={`btn btn-primary ${metadataUrl ? '' : 'btn-disabled'}`}
            onClick={handleMintNFT}
          >
            {loading ? <span className="loading loading-spinner" /> : 'Mint MasterPass'}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default NFTmint
