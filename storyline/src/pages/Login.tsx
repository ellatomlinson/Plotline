import '../css/App.css'
import bwlogo from '../assets/bwlogo.png'

function Login() {
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
          <button className='signin-button'>Sign In</button>
        </div>
      </div>
    </div>
  )
}

export default Login
