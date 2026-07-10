import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

function Layout({ children }) {
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [userName] = useState('Usuário')

  const toggleMenu = () => {
    setMenuOpen(!menuOpen)
  }

  const navigateTo = (path) => {
    navigate(path)
    setMenuOpen(false)
  }

  return (
    <div className="mobile-container">
      {/* Sidebar Menu */}
      <div className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <h2>Menu</h2>
          <button className="close-btn" onClick={toggleMenu}>✕</button>
        </div>
        <div className="sidebar-content">
          <button 
            className={`menu-item ${location.pathname === '/cadastrar-obra' ? 'active' : ''}`}
            onClick={() => navigateTo('/cadastrar-obra')}
          >
            📝 Cadastrar Nova Obra
          </button>
          <button 
            className={`menu-item ${location.pathname === '/meus-lancamentos' ? 'active' : ''}`}
            onClick={() => navigateTo('/meus-lancamentos')}
          >
            🎵 Meus Lançamentos
          </button>
          <button 
            className={`menu-item ${location.pathname === '/cadastrar-show' ? 'active' : ''}`}
            onClick={() => navigateTo('/cadastrar-show')}
          >
            🎤 Cadastrar Novo Show
          </button>
          <button 
            className={`menu-item ${location.pathname === '/shows' ? 'active' : ''}`}
            onClick={() => navigateTo('/shows')}
          >
            🎪 Vitrine de Shows
          </button>
          <button 
            className={`menu-item ${location.pathname === '/assinatura' ? 'active' : ''}`}
            onClick={() => navigateTo('/assinatura')}
          >
            ✍️ Assinatura de Contratos
          </button>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && <div className="overlay" onClick={toggleMenu}></div>}

      {/* Header */}
      <div className="header">
        <div className="header-left">
          <div className="logo">🎵</div>
        </div>
        <div className="header-icons">
          <button className="header-icon-btn">🔔</button>
          <button className="header-icon-btn">⚙️</button>
        </div>
      </div>

      {/* Greeting */}
      <div className="greeting">
        <span>👤</span>
        <span>Olá, {userName}!</span>
      </div>

      {/* Main Content */}
      <div className="page-content">
        {children}
      </div>

      {/* Navigation Bar */}
      <div className="nav-bar">
        <button className="nav-item" onClick={toggleMenu}>
          ☰
        </button>
        <button className="nav-item">🔍</button>
        <button className="nav-item">💬</button>
        <button className="nav-item">👤</button>
      </div>
    </div>
  )
}

export default Layout
