import './css/App.css'
import Home from './pages/Home'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Stats from './pages/Stats'

const clientId = import.meta.env.VITE_CLIENT_ID

function App() {
  return (
    <GoogleOAuthProvider clientId={clientId}>
      <Router>
        <Routes>
          <Route path='/dashboard' element={<Home />} />
          <Route path='/' element={<Login />} />
          <Route path='/statistics' element={<Stats />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
