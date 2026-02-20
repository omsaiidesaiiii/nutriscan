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
        throw new Error(data.error || 'Failed to find product')
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
      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Barcode className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Enter Barcode Number..."
            className="block w-full pl-10 pr-3 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !barcode}
          className="inline-flex items-center px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 disabled:opacity-50 transition-all shadow-md active:scale-95"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
          ) : (
            <Search className="h-5 w-5 mr-2" />
          )}
          Find
        </button>
      </form>

      {error && (
        <div className="flex items-center p-4 text-sm text-red-800 border border-red-100 rounded-xl bg-red-50">
          <AlertCircle className="flex-shrink-0 inline h-4 w-4 mr-3" />
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  )
}
