import { FaXmark } from 'react-icons/fa6'
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

  useEffect(() => {
    if (isOpen) {
      getReadBooks().then(setBooks)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className='modal-backdrop'>
      <div className='search-modal'>
        <h2 className='modal-title'>Alltime Books Read</h2>
        <button className='close-button' onClick={onClose}>
          <FaXmark />
        </button>

        <div className='books-list'>
          {books.length === 0 ? (
            <p>No books read yet.</p>
          ) : (
            books.map((book) => (
              <BookTile
                key={book?.id}
                book={book}
                onClick={() => setSelectedBook(book)}
              />
            ))
          )}
        </div>
      </div>

      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  )
}

export default ReadBooksModal
