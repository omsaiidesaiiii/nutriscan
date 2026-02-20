'use client'

import { useState, useRef } from 'react'
import { Camera, Loader2, AlertCircle, Sparkles } from 'lucide-react'
import Image from 'next/image'

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
        setError('Please select a valid image file.')
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
        throw new Error(data.error || 'Analysis failed')
      }

      onProductFound({
        name: data.food_name,
        calories: data.calories,
        protein: data.protein,
        carbs: data.carbs,
        fat: data.fat
      })
      setPreview(null)    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        {preview ? (
          <div className="relative group w-full aspect-video max-w-lg rounded-2xl overflow-hidden border border-zinc-200">
            <Image src={preview} alt="Preview" fill unoptimized className="object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
              <button
                onClick={() => {
                  setPreview(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="bg-white text-zinc-900 px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm hover:bg-zinc-50 transition-all"
              >
                Remove image
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-lg aspect-video border-2 border-dashed border-zinc-200 rounded-2xl flex flex-col items-center justify-center text-zinc-300 hover:border-emerald-400 hover:text-emerald-500 transition-all bg-zinc-50/50 group"
          >
            <div className="p-4 bg-white rounded-xl mb-3 border border-zinc-100 group-hover:border-emerald-100 transition-colors">
               <Camera className="h-8 w-8" />
            </div>
            <span className="text-sm font-medium">Upload a photo of your meal</span>
            <span className="text-xs text-zinc-400 mt-1">Click to browse or drag and drop</span>
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
            className="w-full max-w-lg flex justify-center rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Analyzing...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Sparkles className="h-4 w-4" />
                <span>Analyze with AI</span>
              </div>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center p-3 text-sm text-amber-600 border border-amber-200/50 rounded-xl bg-amber-50">
          <AlertCircle className="shrink-0 h-4 w-4 mr-2" />
          <span>{error}</span>
        </div>
      )}
    </div>
  )
}
