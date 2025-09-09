import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { getAverageBookLength, getBooksReadLast12Months, getReadBooks } from '../dbUtils'
import type { BooksReadPerMonth } from '../types'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts'

// charts to add:
// Books read all time
// Top 3 genres
function Stats() {
  const [data, setData] = useState<BooksReadPerMonth[]>([])
  const [avgLength, setAvgLength] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [booksRead, setBooksRead] = useState<number | null>(null)

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
          <div className='average-page-count-container'>
            <h3 className='average-page-count-text'>Total Books Read</h3>
            {isLoading ? (
              <div className='spinner' />
            ) : (
              <p className='average-page-count-value'>
                {avgLength === null ? 'Loading...' : `${booksRead}`}
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
