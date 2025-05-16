import { useState } from 'react'
import ReadingGoalModal from './ReadingGoalModal'

function ReadingGoal() {
  const [isGoalModalOpen, setIsGoalModalOpen] = useState<boolean>(false)

  const handleGoalModalOpen = () => {
    setIsGoalModalOpen(true)
  }
  const handleGoalModalClose = () => {
    setIsGoalModalOpen(false)
  }

  return (
    <>
      <div className='reading-goal-container' onClick={handleGoalModalOpen}>
        <h3 className='reading-goal-text'>Reading Goal</h3>
      </div>
      <ReadingGoalModal
        isOpen={isGoalModalOpen}
        onClose={handleGoalModalClose}
      />
    </>
  )
}

export default ReadingGoal
