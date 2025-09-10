import { FaXmark, FaChevronLeft, FaChevronRight } from 'react-icons/fa6'
import { useEffect, useState } from 'react'
import { getReadBooks } from '../dbUtils'
import type { Book } from '../types'
import BookModal from './BookModal'
import BookTile from './BookTile'

interface ReadBooksModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

function ReadBooksModal({ isOpen, onClose }: ReadBooksModalProps) {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [page, setPage] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  const pageSize = 6

  useEffect(() => {
    if (!isOpen) return

    const fetchBooks = async () => {
      setIsLoading(true)
      try {
        const res = await getReadBooks()
        setBooks(res)
        setPage(0) // reset to first page
      } catch (error) {
        console.error('Error fetching read books:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBooks()
  }, [isOpen])

  if (!isOpen) return null

  const totalPages = Math.ceil(books.length / pageSize)
  const paginatedBooks = books.slice(page * pageSize, (page + 1) * pageSize)

  const handlePrev = () => setPage((p) => Math.max(0, p - 1))
  const handleNext = () => setPage((p) => Math.min(totalPages - 1, p + 1))

  return (
    <div className='modal-backdrop'>
      <div className='search-modal'>
        <h2 className='modal-title'>All-Time Books Read</h2>
        <button className='close-button' onClick={onClose}>
          <FaXmark />
        </button>
        {isLoading ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '300%'
            }}
          >
            <div className='spinner' />
          </div>
        ) : (
          <div className='book-tiles-container'>
            {paginatedBooks.length === 0 ? (
              <p>No books read yet.</p>
            ) : (
              paginatedBooks.map((book) => (
                <BookTile
                  key={book.id}
                  book={book}
                  onClick={() => setSelectedBook(book)}
                />
              ))
            )}
          </div>
        )}
        {books.length > pageSize && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '1rem'
            }}
          >
            <button
              onClick={handlePrev}
              disabled={page === 0}
              className='prev-button'
            >
              <FaChevronLeft />
            </button>
            <span>
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={handleNext}
              disabled={page >= totalPages - 1}
              className='next-button'
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  )
}

export default ReadBooksModal
