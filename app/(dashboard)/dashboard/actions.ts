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

  // Update streak
  await updateStreak(user.id)

  revalidatePath('/dashboard')
  return { success: true }
}

async function updateStreak(userId: string) {
  const supabase = await createClient()
  
  const { data: profile } = await supabase
    .from('profiles')
    .select('current_streak, updated_at')
    .eq('id', userId)
    .single()

  if (!profile) return

  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime()
  const yesterday = today - (24 * 60 * 60 * 1000)

  const lastUpdate = profile.updated_at ? new Date(profile.updated_at) : null
  const lastUpdateDate = lastUpdate 
    ? new Date(lastUpdate.getFullYear(), lastUpdate.getMonth(), lastUpdate.getDate()).getTime()
    : null

  let newStreak = profile.current_streak || 0

  if (lastUpdateDate === today) {
    return
  }
  
  if (lastUpdateDate === yesterday) {
    newStreak += 1
  } else {
    newStreak = 1
  }

  await supabase
    .from('profiles')
    .update({ 
      current_streak: newStreak,
      updated_at: now.toISOString()
    })
    .eq('id', userId)
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

import { getWeeklyAverages } from '@/lib/getWeeklyStats'

export async function getWeeklyAveragesAction() {
  try {
    return await getWeeklyAverages()
  } catch (error) {
    console.error('Action error fetching weekly averages:', error)
    return null
  }
}

export async function logMealPlanAction(meals: any[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const tomorrow = new Date()
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1)
  tomorrow.setUTCHours(12, 0, 0, 0) // Set to noon tomorrow

  const mealsToInsert = meals.map(meal => ({
    user_id: user.id,
    food_name: meal.name,
    calories: meal.calories,
    protein: meal.protein,
    carbs: meal.carbs,
    fat: meal.fat,
    created_at: tomorrow.toISOString()
  }))

  const { error } = await supabase.from('meals').insert(mealsToInsert)

  if (error) {
    console.error('Error logging meal plan:', error)
    return { error: error.message }
  }

  revalidatePath('/dashboard')
  return { success: true }
}
