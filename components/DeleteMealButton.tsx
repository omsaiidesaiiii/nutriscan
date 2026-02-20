'use client'

import { Trash2, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { deleteMeal } from '@/app/(dashboard)/dashboard/actions'
import { toast } from 'react-hot-toast'
import { cn } from '@/lib/utils'

interface DeleteMealButtonProps {
  id: string
}

export default function DeleteMealButton({ id }: DeleteMealButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm('Delete this meal? This action cannot be undone.')) return
    
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
      className={cn(
        "p-2 text-zinc-200 hover:text-zinc-500 hover:bg-zinc-50 rounded-xl transition-all",
        "opacity-0 group-hover:opacity-100 focus:opacity-100",
        "disabled:opacity-50"
      )}
      title="Delete meal"
    >
      {isDeleting ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  )
}
