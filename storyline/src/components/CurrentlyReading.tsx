import { useCallback, useEffect, useState } from 'react'
import { getCurrentlyReadingBooks } from '../dbUtils'
import type { Book } from '../types'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation } from 'swiper/modules'
import 'swiper/swiper-bundle.css'

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

  return (
    <>
      <div className='currently-reading-container'>
        <h3 className='currently-reading-text'>Currently Reading</h3>
        {isLoading ? (
          <div className='spinner' />
        ) : booksReading.length === 0 ? (
          <p style={{ color: '#777' }}>No books currently being read.</p>
        ) : (
          <div className='slider-wrapper'>
            <Swiper
              modules={[Navigation]}
              navigation={true}
              spaceBetween={20}
              slidesPerView={3}
              breakpoints={{
                480: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
              style={{ padding: '1rem 0' }}
            >
              {booksReading.map((book) => {
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
                          boxShadow: '4px 4px 12px rgba(0, 0, 0, 0.1)'
                        }}
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
    </>
  )
}

export default CurrentlyReading
