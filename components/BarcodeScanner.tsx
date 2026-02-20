'use client'

import { useState } from 'react'
import { Search, Barcode, Loader2, AlertCircle, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'

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
        throw new Error(data.error || 'Identity not found in archive')
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
    <div className="space-y-6">
      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
            <Barcode className="h-5 w-5 text-emerald-950/20" />
          </div>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Scan ID or Enter Code..."
            className="block w-full pl-16 pr-6 h-20 bg-emerald-50/30 border border-emerald-50 rounded-[1.5rem] text-sm font-bold text-emerald-950 focus:bg-white focus:border-emerald-200 transition-all outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading || !barcode}
          className="h-20 px-10 bg-emerald-950 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/10 hover:bg-emerald-900 disabled:opacity-50 transition-all active:scale-[0.98] flex items-center justify-center space-x-3 group"
        >
          {isLoading ? (
            <Loader2 className="h-5 w-5 animate-spin text-emerald-400" />
          ) : (
            <>
              <Zap className="h-4 w-4 text-emerald-400 fill-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Decrypt Code</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <div className="flex items-center p-6 text-[10px] font-black uppercase tracking-widest text-rose-500 border border-rose-100 rounded-[1.5rem] bg-rose-50 animate-in italic">
          <AlertCircle className="flex-shrink-0 inline h-5 w-5 mr-3" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
