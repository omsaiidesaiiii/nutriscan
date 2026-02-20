'use client'

import { addMeal } from '@/app/(dashboard)/dashboard/actions'
import { PlusCircle, Utensils, Barcode as BarcodeIcon, Edit3, Camera, Sparkles, Loader2, Zap, Target, Search } from 'lucide-react'
import { useState } from 'react'
import BarcodeScanner from './BarcodeScanner'
import ImageUploadMeal from './ImageUploadMeal'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

export default function AddMealForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [entryMode, setEntryMode] = useState<'manual' | 'barcode' | 'image'>('manual')
  
  // Controlled form state
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
    setEntryMode('manual') // Switch to manual to allow review/edit
    toast.success('Food details updated!')
  }

  return (
    <div className="premium-card p-10 bg-white border-emerald-100/50">
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-10 gap-8">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-emerald-500 font-black text-[10px] uppercase tracking-[0.3em]">
             <Zap className="h-3 w-3 fill-emerald-500" />
             <span>Ingestion Engine</span>
          </div>
          <h2 className="text-3xl font-black text-emerald-950 flex items-center tracking-tighter uppercase italic">
            Log Intake
          </h2>
        </div>
        
        <div className="flex bg-emerald-50/50 p-1.5 rounded-[1.5rem] w-full xl:w-auto border border-emerald-50">
          <button
            onClick={() => setEntryMode('manual')}
            className={cn(
              "flex-1 xl:flex-none flex items-center justify-center px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              entryMode === 'manual' 
                ? 'bg-emerald-950 text-white shadow-xl shadow-emerald-950/20' 
                : 'text-emerald-900/40 hover:text-emerald-900 hover:bg-white/50'
            )}
          >
            <Utensils className="h-3.5 w-3.5 mr-2" />
            Standard
          </button>
          <button
            onClick={() => setEntryMode('barcode')}
            className={cn(
              "flex-1 xl:flex-none flex items-center justify-center px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              entryMode === 'barcode' 
                ? 'bg-emerald-950 text-white shadow-xl shadow-emerald-950/20' 
                : 'text-emerald-900/40 hover:text-emerald-900 hover:bg-white/50'
            )}
          >
            <BarcodeIcon className="h-3.5 w-3.5 mr-2" />
            Scanner
          </button>
          <button
            onClick={() => setEntryMode('image')}
            className={cn(
              "flex-1 xl:flex-none flex items-center justify-center px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all",
              entryMode === 'image' 
                ? 'bg-emerald-950 text-white shadow-xl shadow-emerald-950/20' 
                : 'text-emerald-900/40 hover:text-emerald-900 hover:bg-white/50'
            )}
          >
            <Camera className="h-3.5 w-3.5 mr-2" />
            Vision
          </button>
        </div>
      </div>

      <div className="relative">
        <div className="absolute -top-4 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-50 to-transparent" />
        
        {entryMode === 'barcode' ? (
          <div className="py-6 animate-in">
            <p className="text-xs text-emerald-900/40 mb-8 font-black uppercase tracking-widest flex items-center">
              <span className="h-1 w-1 bg-emerald-400 rounded-full mr-2" />
              Scanning for biometric data packets...
            </p>
            <BarcodeScanner onProductFound={handleProductFound} />
          </div>
        ) : entryMode === 'image' ? (
          <div className="py-6 animate-in">
             <p className="text-xs text-emerald-900/40 mb-8 font-black uppercase tracking-widest flex items-center">
              <span className="h-1 w-1 bg-emerald-400 rounded-full mr-2" />
              Gemini Vision active. Analyzing nutritional density...
            </p>
            <ImageUploadMeal onProductFound={handleProductFound} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-10 animate-in pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 items-end">
              <div className="md:col-span-1 lg:col-span-2 group">
                <label htmlFor="food_name" className="block text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] mb-3 ml-1">
                  Food Identification
                </label>
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-400 group-focus-within:text-emerald-600 transition-colors" />
                  <input
                    id="food_name"
                    value={mealData.food_name}
                    onChange={(e) => setMealData({...mealData, food_name: e.target.value})}
                    type="text"
                    required
                    className="w-full rounded-[1.5rem] border border-emerald-50 bg-emerald-50/30 pl-14 pr-6 py-4.5 text-sm font-bold text-emerald-950 placeholder-emerald-900/20 focus:bg-white focus:border-emerald-200 focus:ring-8 focus:ring-emerald-500/5 transition-all outline-none"
                    placeholder="Enter food name..."
                  />
                </div>
              </div>
              <div className="md:col-span-1 lg:col-span-1">
                <label htmlFor="quantity" className="block text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] mb-3 ml-1">
                  Volume / Weight
                </label>
                <input
                  id="quantity"
                  value={mealData.quantity}
                  onChange={(e) => setMealData({...mealData, quantity: e.target.value})}
                  type="text"
                  required
                  className="w-full rounded-[1.5rem] border border-emerald-50 bg-emerald-50/30 px-6 py-4.5 text-sm font-bold text-emerald-950 placeholder-emerald-900/20 focus:bg-white focus:border-emerald-200 focus:ring-8 focus:ring-emerald-500/5 transition-all outline-none"
                  placeholder="e.g. 250g"
                />
              </div>
              <div className="lg:col-span-1">
                <button
                  type="button"
                  onClick={handleEstimate}
                  disabled={isEstimating || !mealData.food_name || !mealData.quantity}
                  className="w-full h-[62px] bg-emerald-50 text-emerald-700 rounded-[1.5rem] text-[10px] font-black uppercase tracking-widest hover:bg-emerald-100 transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center border border-emerald-100/50 shadow-sm"
                >
                  {isEstimating ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {isEstimating ? 'Architecting...' : 'AI Forecast'}
                </button>
              </div>
            </div>

            { (mealData.calories || isEstimating) && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 animate-in">
                {[
                  { id: 'calories', label: 'Fuel (kcal)', value: mealData.calories, color: 'text-orange-500' },
                  { id: 'protein', label: 'Build (g)', value: mealData.protein, color: 'text-sky-500' },
                  { id: 'carbs', label: 'Energy (g)', value: mealData.carbs, color: 'text-emerald-500' },
                  { id: 'fat', label: 'Core (g)', value: mealData.fat, color: 'text-amber-500' }
                ].map((input) => (
                  <div key={input.id}>
                    <label htmlFor={input.id} className="block text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em] mb-2 px-1">
                      {input.label}
                    </label>
                    <input
                      id={input.id}
                      value={input.value}
                      onChange={(e) => setMealData({...mealData, [input.id]: e.target.value})}
                      type="number"
                      required
                      className={cn(
                        "w-full rounded-[1.25rem] border border-emerald-50 bg-emerald-50/20 px-6 py-4 text-base font-black italic tracking-tighter focus:bg-white transition-all outline-none",
                        input.color
                      )}
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-10 border-t border-emerald-50">
              <div className="flex items-center space-x-3 text-emerald-900/30">
                 <div className="h-2 w-2 bg-emerald-400 rounded-full animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest italic">Synchronization Ready</span>
              </div>
              <button
                type="submit"
                disabled={isSubmitting || !mealData.calories}
                className="px-12 h-16 bg-emerald-950 text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-2xl shadow-emerald-950/20 hover:bg-emerald-900 transition-all hover:-translate-y-1 active:translate-y-0 disabled:opacity-50 flex items-center group"
              >
                <Target className="mr-3 h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
                {isSubmitting ? 'Syncing...' : 'Commit to Log'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
