import '../css/App.css'
import logo from '../assets/logo.png'
import { FaArrowRight } from 'react-icons/fa'

const Header = () => {
  return (
    <header className='header'>
      <img src={logo} alt='Logo' className='logo' />

      <div className='search-bar'>
        <input type='text' placeholder='Search all books...' />
        <button className='search-button'>
          <FaArrowRight />
        </button>
      </div>

      <div className='header-actions'>
        <button className='login-button'>Login</button>
      </div>
    </header>
  )
}

export default Header
