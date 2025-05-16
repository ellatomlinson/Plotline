import { supabase } from '../supabase'

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
