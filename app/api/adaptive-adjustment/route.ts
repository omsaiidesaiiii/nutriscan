import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { avg_calories, weight, target_calories, goal } = await request.json()

    if (!avg_calories || !target_calories || !goal) {
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 })
    }

    // Determine maintenance based on goal offset used in calculation
    let maintenance = target_calories
    if (goal === 'cut') maintenance = target_calories + 400
    if (goal === 'bulk') maintenance = target_calories - 300

    const current_offset = avg_calories - maintenance
    // For CUT, offset should be negative (e.g. -400)
    // For BULK, offset should be positive (e.g. +300)

    let status = 'optimal'
    let suggested_calorie_change = 0
    let explanation = 'You are perfectly on track with your energy balance.'

    if (goal === 'cut') {
      const deficit = -current_offset
      if (deficit < 300) {
        status = 'mild_adjustment'
        suggested_calorie_change = -200
        explanation = `Your current deficit is only ${Math.round(deficit)} kcal. To see faster progress, consider reducing intake by another 200 kcal.`
      } else if (deficit > 700) {
        status = 'warning'
        suggested_calorie_change = 200
        explanation = `Your deficit is very high (${Math.round(deficit)} kcal). This increases the risk of muscle loss. Consider eating 200 kcal more.`
      } else {
        explanation = `Your deficit of ${Math.round(deficit)} kcal is ideal for steady fat loss.`
      }
    } else if (goal === 'bulk') {
      const surplus = current_offset
      if (surplus < 200) {
        status = 'mild_adjustment'
        suggested_calorie_change = 200
        explanation = `Your surplus is only ${Math.round(surplus)} kcal. You may not be maximizing muscle growth. Consider increasing calories by 200.`
      } else if (surplus > 600) {
        status = 'warning'
        suggested_calorie_change = -200
        explanation = `Your surplus is quite high (${Math.round(surplus)} kcal). This might lead to excessive fat gain. Consider reducing intake by 200 kcal.`
      } else {
        explanation = `Your surplus of ${Math.round(surplus)} kcal is perfect for lean muscle growth.`
      }
    } else {
      // Maintain
      if (Math.abs(current_offset) > 200) {
        status = 'mild_adjustment'
        suggested_calorie_change = -current_offset
        explanation = `You are drifting ${current_offset > 0 ? 'above' : 'below'} maintenance. Adjust intake to stabilize weight.`
      }
    }

    return NextResponse.json({
      status,
      suggested_calorie_change,
      explanation
    })
  } catch (error) {
    console.error('Adaptive Adjustment API Error:', error)
    return NextResponse.json({ error: 'Failed to process adaptive logic' }, { status: 500 })
  }
}
