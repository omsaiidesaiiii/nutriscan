'use client'

import { useState, useRef } from 'react'
import { Camera, Upload, Loader2, AlertCircle, Image as ImageIcon } from 'lucide-react'

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
        setError('Please upload an image file')
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
        throw new Error(data.error || 'Failed to analyze image')
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
    <div className="space-y-4">
      <div className="flex flex-col items-center justify-center space-y-4">
        {preview ? (
          <div className="relative group w-full aspect-video max-w-sm rounded-3xl overflow-hidden shadow-lg border-2 border-indigo-100">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={() => {
                  setPreview(null)
                  if (fileInputRef.current) fileInputRef.current.value = ''
                }}
                className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-xl border border-white/30 text-sm font-bold"
              >
                Change Image
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-full max-w-sm aspect-video border-2 border-dashed border-gray-200 rounded-3xl flex flex-col items-center justify-center text-gray-400 hover:border-indigo-400 hover:text-indigo-600 transition-all bg-gray-50/50"
          >
            <Camera className="h-10 w-10 mb-2" />
            <span className="text-sm font-bold uppercase tracking-widest">Upload Food Photo</span>
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
            className="w-full max-w-sm bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl py-4 font-bold text-lg shadow-xl shadow-indigo-600/20 active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-6 w-6 animate-spin" />
                <span>AI Analyzing...</span>
              </>
            ) : (
              <>
                <Upload className="h-5 w-5" />
                <span>Estimate Macros</span>
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center p-4 text-sm text-red-800 border border-red-100 rounded-2xl bg-red-50">
          <AlertCircle className="flex-shrink-0 inline h-4 w-4 mr-3" />
          <span className="font-medium">{error}</span>
        </div>
      )}
    </div>
  )
}
