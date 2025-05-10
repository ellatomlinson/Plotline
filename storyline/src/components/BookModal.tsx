import { FaXmark } from 'react-icons/fa6'
import type { Book } from '../types'

interface BookModalProps {
  readonly book: Book
  readonly onClose: () => void
}

function BookModal({ book, onClose }: BookModalProps) {
  const { title, imageLinks, authors, categories, pageCount, description } = book.volumeInfo

  const renderStars = (rating: number | undefined) => {
    if (!rating) return 'No rating'
    const fullStars = Math.floor(rating)
    const halfStar = rating % 1 >= 0.5
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0)

    return (
      <>
        {'★'.repeat(fullStars)}
        {halfStar && '½'}
        {'☆'.repeat(emptyStars)}
      </>
    )
  }

  return (
    <div className='book-modal-backdrop'>
      <div className='book-modal-container'>
        <button className='book-modal-close-button' onClick={onClose}>
          <FaXmark />
        </button>
        <div className='book-modal-info-card-container'>
          <div className='book-modal-cover-container'>
            <img
              src={imageLinks?.thumbnail || 'fallback-image.jpg'}
              alt={title}
              className='book-modal-cover'
            />
          </div>
          <div className='book-modal-text'>
            <h3 className='book-modal-title'>{title}</h3>
            <h3 className='book-modal-author'>{authors?.join(', ')}</h3>
            <p className='book-modal-stat-field'>
              <span className='book-modal-stat-label'>Genres:</span>{' '}
              <span className='book-modal-stat-value'>
                {categories?.join(', ')}
              </span>
            </p>
            <p className='book-modal-stat-field'>
              <span className='book-modal-stat-label'>Page Count:</span>{' '}
              <span className='book-modal-stat-value'>{pageCount}</span>
            </p>
            <p className='book-modal-stat-field'>
              <span className='book-modal-stat-label'>Rating:</span>{' '}
              <span className='book-modal-stat-value'>
                {renderStars(book.volumeInfo.averageRating)}
              </span>
            </p>
          </div>
        </div>
        <p className='book-modal-description-container'>{description}</p>
      </div>
    </div>
  )
}

export default BookModal
