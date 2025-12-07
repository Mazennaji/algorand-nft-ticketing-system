interface HeroProps {
  onConnect: () => void
}

const Hero = ({ onConnect }: HeroProps) => {
  return (
    <div className="text-center space-y-6">
      <h1 className="text-4xl font-extrabold">
        Welcome to <span className="text-purple-600">MasterPass 🎟️</span>
      </h1>

      <p className="text-gray-600 max-w-md mx-auto">
        A modern Web3 cinema ticketing platform built on Algorand.
      </p>

      <button
        className="btn btn-primary btn-wide mx-auto shadow-md"
        onClick={onConnect}
      >
        Connect Wallet
      </button>
    </div>
  )
}

export default Hero
