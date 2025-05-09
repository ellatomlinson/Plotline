import '../css/App.css'
import logo from '../assets/logo.png'
import { FaArrowRight } from 'react-icons/fa'
import { useState } from 'react'
import SearchResultsModal from './SearchResultsModal'
import type { GoogleBooksApiResponse } from '../types'

const Header = () => {
  const [query, setQuery] = useState('')
  const [searchResultsModalOpen, setSearchResultsModalOpen] =
    useState<boolean>(false)
  const [books, setBooks] = useState<GoogleBooksApiResponse>()

  function onSearchResultsModalClose(): void {
    setSearchResultsModalOpen(false)
    setBooks(undefined)
    setQuery('')
  }

  // Search for books using the Google Books API
  const handleSearch = async () => {
    if (!query) return
    try {
      const result = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&fields=items(volumeInfo,accessInfo)`
      )
      const books: GoogleBooksApiResponse = await result.json()
      setBooks(books)
      setSearchResultsModalOpen(true)
    } catch (error) {
      console.error('Error fetching books:', error)
      setBooks(undefined)
    }
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
      {books && (
        <SearchResultsModal
          isOpen={searchResultsModalOpen}
          results={books}
          onClose={onSearchResultsModalClose}
          query={query}
        />
      )}
    </>
  )
}

export default Header
