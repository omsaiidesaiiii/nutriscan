import { createClient } from './supabase/server'

export async function getWeeklyAverages() {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('User not authenticated')

  const sevenDaysAgo = new Date()
  sevenDaysAgo.setUTCDate(sevenDaysAgo.getUTCDate() - 6)
  sevenDaysAgo.setUTCHours(0, 0, 0, 0)

  const { data: meals, error } = await supabase
    .from('meals')
    .select('*')
    .gte('created_at', sevenDaysAgo.toISOString())

  if (error) {
    console.error('Error fetching meals for weekly stats:', error)
    return null
  }

  if (!meals || meals.length === 0) {
    return {
      avg_calories: 0,
      avg_protein: 0,
      avg_carbs: 0,
      avg_fat: 0
    }
  }

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + Number(meal.calories),
      protein: acc.protein + Number(meal.protein),
      carbs: acc.carbs + Number(meal.carbs),
      fat: acc.fat + Number(meal.fat),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return {
    avg_calories: Math.round(totals.calories / 7),
    avg_protein: Math.round(totals.protein / 7),
    avg_carbs: Math.round(totals.carbs / 7),
    avg_fat: Math.round(totals.fat / 7)
  }
}
