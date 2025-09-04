import { FaXmark } from 'react-icons/fa6'
import type { Book } from '../types'
import { useEffect, useState } from 'react'
import { getBookStatus, saveBook } from '../dbUtils'
import { stringToReadingStatus } from '../utils'

interface BookModalProps {
  readonly book: Book
  readonly onClose: () => void
}

function BookModal({ book, onClose }: BookModalProps) {
  const [selectedStatus, setSelectedStatus] = useState('')
  const [loadingStatus, setLoadingStatus] = useState(true)
  const [isChanged, setIsChanged] = useState(false)

  const { title, imageLinks, authors, categories, pageCount, description } =
    book.volumeInfo

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

  useEffect(() => {
    async function loadStatus() {
      setLoadingStatus(true)
      const existingStatus = await getBookStatus(book.id)
      if (existingStatus) {
        setSelectedStatus(existingStatus)
      }
      setLoadingStatus(false)
    }

    loadStatus()
  }, [book.id])

  const handleSave = async () => {
    if (selectedStatus) {
      const success = await saveBook(
        book.id,
        stringToReadingStatus(selectedStatus)
      )
      if (!success) {
        alert('Failed to save the book. Please try again.')
      }
    }
    onClose()
    setIsChanged(false)
  }

  // TODO: Fix save button on scroll
  return (
    <div className='book-modal-backdrop'>
      {loadingStatus ? (
        <div className='book-modal-spinner-overlay'>
          <div className='spinner'></div>
        </div>
      ) : (
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
              <p className='book-modal-stat-field'>
                <span className='book-modal-stat-label'>Status:</span>{' '}
                <select
                  className='book-modal-dropdown'
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value)
                    setIsChanged(e.target.value !== '')
                  }}
                >
                  <option value=''>Select Status</option>
                  <option value='reading_list'>Reading List</option>
                  <option value='currently_reading'>Currently Reading</option>
                  <option value='read'>Read</option>
                  <option value='did_not_finish'>Did Not Finish</option>
                  <option value='remove'>Remove Book</option>
                </select>
              </p>
            </div>
          </div>
          {description && (
            <p
              className='book-modal-description-container'
              dangerouslySetInnerHTML={{ __html: description }}
            />
          )}
          <button
            className='book-modal-save-button'
            onClick={handleSave}
            disabled={!isChanged}
          >
            Save
          </button>
        </div>
      )}
    </div>
  )
}

export default BookModal
