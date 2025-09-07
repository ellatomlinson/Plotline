import '../css/App.css'
import logo from '../assets/logo.png'
import { FaArrowRight } from 'react-icons/fa'
import { FaChartSimple } from 'react-icons/fa6'
import { useState } from 'react'
import SearchResultsModal from './SearchResultsModal'
import type { GoogleBooksApiResponse } from '../types'
import { supabase } from '../../supabase'
import { useNavigate } from 'react-router-dom'

const FIRST = 0

const Header = () => {
  const [query, setQuery] = useState('')
  const [searchResultsModalOpen, setSearchResultsModalOpen] =
    useState<boolean>(false)
  const [books, setBooks] = useState<GoogleBooksApiResponse>()
  const navigate = useNavigate()

  function onSearchResultsModalClose(): void {
    setSearchResultsModalOpen(false)
    setBooks(undefined)
    setQuery('')
  }

  // Search for books using the Google Books API
  const handleSearch = async (startIndex = FIRST) => {
    if (!query) return
    try {
      const result = await fetch(
        `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
          query
        )}&startIndex=${startIndex}&maxResults=10&fields=totalItems,items(id,volumeInfo,accessInfo)`
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

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()
    if (error) {
      alert('Failed to sign out. Please refresh the page and try again.')
      console.error('Error signing out:', error)
    } else {
      navigate('/')
    }
  }

  const navigateToStats = async () => {
    navigate('/statistics')
  }

  return (
    <>
      <header className='header'>
        <div className='header-section'>
          <img src={logo} alt='Logo' className='logo' />
        </div>

        <div className='search-wrapper'>
          <div className='search-bar'>
            <input
              type='text'
              placeholder='Search all books...'
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className='search-button' onClick={() => handleSearch()}>
              <FaArrowRight />
            </button>
          </div>
        </div>

        <div className='header-section'>
          <button
            className='statistics-button'
            onClick={() => navigateToStats()}
          >
            <FaChartSimple style={{ fontSize: '1rem' }} />
          </button>
          <button className='sign-out-button' onClick={() => handleSignOut()}>
            Sign Out
          </button>
        </div>
      </header>
      {books && (
        <SearchResultsModal
          isOpen={searchResultsModalOpen}
          results={books}
          onClose={onSearchResultsModalClose}
          query={query}
          onPaginate={handleSearch}
        />
      )}
    </>
  )
}

export default Header
