import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { FaFacebookF, FaInstagram } from 'react-icons/fa6'
import HomePage from './pages/HomePage'
import './App.css'

const instagramUrl = 'https://www.instagram.com/vijaysharmaphotography_?igsi=ZG92ZHF2cXR2NTE='
const facebookUrl = 'https://www.facebook.com/vijaysharmaphotography_/'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="site-shell">
      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Vijay Sharma Photography home">
          <span>VS</span>
          <small>PHOTOGRAPHY</small>
        </a>
        <button className="menu-toggle" type="button" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen((open) => !open)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
        <div className="header-socials" aria-label="Social media links">
          <a href={instagramUrl} aria-label="Open Vijay Sharma Photography on Instagram" target="_blank" rel="noreferrer"><FaInstagram /></a>
          <a href={facebookUrl} aria-label="Open Vijay Sharma Photography on Facebook" target="_blank" rel="noreferrer"><FaFacebookF /></a>
        </div>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'}>
          <a href="#work" onClick={() => setMenuOpen(false)}>Selected work</a>
          <a href="#about" onClick={() => setMenuOpen(false)}>About</a>
          <a className="nav-contact" href="#contact" onClick={() => setMenuOpen(false)}>Start a project <span>↗</span></a>
        </nav>
      </header>
      <HomePage />
    </div>
  )
}

export default App
