import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import Auth from './Auth'

const Header = () => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isNavOpen, setIsNavOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [showAuth, setShowAuth] = useState(false)

  return (
    <>
      <header className="header section" data-header>
        <div className="container">
          <button onClick={() => navigate('/')} className="logo">
            <img src="/04-logo.png" height="60px" alt="Blogy logo" />
          </button>

          <nav className={`navbar ${isNavOpen ? 'active' : ''}`} data-navbar>
            <div className="navbar-header">
              <h3 className="navbar-title">Menu</h3>
              <button className="navbar-close" onClick={() => setIsNavOpen(false)}>✕</button>
            </div>
            <ul className="navbar-list">
              <li className="navbar-item">
                <a href="/" className="navbar-link desktop-link" onClick={() => navigate('/')}>Home</a>
                <a href="/" className="navbar-link mobile-link" onClick={() => {navigate('/'); setIsNavOpen(false)}}>Home</a>
              </li>
              <li className="navbar-item">
                {/* <a href="#" className="navbar-link desktop-link">Recent Post</a> */}
                {/* <a href="#" className="navbar-link mobile-link">Dashboard</a> */}
              </li>
              <li className="navbar-item">
                {/* <a href="#" className="navbar-link desktop-link">Membership</a> */}
                {/* <a href="#" className="navbar-link mobile-link">Ideas</a> */}
              </li>
              {!user && (
                <li className="navbar-item mobile-only">
                  <a href="#" className="navbar-link mobile-link" onClick={() => {setShowAuth(true); setIsNavOpen(false)}}>Start Writing..</a>
                </li>
              )}
              <li className="navbar-item mobile-only">
                <a href="#" className="navbar-link mobile-link">Connect zerofourr</a>
              </li>
            </ul>
          </nav>

          <div className="wrapper">
            <button 
              className="search-btn" 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <ion-icon name="search-outline"></ion-icon>
              <span className="span">Search</span>
            </button>

            <button 
              className={`nav-toggle-btn ${isNavOpen ? 'active' : ''}`}
              onClick={() => setIsNavOpen(!isNavOpen)}
            >
              <span className="span one"></span>
              <span className="span two"></span>
              <span className="span three"></span>
            </button>

            {user ? (
              <div className="user-menu">
                <button className="btn" onClick={() => navigate('/write')}>Write</button>
                <button className="profile-btn" onClick={() => navigate('/profile')}>
                  <img src={user.avatar} alt={user.name} className="user-avatar" />
                </button>
              </div>
            ) : (
              <button className="btn" onClick={() => setShowAuth(true)}>Join</button>
            )}
          </div>
        </div>
      </header>

      {/* Search Bar */}
      <div className={`search-bar ${isSearchOpen ? 'active' : ''}`}>
        <div className="container">
          <div className="input-wrapper">
            <input type="search" name="search" placeholder="Search" className="input-field" />
            <button className="search-submit-btn" type="submit">
              <ion-icon name="search-outline"></ion-icon>
            </button>
            <button 
              className="search-close-btn" 
              onClick={() => setIsSearchOpen(false)}
            >
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
          <p className="search-bar-text">Please enter at least 3 characters</p>
        </div>
      </div>

      <div 
        className={`overlay ${isSearchOpen ? 'active' : ''}`} 
        onClick={() => setIsSearchOpen(false)}
      ></div>
      
      <div 
        className={`mobile-overlay ${isNavOpen ? 'active' : ''}`} 
        onClick={() => setIsNavOpen(false)}
      ></div>
      
      {showAuth && <Auth onClose={() => setShowAuth(false)} />}
    </>
  )
}

export default Header