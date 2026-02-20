import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { weight, height, age, gender, goal, activity_level } = await request.json()

    if (!weight || !height || !age || !gender || !goal || !activity_level) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Mifflin-St Jeor BMR calculation
    let bmr = (10 * weight) + (6.25 * height) - (5 * age)
    if (gender === 'male') {
      bmr += 5
    } else {
      bmr -= 161
    }

    // Activity multiplier
    const multipliers: Record<string, number> = {
      low: 1.2,
      moderate: 1.55,
      high: 1.75
    }
    const multiplier = multipliers[activity_level as string] || 1.2
    const maintenanceCalories = bmr * multiplier

    // Goal adjustment
    let target_calories = maintenanceCalories
    if (goal === 'cut') {
      target_calories -= 400
    } else if (goal === 'bulk') {
      target_calories += 300
    }

    // Protein calculation (g per kg based on goal)
    const proteinRatios: Record<string, number> = {
      cut: 2.2,
      bulk: 1.8,
      maintain: 1.6
    }
    const target_protein = weight * (proteinRatios[goal as string] || 1.6)

    // Fat calculation (fixed 25% of total calories)
    // 1g fat = 9 kcal
    const target_fat = (target_calories * 0.25) / 9

    // Carbs calculation (Remaining calories)
    // 1g protein = 4 kcal, 1g carb = 4 kcal
    const proteinCalories = target_protein * 4
    const fatCalories = target_fat * 9
    const target_carbs = (target_calories - proteinCalories - fatCalories) / 4

    return NextResponse.json({
      target_calories: Math.round(target_calories),
      target_protein: Math.round(target_protein),
      target_carbs: Math.round(target_carbs),
      target_fat: Math.round(target_fat)
    })
  } catch (error) {
    console.error('Calculation API Error:', error)
    return NextResponse.json({ error: 'Failed to calculate targets' }, { status: 500 })
  }
}
