import { supabase } from '../supabase'
import type { ReadingStatus } from './types'

export async function upsertReadingGoal(newGoal: number): Promise<boolean> {
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) {
    console.error('User not logged in.')
    return false
  }

  const { data: existing, error: fetchError } = await supabase
    .from('user_reading_goals')
    .select('id')
    .eq('user_id', user.id)
    .single()

  if (fetchError) {
    console.error('Failed to fetch existing goals', fetchError.message)
    return false
  }

  const payload = {
    user_id: user.id,
    goal: newGoal,
    ...(existing ? { id: existing.id } : {}) // Include `id` if updating
  }

  const { error } = await supabase
    .from('user_reading_goals')
    .upsert(payload, { onConflict: 'user_id' })

  if (error) {
    console.error('Failed to save goal:', error.message)
    return false
  } else {
    console.log('Goal saved successfully')
    return true
  }
}

export async function saveBook(
  bookId: string,
  newStatus: ReadingStatus
): Promise<boolean> {
  const user = await supabase.auth.getUser()
  const userId = user.data.user?.id

  if (!userId) {
    console.error('User not logged in.')
    return false
  }

  if (newStatus === 'remove') {
    const { error } = await supabase
      .from('reading_status')
      .delete()
      .eq('user_id', userId)
      .eq('google_book_id', bookId)

    if (error) {
      console.error('Deletion failed:', error)
      return false
    }
  } else {
    const { error } = await supabase.from('reading_status').upsert(
      {
        user_id: userId,
        google_book_id: bookId,
        status: newStatus,
        finished_reading:
          newStatus === 'read' ? Math.floor(Date.now() / 1000) : null
      },
      { onConflict: 'user_id,google_book_id' }
    )

    if (error) {
      console.error('Save failed:', error)
      return false
    }
  }
  return true
}
