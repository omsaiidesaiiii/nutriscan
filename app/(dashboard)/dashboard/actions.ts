'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addMeal(formData: FormData) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const food_name = formData.get('food_name') as string
  const calories = Number(formData.get('calories'))
  const protein = Number(formData.get('protein'))
  const carbs = Number(formData.get('carbs'))
  const fat = Number(formData.get('fat'))

  const { error } = await supabase.from('meals').insert({
    user_id: user.id,
    food_name,
    calories,
    protein,
    carbs,
    fat
  })

  if (error) {
    console.error('Error adding meal:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function deleteMeal(id: string) {
  const supabase = await createClient()
  
  const { error } = await supabase
    .from('meals')
    .delete()
    .match({ id })

  if (error) {
    console.error('Error deleting meal:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}

export async function getWeeklyStats() {
  const supabase = await createClient()
  
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6)
  sevenDaysAgo.setUTCHours(0, 0, 0, 0)

  const { data: meals, error } = await supabase
    .from('meals')
    .select('calories, protein, created_at')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching weekly stats:', error)
    return []
  }

  // Group by date
  const statsMap = new Map()
  
  // Initialize last 7 days
  for (let i = 0; i < 7; i++) {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    statsMap.set(dateStr, { date: dateStr, calories: 0, protein: 0 })
  }

  meals?.forEach(meal => {
    const dateStr = meal.created_at.split('T')[0]
    if (statsMap.has(dateStr)) {
      const current = statsMap.get(dateStr)
      statsMap.set(dateStr, {
        ...current,
        calories: current.calories + Number(meal.calories),
        protein: current.protein + Number(meal.protein)
      })
    }
  })

  return Array.from(statsMap.values()).reverse()
}

