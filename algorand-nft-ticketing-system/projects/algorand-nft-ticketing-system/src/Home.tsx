// src/components/Home.tsx
import { useWallet } from '@txnlab/use-wallet-react'
import React, { useState } from 'react'

import ConnectWallet from './components/ConnectWallet'
import NFTmint from './components/NFTmint'
import Tokenmint from './components/Tokenmint'
import Transact from './components/Transact'

import MyTickets from './components/MyTickets'
import TicketStats from './components/TicketStats'
import VerifyTicket from './components/VerifyTicket'

interface HomeProps { }

const Home: React.FC<HomeProps> = () => {
  const [openWalletModal, setOpenWalletModal] = useState(false)
  const [openDemoModal, setOpenDemoModal] = useState(false)
  const [openMintModal, setOpenMintModal] = useState(false)
  const [openTokenModal, setOpenTokenModal] = useState(false)

  const [showMyTickets, setShowMyTickets] = useState(false)
  const [showVerify, setShowVerify] = useState(false)
  const [showCinemaInfo, setShowCinemaInfo] = useState(false)
  const [showStats, setShowStats] = useState(false)

  const { activeAddress } = useWallet()

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white">

      {/* ================= HERO CINEMA ================= */}
      <div className="relative py-28 px-6 text-center bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-red-700/40 via-black to-black border-b border-red-800">
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,0,0,0.04)_1px,transparent_1px),linear-gradient(180deg,rgba(255,0,0,0.04)_1px,transparent_1px)] bg-[size:60px_60px] opacity-30"></div>

        <div className="relative z-10 max-w-4xl mx-auto">
          <h1 className="text-6xl font-extrabold tracking-widest mb-4 text-red-500 drop-shadow-[0_0_20px_rgba(255,0,0,0.6)]">
            🎬 MASTERPASS CINEMA
          </h1>

          <p className="text-gray-400 mb-8 uppercase tracking-wider">
            algorand-nft-ticketing-system
          </p>

          <p className="text-gray-300 max-w-2xl mx-auto mb-14 leading-relaxed">
            A premium Web3 cinema ticketing platform. Mint blockchain-powered movie tickets,
            verify ownership instantly, and enter the future of decentralized cinema.
          </p>

          {/* ================= MAIN CTA ================= */}
          <div className="flex flex-col items-center gap-6 max-w-md mx-auto">

            <button
              className="btn btn-error btn-lg w-full uppercase tracking-wider shadow-2xl"
              onClick={() => setOpenWalletModal(true)}
            >
              🎟️ Connect Wallet
            </button>

            {activeAddress && (
              <button
                className="btn btn-warning btn-lg w-full uppercase tracking-wider shadow-2xl"
                onClick={() => setOpenDemoModal(true)}
              >
                💳 Send Payment
              </button>
            )}

            {activeAddress && (
              <button
                className="btn btn-info btn-lg w-full uppercase tracking-wider shadow-2xl"
                onClick={() => setOpenMintModal(true)}
              >
                🎫 Mint NFT Ticket
              </button>
            )}

            {activeAddress && (
              <button
                className="btn btn-accent btn-lg w-full uppercase tracking-wider shadow-2xl"
                onClick={() => setOpenTokenModal(true)}
              >
                🪙 Mint Cinema Token
              </button>
            )}

            {activeAddress && (
              <button
                className="btn btn-success btn-lg w-full uppercase tracking-wider shadow-2xl"
                onClick={() => setShowMyTickets(!showMyTickets)}
              >
                🎟️ View My Tickets
              </button>
            )}
          </div>

          {/* ================= CINEMA CONTROL PANEL ================= */}
          <div className="mt-16 flex flex-wrap gap-6 justify-center">
            <button
              className="btn btn-outline btn-error"
              onClick={() => setShowVerify(!showVerify)}
            >
              ✅ Verify Ticket
            </button>

            <button
              className="btn btn-outline btn-warning"
              onClick={() => setShowCinemaInfo(!showCinemaInfo)}
            >
              🎬 Cinema Info
            </button>

            <button
              className="btn btn-outline btn-info"
              onClick={() => setShowStats(!showStats)}
            >
              📊 Ticket Stats
            </button>
          </div>
        </div>
      </div>

      {/* ================= NOW SHOWING (TOGGLED ✅) ================= */}
      {showCinemaInfo && (
        <div className="py-28 px-6 max-w-6xl mx-auto animate-fade-in">
          <h2 className="text-4xl font-extrabold text-white mb-12 text-center flex items-center justify-center gap-3">
            🎥 Now Showing
          </h2>

          <div className="bg-white rounded-3xl shadow-2xl p-10 max-w-4xl mx-auto">
            <div className="space-y-6 text-lg text-gray-900">

              <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-4">
                <span className="font-semibold text-gray-600">🎬 Cinema</span>
                <span className="font-bold text-black">
                  MasterPass Cinema Beirut
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-4">
                <span className="font-semibold text-gray-600">🎞️ Movie</span>
                <span className="font-bold text-black">
                  Web3: The Blockchain Era
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between border-b pb-4">
                <span className="font-semibold text-gray-600">⏰ Showtime</span>
                <span className="font-bold text-black">
                  Today at 8:00 PM
                </span>
              </div>

              <div className="flex flex-col sm:flex-row sm:justify-between">
                <span className="font-semibold text-gray-600">📍 Location</span>
                <span className="font-bold text-black">
                  Downtown Beirut
                </span>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* ================= FEATURE SCREENS ================= */}
      <div className="py-24 px-6 space-y-24 max-w-6xl mx-auto">
        {showMyTickets && <MyTickets />}
        {showVerify && <VerifyTicket />}
        {showStats && <TicketStats />}
      </div>

      {/* ================= MODALS ================= */}
      <ConnectWallet openModal={openWalletModal} closeModal={() => setOpenWalletModal(false)} />
      <Transact openModal={openDemoModal} setModalState={setOpenDemoModal} />
      <NFTmint openModal={openMintModal} setModalState={setOpenMintModal} />
      <Tokenmint openModal={openTokenModal} setModalState={setOpenTokenModal} />
    </div>
  )
}

export default Home
