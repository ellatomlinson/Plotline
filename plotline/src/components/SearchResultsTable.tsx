import { forwardRef } from 'react'
import type { Book, GoogleBooksApiResponse } from '../types'
import BookTile from './BookTile'

interface SearchResultsTableProps {
  readonly results: GoogleBooksApiResponse
  readonly setSelectedBook: (book: Book) => void
}

const SearchResultsTable = forwardRef<HTMLDivElement, SearchResultsTableProps>(
  ({ results, setSelectedBook }, ref) => {
    return (
      <div className='book-tiles-container' ref={ref}>
        {results.items.map((book, index) => (
          <BookTile
            key={index}
            book={book}
            onClick={() => setSelectedBook(book)}
          />
        ))}
      </div>
    )
  }
)

SearchResultsTable.displayName = 'SearchResultsTable'

export default SearchResultsTable
