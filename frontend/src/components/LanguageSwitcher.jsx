import { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../i18n/LanguageContext.jsx'

const LANG_NAMES = {
  en: 'English', es: 'Español', fr: 'Français', de: 'Deutsch',
  ja: '日本語', ar: 'العربية', zh: '中文', pt: 'Português', ko: '한국어',
  hi: 'हिन्दी', bn: 'বাংলা', te: 'తెలుగు', mr: 'मराठी', ta: 'தமிழ்',
  gu: 'ગુજરાતી', ur: 'اردو', kn: 'ಕನ್ನಡ', or: 'ଓଡ଼ିଆ', ml: 'മലയാളം',
  pa: 'ਪੰਜਾਬੀ', as: 'অসমীয়া', mai: 'मैथिली', sa: 'संस्कृतम्', ne: 'नेपाली',
  sd: 'سنڌي', kok: 'कोंकणी', doi: 'डोगरी', mni: 'মৈতৈলোন্',
  brx: 'बड़ो', sat: 'ᱥᱟᱱᱛᱟᱲᱤ', ks: 'कॉशुर',
}

function LanguageSwitcher() {
  const { lang, changeLang, LANG_FLAGS, LANG_GROUPS } = useLanguage()
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)
  const searchRef = useRef(null)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  useEffect(() => {
    if (open && searchRef.current) {
      searchRef.current.focus()
    }
  }, [open])

  useEffect(() => {
    const el = dropdownRef.current
    if (!el) return

    let raf
    if (open) {
      el.style.height = '0px'
      raf = requestAnimationFrame(() => {
        el.style.height = `${el.scrollHeight}px`
      })
      const onEnd = (e) => {
        if (e.target === el && e.propertyName === 'height') {
          el.style.height = 'auto'
          el.removeEventListener('transitionend', onEnd)
        }
      }
      el.addEventListener('transitionend', onEnd)
      return () => {
        cancelAnimationFrame(raf)
        el.removeEventListener('transitionend', onEnd)
      }
    }

    if (el.style.height === 'auto' || el.style.height === '') {
      el.style.height = `${el.scrollHeight}px`
    }
    raf = requestAnimationFrame(() => {
      el.style.height = '0px'
    })
    return () => cancelAnimationFrame(raf)
  }, [open])

  useEffect(() => {
    if (!open) setSearch('')
  }, [open])

  useEffect(() => {
    const el = dropdownRef.current
    if (!open || !el || el.style.height !== 'auto') return undefined
    const from = el.offsetHeight
    const to = el.scrollHeight
    if (from === to) return undefined
    el.style.height = `${from}px`
    const raf = requestAnimationFrame(() => {
      el.style.height = `${to}px`
    })
    const onEnd = (e) => {
      if (e.target === el && e.propertyName === 'height') {
        el.style.height = 'auto'
        el.removeEventListener('transitionend', onEnd)
      }
    }
    el.addEventListener('transitionend', onEnd)
    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('transitionend', onEnd)
    }
  }, [search])

  const filterLangs = (codes) => {
    if (!search.trim()) return codes
    const q = search.toLowerCase()
    return codes.filter(
      (c) =>
        c.toLowerCase().includes(q) ||
        (LANG_NAMES[c] || '').toLowerCase().includes(q)
    )
  }

  const groups = LANG_GROUPS.map((group) => ({
    ...group,
    langs: filterLangs(group.langs),
  }))

  const hasResults = groups.some((g) => g.langs.length > 0)

  const renderGroup = (group) => {
    if (group.langs.length === 0) return null
    return (
      <div key={group.label} className="lang-group">
        <div className="lang-group-label">{group.label}</div>
        {group.langs.map((code) => (
          <button
            key={code}
            className={`lang-option ${code === lang ? 'active' : ''}`}
            onClick={() => { changeLang(code); setOpen(false) }}
          >
            <span className="lang-flag">{LANG_FLAGS[code] || '🌐'}</span>
            <span className="lang-name">{LANG_NAMES[code]}</span>
            <span className="lang-code-tag">{code.toUpperCase()}</span>
            {code === lang && <span className="lang-check">✓</span>}
          </button>
        ))}
      </div>
    )
  }

  return (
    <div className="lang-switcher" ref={ref}>
      <button
        className="lang-trigger"
        onClick={() => setOpen(!open)}
        title="Change language"
      >
        <span className="lang-flag">{LANG_FLAGS[lang]}</span>
        <span className="lang-code">{lang.toUpperCase()}</span>
        <svg className={`lang-chevron ${open ? 'open' : ''}`} width="12" height="12" viewBox="0 0 12 12" fill="none">
          <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <div className={`lang-dropdown ${open ? 'open' : ''}`} ref={dropdownRef}>
        {open && (
          <>
            <div className="lang-search-wrap">
              <svg className="lang-search-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                ref={searchRef}
                className="lang-search"
                type="text"
                placeholder="Search language..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="lang-list">
              {hasResults ? (
                groups.map(renderGroup)
              ) : (
                <div className="lang-no-results">No languages found</div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default LanguageSwitcher
