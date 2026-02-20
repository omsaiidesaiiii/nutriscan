'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, Loader2, AlertCircle, Image as ImageIcon, Zap, Target } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ImageUploadMealProps {
  onProductFound: (product: {
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }) => void
}

export default function ImageUploadMeal({ onProductFound }: ImageUploadMealProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('Format invalid. Please initialize image packet.')
        return
      }
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
      setError(null)
    }
  }

  const analyzeImage = async () => {
    if (!preview) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: preview }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Vision analysis failed')
      }

      onProductFound({
        name: data.food_name,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat
      })
      setPreview(null)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center space-y-6">
        {preview ? (
          <div className="relative group w-full aspect-video max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl border-2 border-emerald-50">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-emerald-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button
                onClick={() => {
                  setPreview(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="bg-white text-emerald-950 px-8 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-105 active:scale-95"
              >
                Clear Visual
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-lg aspect-video border-2 border-dashed border-emerald-100 rounded-[2.5rem] flex flex-col items-center justify-center text-emerald-950/20 hover:border-emerald-500 hover:text-emerald-600 transition-all bg-emerald-50/20 group hover:shadow-2xl hover:shadow-emerald-500/5"
          >
            <div className="p-5 bg-white rounded-3xl mb-4 shadow-sm group-hover:scale-110 transition-transform">
               <Camera className="h-10 w-10" />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Capture Physical Sample</span>
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          className="hidden"
        />

        {preview && (
          <button
            onClick={analyzeImage}
            disabled={isLoading}
            className="w-full max-w-lg h-20 bg-emerald-950 text-white rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-900/20 hover:bg-emerald-900 transition-all flex items-center justify-center space-x-4 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
                <span>AI Vision Active...</span>
              </>
            ) : (
              <>
                <Zap className="h-5 w-5 text-emerald-400 fill-emerald-400" />
                <span>Initiate Analysis</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center p-6 text-xs font-bold uppercase tracking-tight text-rose-500 border border-rose-100 rounded-[1.5rem] bg-rose-50 animate-in">
          <AlertCircle className="flex-shrink-0 inline h-5 w-5 mr-3" />
          <span>Error Log: {error}</span>
        </div>
      )}
    </div>
  )
}
