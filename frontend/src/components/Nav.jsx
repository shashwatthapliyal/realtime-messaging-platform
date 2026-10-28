import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  ChevronDown,
  LogOut,
  MessageSquare,
  Settings,
  UserRound,
  UsersRound,
} from 'lucide-react'
import axios from 'axios'
import { BASE_URL } from '@/assets/constants'
import '../Navbar.css'

function Nav() {
  const location = useLocation()
  const profileRef = useRef(null)
  const [profileOpen, setProfileOpen] = useState(false)
  const isLanding = location.pathname === '/'
  const isLogin = location.pathname === '/app/login'
  const isPublicPage = isLanding || isLogin

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false)
      }
    }

    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [])

  const handleLogout = async () => {
    try {
      await axios.post(`${BASE_URL}/logout`, {}, { withCredentials: true })
      window.location.assign('/')
    } catch (error) {
      console.error('Unable to log out:', error)
    }
  }

  return (
    <header className="glass-navbar">
      <div className="navbar-inner">
        <Link to={isPublicPage ? '/' : '/app/feed'} className="navbar-logo">
          <span className="logo-icon"><MessageSquare aria-hidden="true" size={20} /></span>
          <span className="logo-text">Connect<span className="logo-accent">ly</span></span>
        </Link>

        {isPublicPage ? (
          <div className="navbar-actions">
            {isLanding && <Link to="/app/login" className="navbar-cta">Sign in</Link>}
            {isLogin && <Link to="/" className="navbar-secondary-link">Back to home</Link>}
          </div>
        ) : (
          <>
            <nav className="navbar-links" aria-label="Main navigation">
              <NavLink to="/app/feed" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <MessageSquare aria-hidden="true" size={18} />
                <span>Discover</span>
              </NavLink>
              <NavLink to="/app/connections" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <UsersRound aria-hidden="true" size={18} />
                <span>Connections</span>
              </NavLink>
              <NavLink to="/app/requests" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                <UsersRound aria-hidden="true" size={18} />
                <span>Requests</span>
              </NavLink>
            </nav>

            <div className="profile-wrapper" ref={profileRef}>
              <button
                type="button"
                className={`profile-trigger ${profileOpen ? 'selected' : ''}`}
                onClick={() => setProfileOpen((open) => !open)}
                aria-label="Open account menu"
                aria-expanded={profileOpen}
              >
                <span className="profile-avatar"><UserRound aria-hidden="true" size={20} /></span>
                <span className="profile-label">Account</span>
                <ChevronDown aria-hidden="true" size={16} className={`chevron ${profileOpen ? 'rotate' : ''}`} />
              </button>

              {profileOpen && (
                <div className="profile-dropdown">
                  <p className="dropdown-title">Your account</p>
                  <Link to="/app/profile" className="dropdown-item" onClick={() => setProfileOpen(false)}><UserRound size={17} /><span>Profile</span></Link>
                  <Link to="/app/settings" className="dropdown-item" onClick={() => setProfileOpen(false)}><Settings size={17} /><span>Settings</span></Link>
                  <button type="button" className="dropdown-item logout-item" onClick={handleLogout}>
                    <LogOut size={17} /><span>Log out</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </header>
  )
}

export default Nav
