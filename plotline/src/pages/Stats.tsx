import { useEffect, useState } from 'react'
import Header from '../components/Header'
import {
  getAverageBookLength,
  getBooksReadLast12Months,
  getReadBooks,
  getTopGenres
} from '../dbUtils'
import type { BooksReadPerMonth } from '../types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

// TODO: On click, open modal to review all previously read books
function Stats() {
  const [data, setData] = useState<BooksReadPerMonth[]>([])
  const [avgLength, setAvgLength] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [booksRead, setBooksRead] = useState<number | null>(null)
  const [topGenres, setTopGenres] = useState<string[]>([])

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        const stats = await getBooksReadLast12Months()
        setData(stats)

        const avg = await getAverageBookLength()
        setAvgLength(avg)

        const booksReadList = await getReadBooks()
        setBooksRead(booksReadList.length)

        const genres = await getTopGenres()
        setTopGenres(genres)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <>
      <Header />
      <div className='dashboard-container'>
        <div className='dashboard-row'>
          <div className='average-page-count-container'>
            <h3 className='average-page-count-text'>Average Book Length</h3>
            {isLoading ? (
              <div className='spinner' />
            ) : (
              <p className='average-page-count-value'>
                {avgLength === null ? 'Loading...' : `${avgLength} pages`}
              </p>
            )}
          </div>
          <div className='book-count-container'>
            <h3 className='book-count-text'>Total Books Read</h3>
            {isLoading ? (
              <div className='spinner' />
            ) : (
              <p className='book-count-value'>
                {avgLength === null ? 'Loading...' : `${booksRead}`}
              </p>
            )}
          </div>
          <div className='top-genres-container'>
            <h3 className='top-genres-text'>Top Genres</h3>
            {isLoading ? (
              <div className='spinner' />
            ) : (
              <p className='top-genres-value'>
                {topGenres.length > 0 ? topGenres.join(', ') : 'No genres yet'}
              </p>
            )}
          </div>
        </div>
        <div className='monthly-reading-container'>
          <h3 className='monthly-reading-text'>Books Read Per Month</h3>
          {isLoading ? (
            <div className='spinner' />
          ) : (
            <ResponsiveContainer width='100%' height={300}>
              <LineChart data={data}>
                <XAxis dataKey='month' />
                <YAxis />
                <Tooltip />
                <Line
                  type='monotone'
                  dataKey='books_read'
                  stroke='#000000'
                  strokeWidth={2}
                  name='Books Read'
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </>
  )
}

export default Stats
