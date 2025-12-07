// src/components/Home.tsx
import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'
import ConnectWallet from './components/ConnectWallet'
import NFTmint from './components/NFTmint'
import Tokenmint from './components/Tokenmint'; // ✅ NEW IMPORT
import Transact from './components/Transact'

interface HomeProps {}

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState<boolean>(false)
  const [openDemoModal, setOpenDemoModal] = useState<boolean>(false)
  const [openMintModal, setOpenMintModal] = useState<boolean>(false)      // ✅ NFT Modal
  const [openTokenModal, setOpenTokenModal] = useState<boolean>(false)   // ✅ TOKEN Modal
  const [claimed, setClaimed] = useState<boolean>(false)

  const { activeAddress } = useWallet()

  const toggleWalletModal = () => setOpenWalletModal(!openWalletModal)
  const toggleDemoModal = () => setOpenDemoModal(!openDemoModal)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 p-6">
      <div className="bg-white/95 shadow-2xl rounded-3xl p-10 w-full max-w-lg text-center">

        {/* ✅ Project Branding */}
        <h1 className="text-4xl font-extrabold text-gray-900">
          Welcome to <span className="text-purple-600">MasterPass 🎟️</span>
        </h1>

        <p className="text-sm text-gray-500 mt-1 mb-6">
          algorand-nft-ticketing-system
        </p>

        {/* ✅ Description */}
        <p className="text-gray-600 mb-8 leading-relaxed">
          A modern Web3 cinema ticketing platform built on Algorand.
          Connect your wallet, send a secure payment, and mint your movie ticket as an NFT.
        </p>

        {/* ✅ Buttons */}
        <div className="flex flex-col gap-4">

          {/* ✅ Connect Wallet */}
          <button
            data-test-id="connect-wallet"
            className="btn btn-primary btn-wide mx-auto shadow-md"
            onClick={toggleWalletModal}
          >
            Connect Wallet
          </button>

          {/* ✅ Send Payment */}
          {activeAddress && (
            <button
              data-test-id="transactions-demo"
              className="btn btn-accent btn-wide mx-auto shadow-md"
              onClick={toggleDemoModal}
            >
              Send Payment
            </button>
          )}

          {/* ✅ Mint NFT */}
          {activeAddress && (
            <button
              className="btn btn-info btn-wide mx-auto shadow-md"
              onClick={() => setOpenMintModal(true)}
            >
              Mint MasterPass NFT
            </button>
          )}

          {/* ✅ Mint Token (NEW) */}
          {activeAddress && (
            <button
              className="btn btn-warning btn-wide mx-auto shadow-md"
              onClick={() => setOpenTokenModal(true)}
            >
              Mint Fungible Token
            </button>
          )}

          {/* ✅ Local Claim UI */}
          <button
            className="btn btn-secondary btn-wide mx-auto shadow-md"
            onClick={() => setClaimed(true)}
          >
            Get Your MasterPass
          </button>

          {claimed && (
            <div className="mt-3 text-green-600 font-semibold text-lg">
              🎉 You've claimed your cinema ticket!
            </div>
          )}
        </div>

        {/* ✅ Modals */}
        <ConnectWallet openModal={openWalletModal} closeModal={toggleWalletModal} />
        <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
        <NFTmint openModal={openMintModal} setModalState={setOpenMintModal} />
        <Tokenmint openModal={openTokenModal} setModalState={setOpenTokenModal} /> {/* ✅ TOKEN MODAL */}
      </div>
    </div>
  )
}

export default Home
