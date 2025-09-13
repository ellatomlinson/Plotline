import { supabase } from '../supabase'
import { getReadBooks } from './dbUtils'
import type { Book, GoogleBooksApiResponse } from './types'

const STALE_AFTER_DAYS = 30

export async function getBookById(bookId: string): Promise<Book> {
  // Step 1: Try Supabase
  const { data: existing, error } = await supabase
    .from('books')
    .select('data, updated_at')
    .eq('id', bookId)
    .single()

  if (error) {
    console.error('Failed to save book in cache:', error.message)
  }
  if (existing) {
    const updatedAt = new Date(existing.updated_at)
    const isStale =
      Date.now() - updatedAt.getTime() > STALE_AFTER_DAYS * 24 * 60 * 60 * 1000

    if (!isStale) {
      return existing.data as Book
    }
  }

  // Step 2: Fetch from Google
  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes/${bookId}`
  )
  if (!response.ok) {
    throw new Error(`Failed to fetch book with ID ${bookId}`)
  }
  const bookData = await response.json()

  // Step 3: Upsert into Supabase
  const { error: upsertError } = await supabase.from('books').upsert({
    id: bookId,
    data: bookData,
    updated_at: new Date().toISOString()
  })

  if (upsertError) {
    console.error('Failed to save book in cache:', upsertError.message)
  }

  return bookData
}

async function getSimilarBooks(book: Book, maxResults = 3): Promise<Book[]> {
  const category = book.volumeInfo.categories?.[0]
  const author = book.volumeInfo.authors?.[0]
  const title = book.volumeInfo.title

  // Fallback query based on most available data
  const query = author
    ? `inauthor:${encodeURIComponent(author)}`
    : category
      ? `subject:${encodeURIComponent(category)}`
      : `intitle:${encodeURIComponent(title)}`

  const response = await fetch(
    `https://www.googleapis.com/books/v1/volumes?q=${query}&maxResults=${maxResults + 3}`
  )
  if (!response.ok) {
    console.error(`Failed to fetch similar books for: ${title}`)
    return []
  }

  const data: GoogleBooksApiResponse = await response.json()

  // Filter out the original book by ID to avoid recommending it again
  const similar =
    data.items?.filter((b) => b.id !== book.id).slice(0, maxResults) ?? []

  return similar
}

export async function getRecommendationsFromReadBooks(): Promise<Book[]> {
  // to-do, start with most recently read books
  const readBooks = await getReadBooks()

  const fullBooks = await Promise.allSettled(
    readBooks.map((entry) => getBookById(entry.id))
  )

  const books = fullBooks
    .filter(
      (res): res is PromiseFulfilledResult<Book> => res.status === 'fulfilled'
    )
    .map((res) => res.value)

  const allRecommendations = await Promise.all(
    books.map((book) => getSimilarBooks(book, 3))
  )

  // Flatten nested arrays
  const flatRecs = allRecommendations.flat()

  const uniqueBookMap = new Map<string, Book>()
  for (const rec of flatRecs) {
    if (!uniqueBookMap.has(rec.id)) {
      uniqueBookMap.set(rec.id, rec)
    }
  }

  // Return array of unique recommendations
  return Array.from(uniqueBookMap.values())
}
