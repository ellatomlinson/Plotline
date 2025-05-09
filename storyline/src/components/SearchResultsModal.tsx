import { FaXmark } from 'react-icons/fa6'
import type { GoogleBooksApiResponse } from '../types'
import SearchResultsTable from './SearchResultsTable'

interface SearchResultsModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly results: GoogleBooksApiResponse
  readonly query: string
}

function SearchResultsModal({
  isOpen,
  onClose,
  results,
  query
}: SearchResultsModalProps) {
  if (!isOpen) {
    return null
  }

  return (
    <div className='modal-backdrop'>
      <div className='search-modal'>
        <p className='search-result-text'>{`Showing results for '${query}'`}</p>
        <button className='close-button' onClick={onClose}>
          <FaXmark />
        </button>
        <SearchResultsTable results={results} />
      </div>
    </div>
  )
}

export default SearchResultsModal
