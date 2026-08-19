import { useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import HomePage from './pages/HomePage'
import './App.css'

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
