import { supabase } from '../supabase'
import { getBookById } from './apiUtils'
import type { Book, BooksReadPerMonth, ReadingStatus } from './types'

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
export async function getReadBooks(): Promise<Book[]> {
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
    .eq('status', 'read')

  if (error) {
    console.error('Error fetching read books:', error.message)
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

export async function getReadBooksCount(): Promise<number> {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()

  if (!user) {
    console.error('User not logged in.', authError)
    return 0
  }

  const { data, error } = await supabase
    .from('reading_status')
    .select('id', { count: 'exact' })
    .eq('user_id', user.id)
    .eq('status', 'read')

  if (error) {
    console.error('Error fetching read books:', error.message)
    return 0
  }

  return data?.length ?? 0
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

// Fetch books read for each month in the last 12 months
export async function getBooksReadLast12Months(): Promise<BooksReadPerMonth[]> {
  const {
    data: { user },
    error: authError
  } = await supabase.auth.getUser()
  if (!user) {
    console.error('User not logged in.', authError)
    return []
  }

  const { data, error } = await supabase.rpc('books_read_last_12_months')

  if (error) {
    console.error('Error fetching books read per month:', error.message)
    return []
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (data ?? []).map((row: any) => ({
    month: row.month, // e.g. "2025-08"
    books_read: row.books_read ?? 0
  }))
}

// Calculate average book length of all read books (pages)
export async function getAverageBookLength(): Promise<number | null> {
  // Step 1: Get all read book IDs
  const data = await getReadBooks()

  if (!data || data.length === 0) {
    return 0 // no books read yet
  }

  // Step 2: Fetch book details (pageCount) from Google Books API
  const bookIds = data.map((entry) => entry.id).filter(Boolean)
  const results = await Promise.allSettled(bookIds.map(getBookById))

  const books: Book[] = results
    .filter(
      (result): result is PromiseFulfilledResult<Book> =>
        result.status === 'fulfilled'
    )
    .map((result) => result.value)

  const pageCounts = books
    .map((book) => book.volumeInfo.pageCount ?? 0)
    .filter((count) => count > 0)

  if (pageCounts.length === 0) {
    return 0
  }

  // Step 3: Compute average
  const avg =
    pageCounts.reduce((sum, count) => sum + count, 0) / pageCounts.length

  return Math.round(avg)
}

// Fetch top 3 genres from books the user has read
export async function getTopGenres(limit = 3): Promise<string[]> {
  const readBooks = await getReadBooks()
  if (!readBooks || readBooks.length === 0) return []

  // Get book details
  const bookIds = readBooks.map((entry) => entry.id).filter(Boolean)
  const results = await Promise.allSettled(bookIds.map(getBookById))

  const books: Book[] = results
    .filter(
      (result): result is PromiseFulfilledResult<Book> =>
        result.status === 'fulfilled'
    )
    .map((result) => result.value)

  // Count categories
  const genreCount: Record<string, number> = {}

  for (const book of books) {
    const categories = book.volumeInfo.categories ?? []
    for (const cat of categories) {
      // Split on "/" and trim
      const parts = cat.split('/').map((c) => c.trim())
      for (const genre of parts) {
        genreCount[genre] = (genreCount[genre] || 0) + 1
      }
    }
  }

  // Sort by frequency
  const sorted = Object.entries(genreCount).sort((a, b) => b[1] - a[1])

  // Return top N genres
  return sorted.slice(0, limit).map(([genre]) => genre)
}
