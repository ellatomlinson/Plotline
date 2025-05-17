import { useCallback, useEffect, useState } from 'react'
import ReadingGoalModal from './ReadingGoalModal'
import { getReadBooks, getReadingGoal } from '../dbUtils'
import DonutChart from './DonutChart'

function ReadingGoal() {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false)
  const [booksRead, setBooksRead] = useState(0)
  const [goal, setGoal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch the number of books read and the reading goal
  const fetchData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [books, goalFromDb] = await Promise.all([
        getReadBooks(),
        getReadingGoal()
      ])
      setBooksRead(books.length)
      if (goalFromDb !== null) {
        setGoal(goalFromDb)
      }
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleGoalModalOpen = () => setIsGoalModalOpen(true)
  const handleGoalModalClose = async () => {
    setIsGoalModalOpen(false)
  }

  return (
    <>
      <div className='reading-goal-container' onClick={handleGoalModalOpen}>
        <h3 className='reading-goal-text'>Reading Goal</h3>
        {isLoading ? (
          <div className='spinner' />
        ) : (
          <>
            <DonutChart
              percentage={goal > 0 ? Math.round((booksRead / goal) * 100) : 0}
            />

            <p className='reading-goal-progress-text'>
              {booksRead} of {goal} books read
            </p>
          </>
        )}
      </div>
      <ReadingGoalModal
        isOpen={isGoalModalOpen}
        onClose={handleGoalModalClose}
        setGoal={setGoal}
        goal={goal}
      />
    </>
  )
}

export default ReadingGoal
