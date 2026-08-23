import Logo from './Logo.jsx'
import LanguageSwitcher from './LanguageSwitcher.jsx'
import { useLanguage } from '../i18n/LanguageContext.jsx'

function Header({ page, onNavigate }) {
  const { t } = useLanguage()

  const links = [
    { id: 'landing', label: t.nav.home },
    { id: 'analyzer', label: t.nav.analyzer },
    { id: 'history', label: t.nav.history },
  ]

  return (
    <header className="site-header">
      <button
        className="brand"
        onClick={() => onNavigate('landing')}
      >
        <Logo size={36} />
        <span className="brand-text">
          Product<span className="brand-accent">Analyzer</span>
        </span>
      </button>
      <div className="header-right">
        <nav className="nav">
          {links.map((link) => (
            <button
              key={link.id}
              className={`nav-link ${page === link.id ? 'active' : ''}`}
              onClick={() => onNavigate(link.id)}
            >
              {link.label}
            </button>
          ))}
        </nav>
        <LanguageSwitcher />
      </div>
    </header>
  )
}

export default Header
