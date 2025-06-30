import { useCallback, useEffect, useState } from 'react'
import { getCurrentlyReadingBooks } from '../dbUtils'
import type { Book } from '../types'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import Slider from 'react-slick'

function CurrentlyReading() {
  const [isLoading, setIsLoading] = useState(true)
  const [booksReading, setBooksReading] = useState<Book[]>([])

  // Fetch the books with a currently reading status
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const bookData = await getCurrentlyReadingBooks()
      setBooksReading(bookData)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: Math.min(booksReading.length, 3),
    slidesToScroll: 1
  }

  return (
    <>
      <div className='currently-reading-container'>
        <h3 className='currently-reading-text'>Currently Reading</h3>
        {isLoading ? (
        <div className='spinner' />
      ) : booksReading.length === 0 ? (
        <p>No books currently being read.</p>
      ) : (
        <Slider {...sliderSettings}>
          {booksReading.map((book) => (
            <div key={book.id} className='book-slide'>
              <img
                src={book.volumeInfo.imageLinks?.smallThumbnail ?? '/placeholder.png'}
                style={{ height: '50px', objectFit: 'contain', margin: '0 auto' }}
              />
            </div>
          ))}
        </Slider>
      )}
      </div>
    </>
  )
}

export default CurrentlyReading
