// src/components/Tokenmint.tsx
import { AlgorandClient } from '@algorandfoundation/algokit-utils'
import { useWallet } from '@txnlab/use-wallet-react'
import { useSnackbar } from 'notistack'
import { useState } from 'react'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

interface TokenMintInterface {
  openModal: boolean
  setModalState: (value: boolean) => void
}

const Tokenmint = ({ openModal, setModalState }: TokenMintInterface) => {
  const [loading, setLoading] = useState<boolean>(false)

  const [assetName, setAssetName] = useState<string>('')
  const [unitName, setUnitName] = useState<string>('')
  const [totalSupply, setTotalSupply] = useState<string>('')
  const [decimals, setDecimals] = useState<string>('0')

  const algodConfig = getAlgodConfigFromViteEnvironment()
  const algorand = AlgorandClient.fromConfig({ algodConfig })

  const { enqueueSnackbar } = useSnackbar()
  const { transactionSigner, activeAddress } = useWallet()

  const handleMintToken = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()

    if (!transactionSigner || !activeAddress) {
      enqueueSnackbar('Please connect wallet first', { variant: 'warning' })
      return
    }

    if (!assetName || !unitName || !totalSupply) {
      enqueueSnackbar('Please fill in all fields', { variant: 'warning' })
      return
    }

    try {
      setLoading(true)
      enqueueSnackbar('Creating your token...', { variant: 'info' })

      const onChainTotal = BigInt(totalSupply)
      const decimalsBig = BigInt(decimals)

      const createResult = await algorand.send.assetCreate({
        sender: activeAddress,
        signer: transactionSigner,
        total: onChainTotal,
        decimals: Number(decimalsBig),
        assetName,
        unitName,
        defaultFrozen: false,
      })

      enqueueSnackbar(`Token created successfully! TX: ${createResult.txIds[0]}`, { variant: 'success' })

      setAssetName('')
      setUnitName('')
      setTotalSupply('')
      setDecimals('0')
      setModalState(false)
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Failed to create token', { variant: 'error' })
    }

    setLoading(false)
  }

  return (
    <dialog id="token_mint_modal" className={`modal ${openModal ? 'modal-open' : ''}`}>
      <div className="modal-box bg-gradient-to-br from-black via-slate-900 to-black text-white border border-yellow-500 rounded-3xl shadow-2xl max-w-md p-0 overflow-hidden">
        {/* 🎬 HEADER */}
        <div className="p-6 text-center border-b border-yellow-400/30">
          <div className="text-4xl mb-2">🪙</div>
          <h3 className="text-2xl font-extrabold tracking-widest text-yellow-400">MINT CINEMA TOKEN</h3>
          <p className="text-gray-400 text-sm mt-1">Create your own Algorand ASA token</p>
        </div>

        {/* 🎞️ BODY */}
        <div className="p-6 space-y-5">
          {/* Asset Name */}
          <input
            type="text"
            placeholder="Asset Name (e.g. MasterPass Token)"
            className="input input-bordered w-full bg-white text-black placeholder-gray-500"
            value={assetName}
            onChange={(e) => setAssetName(e.target.value)}
          />

          {/* Unit Name */}
          <input
            type="text"
            placeholder="Unit Name (e.g. MPT)"
            className="input input-bordered w-full bg-white text-black placeholder-gray-500"
            value={unitName}
            onChange={(e) => setUnitName(e.target.value)}
          />

          {/* Total Supply */}
          <input
            type="number"
            placeholder="Total Supply"
            className="input input-bordered w-full bg-white text-black placeholder-gray-500"
            value={totalSupply}
            onChange={(e) => setTotalSupply(e.target.value)}
          />

          {/* Decimals */}
          <input
            type="number"
            placeholder="Decimals (0 recommended)"
            className="input input-bordered w-full bg-white text-black placeholder-gray-500"
            value={decimals}
            onChange={(e) => setDecimals(e.target.value)}
          />

          {/* Info */}
          <div className="bg-slate-800 rounded-lg p-4 text-sm text-gray-300 border border-gray-700">
            🪙 This token will be deployed as an Algorand Standard Asset (ASA)
          </div>

          {/* BUTTONS */}
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
              disabled={!assetName || !unitName || !totalSupply || loading}
              onClick={handleMintToken}
              className={`btn px-8 font-bold ${assetName && unitName && totalSupply
                  ? 'bg-yellow-500 text-black hover:bg-yellow-600'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                }`}
            >
              {loading ? <span className="loading loading-spinner" /> : 'Mint Token'}
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

export default Tokenmint
