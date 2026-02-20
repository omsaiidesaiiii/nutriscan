'use client'

import { Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { deleteMeal } from '@/app/(dashboard)/dashboard/actions'
import { toast } from 'react-hot-toast'

interface DeleteMealButtonProps {
  id: string
}

export default function DeleteMealButton({ id }: DeleteMealButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this meal?')) return
    
    setIsDeleting(true)
    const result = await deleteMeal(id)
    setIsDeleting(false)

    if (result.success) {
      toast.success('Meal deleted')
    } else {
      toast.error('Failed to delete meal')
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 disabled:opacity-50"
    >
      {isDeleting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Trash2 className="h-5 w-5" />}
    </button>
  )
}
