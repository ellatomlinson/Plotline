import { FaXmark } from 'react-icons/fa6'
import type { Book } from '../types'

interface BookModalProps {
  readonly book: Book
readonly onClose: () => void
}

function BookModal({ book, onClose }: BookModalProps) {
  const { title } = book.volumeInfo
  console.log(title)
  return (
    <div className='book-modal-backdrop'>
    <div className='book-modal-container'>
      <button className='book-modal-close-button' onClick={onClose}>
        <FaXmark />
      </button>
    </div>
  </div>
  )
}

export default BookModal
