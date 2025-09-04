import { useCallback, useEffect, useState } from 'react'
import type { Book } from '../types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/swiper-bundle.css'
import { getRecommendationsFromReadBooks } from '../apiUtils'
import BookModal from './BookModal'

function Recommendations() {
  const [isLoading, setIsLoading] = useState(true)
  const [bookRecs, setBookRecs] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)

  // Fetch the books with a currently reading status
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const bookData = await getRecommendationsFromReadBooks()
      setBookRecs(bookData)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return (
    <>
      <div className='recommendations-container'>
        <h3 className='currently-reading-text'>Recommendations</h3>
        {isLoading ? (
          <div className='spinner' />
        ) : bookRecs.length === 0 ? (
          <p style={{ color: '#777' }}>
            Read some more books to receive some recommendations!
          </p>
        ) : (
          <div className='slider-wrapper-recs'>
            <Swiper
              modules={[Navigation]}
              navigation={true}
              spaceBetween={20}
              slidesPerView={3}
              breakpoints={{
                480: { slidesPerView: 3 },
                768: { slidesPerView: 6 },
                1024: { slidesPerView: 9 }
              }}
              style={{ padding: '1rem 0' }}
            >
              {bookRecs.map((book) => {
                const imgSrc = book.volumeInfo.imageLinks?.thumbnail
                return (
                  <SwiperSlide key={book.id}>
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={book.volumeInfo.title}
                        style={{
                          width: '100%',
                          height: '165px',
                          objectFit: 'cover',
                          borderRadius: 4,
                          display: 'block',
                          boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.1)',
                          cursor: 'pointer'
                        }}
                        onClick={() => setSelectedBook(book)}
                      />
                    ) : (
                      <div
                        style={{
                          width: 'auto',
                          height: '165px',
                          backgroundColor: '#eee',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderRadius: 4
                        }}
                      >
                        No Cover
                      </div>
                    )}
                  </SwiperSlide>
                )
              })}
            </Swiper>
          </div>
        )}
      </div>
      {selectedBook && (
        <BookModal book={selectedBook} onClose={() => setSelectedBook(null)} />
      )}
    </>
  )
}

export default Recommendations
