import { FaXmark } from 'react-icons/fa6'

interface SearchResultsModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly results: string[]
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

  console.log(results)

  return (
    <div className='modal-backdrop'>
      <div className='search-modal'>
        <p className='search-result-text'>{`Showing results for '${query}'`}</p>
        <button className='close-button' onClick={onClose}>
          <FaXmark />
        </button>
      </div>
    </div>
  )
}

export default SearchResultsModal
