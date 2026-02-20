import Link from 'next/link'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-white text-gray-900 px-4">
      <div className="text-center max-w-2xl">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
          AI Smart Nutrition Tracker
        </h1>
        <p className="text-xl text-gray-600 mb-10 leading-relaxed">
          The next generation of personalized health. Track your nutrition with the power of artificial intelligence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10 transition-all shadow-lg hover:shadow-indigo-500/25"
          >
            Get Started
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center px-8 py-3 border border-gray-300 text-base font-medium rounded-xl text-indigo-600 bg-white hover:bg-gray-50 md:py-4 md:text-lg md:px-10 transition-all border-2"
          >
            Log In
          </Link>
        </div>
      </div>
      
      <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl">
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 italic">
          "The best way to track what you eat."
        </div>
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 italic">
          "AI-powered insights at your fingertips."
        </div>
        <div className="p-6 rounded-2xl bg-gray-50 border border-gray-100 italic">
          "Secure and private by design."
        </div>
      </div>
    </div>
  )
}
