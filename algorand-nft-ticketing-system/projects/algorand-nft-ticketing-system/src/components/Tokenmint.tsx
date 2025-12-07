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

  const handleMintToken = async () => {
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

      enqueueSnackbar(
        `Token created successfully! TX: ${createResult.txIds[0]}`,
        { variant: 'success' }
      )

      // Reset form
      setAssetName('')
      setUnitName('')
      setTotalSupply('')
      setDecimals('0')
    } catch (error) {
      console.error(error)
      enqueueSnackbar('Failed to create token', { variant: 'error' })
    }

    setLoading(false)
  }

  return (
    <dialog
      id="token_mint_modal"
      className={`modal ${openModal ? 'modal-open' : ''} bg-slate-200`}
    >
      <form method="dialog" className="modal-box space-y-4">
        <h3 className="font-bold text-lg text-center">
          Mint Fungible Token (ASA)
        </h3>

        {/* Asset Name */}
        <input
          type="text"
          placeholder="Asset Name (e.g. MasterPass Token)"
          className="input input-bordered w-full"
          value={assetName}
          onChange={(e) => setAssetName(e.target.value)}
        />

        {/* Unit Name */}
        <input
          type="text"
          placeholder="Unit Name (e.g. MPT)"
          className="input input-bordered w-full"
          value={unitName}
          onChange={(e) => setUnitName(e.target.value)}
        />

        {/* Total Supply */}
        <input
          type="number"
          placeholder="Total Supply (whole number)"
          className="input input-bordered w-full"
          value={totalSupply}
          onChange={(e) => setTotalSupply(e.target.value)}
        />

        {/* Decimals */}
        <input
          type="number"
          placeholder="Decimals (0 for whole tokens)"
          className="input input-bordered w-full"
          value={decimals}
          onChange={(e) => setDecimals(e.target.value)}
        />

        {/* Buttons */}
        <div className="modal-action">
          <button className="btn" onClick={() => setModalState(false)}>
            Close
          </button>

          <button
            className={`btn btn-primary ${
              assetName && unitName && totalSupply ? '' : 'btn-disabled'
            }`}
            onClick={handleMintToken}
          >
            {loading ? (
              <span className="loading loading-spinner" />
            ) : (
              'Mint Token'
            )}
          </button>
        </div>
      </form>
    </dialog>
  )
}

export default Tokenmint
