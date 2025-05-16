import { useState } from 'react'
import { upsertReadingGoal } from '../dbUtils'

interface ReadingGoalModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
}

function ReadingGoalModal({ isOpen, onClose }: ReadingGoalModalProps) {
  const [goal, setGoal] = useState(1)
  if (!isOpen) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value)) {
      setGoal(value)
    }
  }

  const increment = () => setGoal((prev) => prev + 1)
  const decrement = () => setGoal((prev) => (prev > 0 ? prev - 1 : 0))

  const handleSaveGoal = async () => {
    const success = await upsertReadingGoal(goal)
    if (success) {
      onClose()
    } else {
      alert(
        'Failed to save reading goal. Please refresh the page and try again.'
      )
    }
  }

  return (
    <div className='goal-modal-backdrop'>
      <div className='goal-modal-container'>
        <button className='goal-close-button' onClick={onClose}>
          ×
        </button>
        <div className='goal-modal-content'>
          <h3 className='goal-modal-title'>Set Your Reading Goal</h3>
          <div className='goal-input-group'>
            <button onClick={decrement} className='goal-button'>
              -
            </button>
            <input
              type='number'
              value={goal}
              onChange={handleChange}
              className='goal-input'
              min={0}
            />
            <button onClick={increment} className='goal-button'>
              +
            </button>
          </div>
          <button className='save-goal-button' onClick={handleSaveGoal}>
            Save
          </button>
        </div>
      </div>
    </div>
  )
}

export default ReadingGoalModal
