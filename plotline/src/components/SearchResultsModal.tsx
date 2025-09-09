import { FaXmark } from 'react-icons/fa6'
import type { Book, GoogleBooksApiResponse } from '../types'
import SearchResultsTable from './SearchResultsTable'
import { useRef, useState } from 'react'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa'
import BookModal from './BookModal'

interface SearchResultsModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly results: GoogleBooksApiResponse
  readonly query: string
  readonly onPaginate: (startIndex: number) => void
}

function SearchResultsModal({
  isOpen,
  onClose,
  results,
  query,
  onPaginate
}: SearchResultsModalProps) {
  const [page, setPage] = useState(0)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)

  const resultsPerPage = 10

  if (!isOpen) {
    return null
  }

  const scrollToTop = () => {
    if (listRef.current) {
      listRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const handleNext = () => {
    const newPage = page + 1
    setPage(newPage)
    onPaginate(newPage * resultsPerPage)
    scrollToTop()
  }

  const handlePrev = () => {
    const newPage = Math.max(0, page - 1)
    setPage(newPage)
    onPaginate(newPage * resultsPerPage)
    scrollToTop()
  }

  return (
    <div className='modal-backdrop'>
      <div className='search-modal'>
        <p className='search-result-text'>{`Showing results for '${query}'`}</p>
        <button className='close-button' onClick={onClose}>
          <FaXmark />
        </button>
        <SearchResultsTable
          results={results}
          setSelectedBook={setSelectedBook}
          ref={listRef}
        />
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '1rem'
          }}
        >
          <button
            className='prev-button'
            onClick={handlePrev}
            disabled={page === 0}
          >
            <FaChevronLeft style={{ paddingTop: '0.3rem' }} />
          </button>
          <button
            className='next-button'
            onClick={handleNext}
            disabled={results.totalItems <= (page + 1) * resultsPerPage}
          >
            <FaChevronRight style={{ paddingTop: '0.3rem' }} />
          </button>
        </div>
      </div>
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </div>
  )
}

export default SearchResultsModal
