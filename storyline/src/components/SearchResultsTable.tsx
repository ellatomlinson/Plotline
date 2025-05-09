import type { GoogleBooksApiResponse } from '../types'
import BookTile from './BookTile'

interface SearchResultsTableProps {
  readonly results: GoogleBooksApiResponse
}

function SearchResultsTable({ results }: SearchResultsTableProps) {
  console.log(results)
  return (
    <div className='book-tiles-container'>
      {results.items.map((book, index) => (
        <BookTile key={index} book={book} />
      ))}
    </div>
  )
}

export default SearchResultsTable
