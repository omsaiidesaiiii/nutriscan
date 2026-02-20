'use client'

import { Trash2, Loader2, XCircle } from 'lucide-react'
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
    if (!confirm('Abort this record? This action is irreversible.')) return
    
    setIsDeleting(true)
    const result = await deleteMeal(id)
    setIsDeleting(false)

    if (result.success) {
      toast.success('Record purged from archive')
    } else {
      toast.error('Purge sequence failed')
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className={cn(
        "p-3 text-emerald-100 hover:text-rose-500 hover:bg-rose-50 rounded-2xl transition-all",
        "opacity-0 group-hover:opacity-100 focus:opacity-100",
        "disabled:opacity-50 border border-transparent hover:border-rose-100 shadow-sm"
      )}
      title="Purge Record"
    >
      {isDeleting ? (
        <Loader2 className="h-5 w-5 animate-spin" />
      ) : (
        <XCircle className="h-5 w-5" />
      )}
    </button>
  )
}
