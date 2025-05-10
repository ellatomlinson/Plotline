import type { Book, GoogleBooksApiResponse } from '../types'
import BookTile from './BookTile'

interface SearchResultsTableProps {
  readonly results: GoogleBooksApiResponse
  readonly setSelectedBook: (book: Book) => void
}

function SearchResultsTable({ results, setSelectedBook }: SearchResultsTableProps) {


  return (
    <div className='book-tiles-container'>
      {results.items.map((book, index) => (
        <BookTile key={index} book={book} onClick={() => setSelectedBook(book)} />
      ))}
    </div>
  )
}

export default SearchResultsTable
