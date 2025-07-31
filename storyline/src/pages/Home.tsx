import CurrentlyReading from '../components/CurrentlyReading'
import Header from '../components/Header'
import ReadingGoal from '../components/ReadingGoal'
import ReadingList from '../components/ReadingList'

function Home() {
  return (
    <>
      <Header />
      <div className='dashboard-container'>
        <CurrentlyReading />
        <ReadingGoal />
        <ReadingList />
      </div>
    </>
  )
}

export default Home
