import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './components/Home'
import Donations from './components/Donations'
import Receivings from './components/Receivings'
import { FaHome, FaCoins, FaSignInAlt } from 'react-icons/fa'
import { GiReceiveMoney } from 'react-icons/gi'
import { CiLogout } from 'react-icons/ci'
import axios from 'axios'
import './App.css'

const App = () => {
  const [isLoginOpen, setLoginOpen] = useState(false)
  const [isSignUp, setSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [location, setLocation] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [error, setError] = useState('')

  const toggleLogin = () => {
    setLoginOpen(!isLoginOpen)
    setSignUp(false)
    setError('')
  }

  const toggleSignUp = () => {
    setSignUp(!isSignUp)
    setError('')
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/login',
        { email, password },
      )
      if (response.data.token) {
        localStorage.setItem('user', JSON.stringify(response.data))
        toggleLogin()
        window.location.reload()
      }
    } catch (err) {
      setError('Invalid credentials. Please try again.')
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post(
        'http://localhost:5000/api/auth/signup',
        { username, email, password, location, phoneNumber },
      )
      if (response.data) {
        alert('Sign-up successful! Please log in.')
        toggleSignUp()
      }
    } catch (err) {
      setError('Sign-up failed. Please try again.')
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('user')
    window.location.reload()
  }

  const user = JSON.parse(localStorage.getItem('user'))

  return (
    <Router>
      <div className='app'>
        <nav className='navbar'>
          <div className='navbar-container'>
            <Link to='/' className='navbar-logo'>
              Donatelt
              <img
                src='/donateltLogoPNG.png'
                alt='Logo'
                className='navbar-logo-image'
              />
            </Link>
            <ul className='navbar-menu'>
              <li>
                <Link to='/' className='navbar-link'>
                  <FaHome /> Home
                </Link>
              </li>
              <li>
                <Link to='/donations' className='navbar-link'>
                  <FaCoins /> Donations
                </Link>
              </li>
              <li>
                <Link to='/receivings' className='navbar-link'>
                  <GiReceiveMoney /> Receivings
                </Link>
              </li>
              <li>
                {user ? (
                  <Link to='#' className='navbar-link' onClick={handleLogout}>
                    <CiLogout /> Logout
                  </Link>
                ) : (
                  <Link to='#' className='navbar-link' onClick={toggleLogin}>
                    <FaSignInAlt /> Login
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </nav>

        {/* Login/Sign Up Pop-up */}
        {isLoginOpen && (
          <div className='login-popup'>
            <div className='login-content'>
              <h2>{isSignUp ? 'Create an Account' : 'Welcome Back!'}</h2>
              <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
                {isSignUp && (
                  <>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      required
                    >
                      <option value=''>Select a city</option>
                      <option value='Koper'>Koper</option>
                      <option value='Ljubljana'>Ljubljana</option>
                      <option value='Maribor'>Maribor</option>
                    </select>
                    <input
                      type='text'
                      placeholder='Name'
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                    <input
                      type='text'
                      placeholder='Phone Number'
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      required
                    />
                  </>
                )}
                <input
                  type='email'
                  placeholder='Email'
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type='password'
                  placeholder='Password'
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                {error && <p className='error-message'>{error}</p>}
                <button type='submit'>{isSignUp ? 'Sign Up' : 'Login'}</button>
              </form>
              <p>
                {isSignUp
                  ? 'Already have an account? '
                  : 'Don’t have an account? '}
                <button className='signup-toggle' onClick={toggleSignUp}>
                  {isSignUp ? 'Login' : 'Sign Up'}
                </button>
              </p>
              <button className='close-popup' onClick={toggleLogin}>
                &times;
              </button>
            </div>
          </div>
        )}

        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/donations' element={<Donations />} />
          <Route path='/receivings' element={<Receivings />} />
        </Routes>

        <footer className='footer'>
          <p>© 2025 Donatelt. All rights reserved.</p>
        </footer>
      </div>
    </Router>
  )
}

export default App
