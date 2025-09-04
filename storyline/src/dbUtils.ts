import { supabase } from '../supabase'
import { getBookById } from './apiUtils'
import type { Book, ReadingStatus } from './types'

// Fetch user's reading goal
export async function getReadingGoal(): Promise<number | null> {
  const {
    data: { user }
  } = await supabase.auth.getUser()
  if (!user) {
    console.error('User not logged in.')
    return null
  }

  const { data: existing, error: fetchError } = await supabase
    .from('user_reading_goals')
    .select('goal')
    .eq('user_id', user.id)
    .single()

  if (fetchError) {
    console.error('Failed to fetch existing goal', fetchError.message)
    return null
  }

  return existing?.goal ?? null
}

// Update or create the users reading goal
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
    ...(existing ? { id: existing.id } : {})
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

// Save the users reading status for a book
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

// Fetch the users reading status for a book
export async function getBookStatus(bookId: string): Promise<string | null> {
  const user = await supabase.auth.getUser()
  const userId = user.data.user?.id

  if (!userId) {
    console.error('User not logged in.')
    return null
  }

  const { data, error } = await supabase
    .from('reading_status')
    .select('status')
    .eq('user_id', userId)
    .eq('google_book_id', bookId)
    .single()

  if (error) {
    console.error('Failed to fetch book status:', error.message)
    return null
  }

  return data?.status ?? null
}

// Fetch all the books marked as read by the user
export async function getReadBooks() {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (!user) {
    console.error('User not logged in.', authError)
    return []
  }

  const { data, error } = await supabase
    .from('reading_status')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'read')

  if (error) {
    console.error('Error fetching read books:', error.message)
    return []
  }

  return data
}

// Fetch all the books marked as currently_reading by the user
export async function getCurrentlyReadingBooks(): Promise<Book[]> {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (!user) {
    console.error('User not logged in.', authError)
    return []
  }

  const { data, error } = await supabase
    .from('reading_status')
    .select('google_book_id')
    .eq('user_id', user.id)
    .eq('status', 'currently_reading')

  if (error) {
    console.error(
      'Error fetching currently_reading books from database:',
      error.message
    )
    return []
  }

  const bookIds = data.map((entry) => entry.google_book_id).filter(Boolean)
  const books = await Promise.allSettled(bookIds.map(getBookById))

  return books
    .filter(
      (result): result is PromiseFulfilledResult<Book> =>
        result.status === 'fulfilled'
    )
    .map((result) => result.value)
}

// Fetch all the books marked as reading_list by the user
export async function getReadingListBooks(): Promise<Book[]> {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (!user) {
    console.error('User not logged in.', authError)
    return []
  }

  const { data, error } = await supabase
    .from('reading_status')
    .select('google_book_id')
    .eq('user_id', user.id)
    .eq('status', 'reading_list')

  if (error) {
    console.error(
      'Error fetching reading_list books from database:',
      error.message
    )
    return []
  }

  const bookIds = data.map((entry) => entry.google_book_id).filter(Boolean)
  const books = await Promise.allSettled(bookIds.map(getBookById))

  return books
    .filter(
      (result): result is PromiseFulfilledResult<Book> =>
        result.status === 'fulfilled'
    )
    .map((result) => result.value)
}
