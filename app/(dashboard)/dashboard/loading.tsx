import { Utensils, Flame, Zap, Shield } from 'lucide-react'

export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50/50">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 h-16" />

      <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm animate-pulse">
              <div className="h-4 w-16 bg-gray-100 rounded mb-2" />
              <div className="h-8 w-24 bg-gray-200 rounded" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-white h-[350px] rounded-[2rem] border border-gray-100 animate-pulse" />
            <div className="bg-white h-[200px] rounded-3xl border border-gray-100 animate-pulse" />
          </div>
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-white h-[100px] rounded-[2rem] border border-gray-100 animate-pulse" />
            <div className="bg-white h-[400px] rounded-3xl border border-gray-100 animate-pulse" />
          </div>
        </div>
      </main>
    </div>
  )
}
