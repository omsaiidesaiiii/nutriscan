export type Meal = {
  id: string
  user_id: string
  food_name: string
  calories: number
  protein: number
  carbs: number
  fat: number
  created_at: string
}

export type MealInsert = Omit<Meal, 'id' | 'created_at'>
