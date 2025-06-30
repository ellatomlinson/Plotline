import { useCallback, useEffect, useState } from 'react'
import { getCurrentlyReadingBooks } from '../dbUtils'
import type { Book } from '../types'

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
        <p style={{color: '#777'}}>No books currently being read.</p>
      ) : (
        <p style={{color: '#777'}}>No books currently being read.</p>
      )}
      </div>
    </>
  )
}

export default CurrentlyReading
