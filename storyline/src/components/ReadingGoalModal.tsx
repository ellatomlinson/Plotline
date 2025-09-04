import { useEffect, useState } from 'react'
import { upsertReadingGoal } from '../dbUtils'

interface ReadingGoalModalProps {
  readonly isOpen: boolean
  readonly onClose: () => void
  readonly setGoal: (goal: number) => void
  readonly goal: number
}

// TODO: circle chart can act weird when you surpass your readin goal
function ReadingGoalModal({
  isOpen,
  onClose,
  setGoal,
  goal
}: ReadingGoalModalProps) {
  const [newGoal, setNewGoal] = useState<number>(goal)

  useEffect(() => {
    if (isOpen) {
      setNewGoal(goal)
    }
  }, [goal, isOpen])

  if (!isOpen) {
    return null
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10)
    if (!isNaN(value)) {
      setGoal(value)
    }
  }

  const increment = () => setNewGoal(newGoal + 1)
  const decrement = () => setNewGoal(newGoal > 0 ? newGoal - 1 : 0)

  const handleSaveGoal = async () => {
    const success = await upsertReadingGoal(newGoal)
    if (success) {
      onClose()
      setGoal(newGoal)
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
              value={newGoal}
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
