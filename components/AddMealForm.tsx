'use client'

import { addMeal } from '@/app/(dashboard)/dashboard/actions'
import { PlusCircle, Utensils, Barcode as BarcodeIcon, Edit3, Camera } from 'lucide-react'
import { useState } from 'react'
import BarcodeScanner from './BarcodeScanner'
import ImageUploadMeal from './ImageUploadMeal'
import { toast } from 'react-hot-toast'

export default function AddMealForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [entryMode, setEntryMode] = useState<'manual' | 'barcode' | 'image'>('manual')
  
  // Controlled form state
  const [mealData, setMealData] = useState({
    food_name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  })

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
      calories: Math.round(product.calories).toString(),
      protein: Math.round(product.protein).toString(),
      carbs: Math.round(product.carbs).toString(),
      fat: Math.round(product.fat).toString()
    })
    setEntryMode('manual') // Switch to manual to allow review/edit
    toast.success('Food details updated!')
  }

  return (
    <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-xl mb-8 transition-all">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h2 className="text-2xl font-bold text-gray-900 flex items-center">
          <Edit3 className="mr-3 text-indigo-600 h-6 w-6" />
          Log Your Meal
        </h2>
        
        <div className="flex bg-gray-100 p-1 rounded-2xl w-full sm:w-auto">
          <button
            onClick={() => setEntryMode('manual')}
            className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              entryMode === 'manual' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Utensils className="h-4 w-4 mr-2" />
            Manual
          </button>
          <button
            onClick={() => setEntryMode('barcode')}
            className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              entryMode === 'barcode' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <BarcodeIcon className="h-4 w-4 mr-2" />
            Barcode
          </button>
          <button
            onClick={() => setEntryMode('image')}
            className={`flex-1 sm:flex-none flex items-center justify-center px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              entryMode === 'image' 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Camera className="h-4 w-4 mr-2" />
            AI Photo
          </button>
        </div>
      </div>

      {entryMode === 'barcode' ? (
        <div className="py-2">
          <p className="text-sm text-gray-500 mb-4 font-medium italic">
            Scan or enter a product barcode to automatically fetch nutritional data.
          </p>
          <BarcodeScanner onProductFound={handleProductFound} />
        </div>
      ) : entryMode === 'image' ? (
        <div className="py-2">
          <p className="text-sm text-gray-500 mb-4 font-medium italic">
            Take or upload a photo of your food. Gemini AI will estimate the macros for you.
          </p>
          <ImageUploadMeal onProductFound={handleProductFound} />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 items-end">
            <div className="lg:col-span-2">
              <label htmlFor="food_name" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                Food Name
              </label>
              <input
                id="food_name"
                value={mealData.food_name}
                onChange={(e) => setMealData({...mealData, food_name: e.target.value})}
                type="text"
                required
                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all placeholder-gray-300"
                placeholder="What did you eat?"
              />
            </div>
            <div>
              <label htmlFor="calories" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                Calories
              </label>
              <input
                id="calories"
                value={mealData.calories}
                onChange={(e) => setMealData({...mealData, calories: e.target.value})}
                type="number"
                required
                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="protein" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                Protein (g)
              </label>
              <input
                id="protein"
                value={mealData.protein}
                onChange={(e) => setMealData({...mealData, protein: e.target.value})}
                type="number"
                required
                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="carbs" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                Carbs (g)
              </label>
              <input
                id="carbs"
                value={mealData.carbs}
                onChange={(e) => setMealData({...mealData, carbs: e.target.value})}
                type="number"
                required
                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="0"
              />
            </div>
            <div>
              <label htmlFor="fat" className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">
                Fat (g)
              </label>
              <input
                id="fat"
                value={mealData.fat}
                onChange={(e) => setMealData({...mealData, fat: e.target.value})}
                type="number"
                required
                className="w-full rounded-2xl border-gray-100 bg-gray-50/50 px-5 py-3.5 text-sm font-semibold focus:bg-white focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all"
                placeholder="0"
              />
            </div>
          </div>
          <div className="flex justify-end pt-4 border-t border-gray-50">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-sm hover:bg-indigo-700 transition-all shadow-xl shadow-indigo-600/20 active:scale-95 disabled:opacity-50 flex items-center"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              {isSubmitting ? 'Saving...' : 'Add Meal to Log'}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
