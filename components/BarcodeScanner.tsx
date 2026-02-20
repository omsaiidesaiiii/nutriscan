'use client'

import { useState } from 'react'
import { Search, Barcode, Loader2, AlertCircle } from 'lucide-react'

interface BarcodeScannerProps {
  onProductFound: (product: {
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }) => void
}

export default function BarcodeScanner({ onProductFound }: BarcodeScannerProps) {
  const [barcode, setBarcode] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSearch = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!barcode) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/barcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ barcode }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Product not found')
      }

      onProductFound(data)
      setBarcode('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Barcode className="h-4 w-4 text-zinc-400" />
          </div>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Enter barcode number..."
            className="block w-full pl-11 pr-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50/50 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !barcode}
          className="flex justify-center items-center rounded-xl bg-emerald-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50 transition-all active:scale-[0.98]"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <div className="flex items-center space-x-2">
              <Search className="h-4 w-4" />
              <span>Search</span>
            </div>
          )}
        </button>
      </form>

      {error && (
        <div className="flex items-center p-3 text-sm text-amber-600 border border-amber-200/50 rounded-xl bg-amber-50">
          <AlertCircle className="flex-shrink-0 h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
