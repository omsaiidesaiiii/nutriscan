'use client'

import { addMeal } from '@/app/(dashboard)/dashboard/actions'
import { Utensils, Barcode as BarcodeIcon, Camera, Sparkles, Loader2, Search } from 'lucide-react'
import { useState } from 'react'
import BarcodeScanner from './BarcodeScanner'
import ImageUploadMeal from './ImageUploadMeal'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

export default function AddMealForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [entryMode, setEntryMode] = useState<'manual' | 'barcode' | 'image'>('manual')
  
  const [mealData, setMealData] = useState({
    food_name: '',
    quantity: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  })
  const [isEstimating, setIsEstimating] = useState(false)

  const handleEstimate = async () => {
    if (!mealData.food_name || !mealData.quantity) {
      toast.error('Please enter food name and quantity first')
      return
    }

    setIsEstimating(true)
    try {
      const response = await fetch('/api/estimate-macros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          food_name: mealData.food_name,
          quantity: mealData.quantity
        })
      })

      if (!response.ok) throw new Error('Failed to estimate')
      const data = await response.json()

      setMealData(prev => ({
        ...prev,
        calories: Math.round(data.calories).toString(),
        protein: Math.round(data.protein).toString(),
        carbs: Math.round(data.carbs).toString(),
        fat: Math.round(data.fat).toString()
      }))
      toast.success('Macros estimated!')
    } catch (error) {
      toast.error('AI estimation failed. Please enter manually.')
    } finally {
      setIsEstimating(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData()
    formData.append('food_name', mealData.food_name)
    formData.append('calories', mealData.calories)
    formData.append('protein', mealData.protein)
    formData.append('carbs', mealData.carbs)
    formData.append('fat', mealData.fat)

    const result = await addMeal(formData)
    setIsSubmitting(false)
    
    if (result.success) {
      toast.success('Meal logged successfully!')
      setMealData({
        food_name: '',
        quantity: '',
        calories: '',
        protein: '',
        carbs: '',
        fat: ''
      })
    } else if (result.error) {
      toast.error(result.error)
    }
  }

  const handleProductFound = (product: {
    name: string
    calories: number
    protein: number
    carbs: number
    fat: number
  }) => {
    setMealData({
      food_name: product.name,
      quantity: '1 serving',
      calories: Math.round(product.calories).toString(),
      protein: Math.round(product.protein).toString(),
      carbs: Math.round(product.carbs).toString(),
      fat: Math.round(product.fat).toString()
    })
    setEntryMode('manual')
    toast.success('Food details updated!')
  }

  return (
    <div className="card p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-lg font-semibold text-zinc-900">Log a Meal</h2>
          <p className="text-sm text-zinc-400 mt-0.5">Add your meals manually or use AI estimation.</p>
        </div>
        
        {/* Mode Tabs */}
        <div className="flex bg-zinc-50 p-1 rounded-xl border border-zinc-100">
          {[
            { key: 'manual', label: 'Manual', icon: Utensils },
            { key: 'barcode', label: 'Barcode', icon: BarcodeIcon },
            { key: 'image', label: 'Camera', icon: Camera },
          ].map((mode) => (
            <button
              key={mode.key}
              onClick={() => setEntryMode(mode.key as any)}
              className={cn(
                "flex items-center px-3.5 py-2 rounded-lg text-xs font-medium transition-all",
                entryMode === mode.key 
                  ? 'bg-white text-zinc-900 shadow-sm border border-zinc-100' 
                  : 'text-zinc-400 hover:text-zinc-700'
              )}
            >
              <mode.icon className="h-3.5 w-3.5 mr-1.5" />
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {entryMode === 'barcode' ? (
        <div className="animate-in">
          <p className="text-sm text-zinc-400 mb-4">Scan a barcode to auto-fill nutritional data.</p>
          <BarcodeScanner onProductFound={handleProductFound} />
        </div>
      ) : entryMode === 'image' ? (
        <div className="animate-in">
          <p className="text-sm text-zinc-400 mb-4">Upload a photo for AI-powered food detection.</p>
          <ImageUploadMeal onProductFound={handleProductFound} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div className="md:col-span-1 lg:col-span-2">
              <label htmlFor="food_name" className="block text-sm font-medium text-zinc-700 mb-1.5">
                Food name
              </label>
              <input
                id="food_name"
                value={mealData.food_name}
                onChange={(e) => setMealData({...mealData, food_name: e.target.value})}
                type="text"
                required
                className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="e.g. Grilled chicken breast"
              />
            </div>
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-zinc-700 mb-1.5">
                Quantity
              </label>
              <input
                id="quantity"
                value={mealData.quantity}
                onChange={(e) => setMealData({...mealData, quantity: e.target.value})}
                type="text"
                required
                className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                placeholder="e.g. 250g"
              />
            </div>
            <div>
              <button
                type="button"
                onClick={handleEstimate}
                disabled={isEstimating || !mealData.food_name || !mealData.quantity}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-sm font-medium text-zinc-700 hover:bg-zinc-100 transition-all disabled:opacity-50 flex items-center justify-center"
              >
                {isEstimating ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1.5" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-1.5 text-emerald-500" />
                )}
                {isEstimating ? 'Estimating...' : 'AI Estimate'}
              </button>
            </div>
          </div>

          {(mealData.calories || isEstimating) && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 animate-in">
              {[
                { id: 'calories', label: 'Calories (kcal)', value: mealData.calories },
                { id: 'protein', label: 'Protein (g)', value: mealData.protein },
                { id: 'carbs', label: 'Carbs (g)', value: mealData.carbs },
                { id: 'fat', label: 'Fat (g)', value: mealData.fat }
              ].map((input) => (
                <div key={input.id}>
                  <label htmlFor={input.id} className="block text-sm font-medium text-zinc-700 mb-1.5">
                    {input.label}
                  </label>
                  <input
                    id={input.id}
                    value={input.value}
                    onChange={(e) => setMealData({...mealData, [input.id]: e.target.value})}
                    type="number"
                    required
                    className="block w-full rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-2.5 text-sm text-zinc-900 placeholder-zinc-400 focus:border-emerald-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 transition-all"
                    placeholder="0"
                  />
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center justify-end pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !mealData.calories}
              className="flex justify-center rounded-xl bg-emerald-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              {isSubmitting ? 'Logging...' : 'Log Meal'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
