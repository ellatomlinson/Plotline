import '../css/App.css'
import logo from '../assets/logo.png'
import { FaArrowRight } from 'react-icons/fa'
import { useState } from 'react'
import SearchResultsModal from './SearchResultsModal'

const Header = () => {
  const [query, setQuery] = useState('')
  const [searchResultsModalOpen, setSearchResultsModalOpen] =
    useState<boolean>(false)

  function onSearchResultsModalClose(): void {
    setSearchResultsModalOpen(false)
  }

  const handleSearch = async () => {
    if (!query) return
    const result = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`
    )
    const data = await result.json()
    console.log(data.items) // Replace with UI update
    setSearchResultsModalOpen(true)
  }

  const handleKeyDown = (e: { key: string }) => {
    if (e.key === 'Enter') handleSearch()
  }

  return (
    <>
      <header className='header'>
        <img src={logo} alt='Logo' className='logo' />

        <div className='search-bar'>
          <input
            type='text'
            placeholder='Search all books...'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button className='search-button' onClick={handleSearch}>
            <FaArrowRight />
          </button>
        </div>

        <div className='header-actions'></div>
      </header>
      <SearchResultsModal
        isOpen={searchResultsModalOpen}
        results={[]}
        onClose={onSearchResultsModalClose}
        query={query}
      />
    </>
  )
}

export default Header
