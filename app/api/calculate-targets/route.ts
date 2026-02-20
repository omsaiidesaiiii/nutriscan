import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { weight, height, age, gender, goal, activity_level, health_conditions = [] } = await request.json()

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
    let target_protein = weight * (proteinRatios[goal as string] || 1.6)

    // Fat calculation (fixed 25% of total calories)
    // 1g fat = 9 kcal
    let target_fat = (target_calories * 0.25) / 9

    // Carbs calculation (Remaining calories)
    // 1g protein = 4 kcal, 1g carb = 4 kcal
    let proteinCalories = target_protein * 4
    let fatCalories = target_fat * 9
    let target_carbs = (target_calories - proteinCalories - fatCalories) / 4

    // Health condition adjustments
    let low_gi_priority = false
    let sodium_warning = false
    let heart_healthy_mode = false

    if (health_conditions.includes('diabetes')) {
      target_carbs *= 0.85
      target_protein *= 1.10
      low_gi_priority = true
    }

    if (health_conditions.includes('hypertension')) {
      target_fat *= 0.93 // 7% reduction
      sodium_warning = true
    }

    if (health_conditions.includes('high_cholesterol')) {
      target_fat *= 0.90 // 10% reduction
      heart_healthy_mode = true
    }

    // Re-verify calories after adjustments (macros might change total calories)
    const final_calories = (target_protein * 4) + (target_carbs * 4) + (target_fat * 9)

    return NextResponse.json({
      target_calories: Math.round(final_calories),
      target_protein: Math.round(target_protein),
      target_carbs: Math.round(target_carbs),
      target_fat: Math.round(target_fat),
      low_gi_priority,
      sodium_warning,
      heart_healthy_mode
    })
  } catch (error) {
    console.error('Calculation API Error:', error)
    return NextResponse.json({ error: 'Failed to calculate targets' }, { status: 500 })
  }
}
