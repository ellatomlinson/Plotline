import CurrentlyReading from '../components/CurrentlyReading'
import Header from '../components/Header'
import ReadingGoal from '../components/ReadingGoal'
import ReadingList from '../components/ReadingList'
import Recommendations from '../components/Recommendations'

// charts to add:
// Books read every month
// Average book length
// Average star rating
// Books read all time
// Top 3 genres
function Stats() {
  return (
    <>
      <Header />
      <div className='dashboard-container'>
        <div className='dashboard-row'>
          <CurrentlyReading />
          <ReadingGoal />
          <ReadingList />
        </div>
        <Recommendations />
      </div>
    </>
  )
}

export default Stats
