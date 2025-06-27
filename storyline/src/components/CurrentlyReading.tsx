import { useCallback, useEffect, useState } from 'react'
import { getCurrentlyReadingBooks } from '../dbUtils'
import type {  DbBook } from '../types'

function CurrentlyReading() {
  const [isLoading, setIsLoading] = useState(true)
  const [booksReading, setBooksReading] = useState<DbBook[]>([])

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

  console.log(isLoading, booksReading)

  return (
    <>
      <div className='currently-reading-container'>
        <h3 className='currently-reading-text'>Currently Reading</h3>

      </div>
    </>
  )
}

export default CurrentlyReading
