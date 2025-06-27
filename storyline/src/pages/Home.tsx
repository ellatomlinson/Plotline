import CurrentlyReading from '../components/CurrentlyReading'
import Header from '../components/Header'
import ReadingGoal from '../components/ReadingGoal'

function Home() {
  return (
    <>
      <Header />
      <div className='dashboard-container'>
        <CurrentlyReading />
        <ReadingGoal />
        <CurrentlyReading />
      </div>
    </>
  )
}

export default Home
