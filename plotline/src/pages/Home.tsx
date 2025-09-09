import CurrentlyReading from '../components/CurrentlyReading'
import Header from '../components/Header'
import ReadingGoal from '../components/ReadingGoal'
import ReadingList from '../components/ReadingList'
import Recommendations from '../components/Recommendations'

function Home() {
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

export default Home
