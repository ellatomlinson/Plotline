import '../css/App.css'
import bwlogo from '../assets/bwlogo.png'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../supabase'
import { useEffect } from 'react'
import type { Session } from '@supabase/supabase-js'

function Login() {
  const navigate = useNavigate()

  // Have the user login with their Google account
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google'
    })

    if (error) console.error('Error logging in:', error)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) navigate('/dashboard')
    })

    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session: Session | null) => {
        if (session) navigate('/dashboard')
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

  return (
    <div className='login-container'>
      <div className='top-right-ellipse'></div>
      <div className='bottom-left-ellipse'></div>
      <div className='welcome-panel'>
        <div className='rectangle'>
          <div className='welcome-content'>
            <img src={bwlogo} alt='Logo' className='bw-logo' />
            <p className='welcome-text'>Your library. Your universe.</p>
          </div>
        </div>
      </div>
      <div className='login-panel'>
        <div className='login-content'>
          <p className='welcome-text'>Sign in with your Google account</p>
          <button className='signin-button' onClick={handleLogin}>
            Sign In
          </button>
        </div>
      </div>
    </div>
  )
}

export default Login
