import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { barcode } = await request.json()

    if (!barcode) {
      return NextResponse.json({ error: 'Barcode is required' }, { status: 400 })
    }

    const response = await fetch(
      `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`,
      {
        headers: {
          'User-Agent': 'SmartNutritionAI-NextJS - Web - Version 0.1',
        },
      }
    )

    if (!response.ok) {
      return NextResponse.json({ error: 'Failed to fetch from OpenFoodFacts' }, { status: 500 })
    }

    const data = await response.json()

    if (data.status === 0 || !data.product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }

    const product = data.product
    const nutriments = product.nutriments || {}

    // Extract macros (per 100g)
    const result = {
      name: product.product_name || 'Unknown Product',
      calories: Math.round(nutriments['energy-kcal_100g'] || 0),
      protein: Number(nutriments['proteins_100g'] || 0),
      carbs: Number(nutriments['carbohydrates_100g'] || 0),
      fat: Number(nutriments['fat_100g'] || 0),
      brand: product.brands || '',
      image: product.image_url || '',
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Barcode API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
