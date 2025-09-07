import { useEffect, useState } from 'react'
import Header from '../components/Header'
import { getBooksReadLast12Months } from '../dbUtils'
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
// Books read every month, last 12
// Average book length
// Books read all time
// Top 3 genres
function Stats() {
  const [data, setData] = useState<BooksReadPerMonth[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const stats = await getBooksReadLast12Months()
      setData(stats)
    }
    fetchData()
  }, [])

  return (
    <>
      <Header />

      <div className='dashboard-container'>
        <div className='dashboard-row'>
          <div className='monthly-reading-container'>
            <h3 className='monthly-reading-text'>Books Read Per Month</h3>
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
          </div>
        </div>
      </div>
    </>
  )
}

export default Stats
