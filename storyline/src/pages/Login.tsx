import '../css/App.css'
import bwlogo from '../assets/bwlogo.png'
import { useGoogleLogin } from '@react-oauth/google'

function Login() {
  const login = useGoogleLogin({
    onSuccess: tokenResponse => {
      console.log(tokenResponse)
      localStorage.setItem('access_token', tokenResponse.access_token)
    },
    onError: error => {
      console.error('Login Failed:', error)
    }
  })

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
          <button className='signin-button' onClick={() => login()}>Sign In</button>
        </div>
      </div>
    </div>
  )
}

export default Login
