import Header from '../components/Header'
import ReadingGoal from '../components/ReadingGoal'

function Home() {
  return (
    <>
      <Header />
      <div className='dashboard-container'>
        <ReadingGoal />
      </div>
    </>
  )
}

export default Home
