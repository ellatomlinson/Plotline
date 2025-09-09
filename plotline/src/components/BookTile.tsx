import type { Book } from '../types'
import { processDescription } from '../utils'

interface BookTileProps {
  readonly book: Book
  readonly onClick: () => void
}

function BookTile({ book, onClick }: BookTileProps) {
  const { title, authors, description, imageLinks } = book.volumeInfo
  return (
    <div className='book-tile-container' onClick={onClick}>
      <div className='book-cover-container'>
        <img
          src={imageLinks?.thumbnail || 'fallback-image.jpg'}
          alt={title}
          className='book-cover'
        />
      </div>
      <div className='book-text'>
        <h3 className='book-title'>{title}</h3>
        <p className='book-author'>{authors?.join(', ')}</p>
        <p className='book-description'>
          {processDescription(description ?? '')}
        </p>
      </div>
    </div>
  )
}

export default BookTile
